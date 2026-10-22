import type {
  ChatEvent,
  ChatMessage,
  ChatRequest,
  ConfirmActionRequest,
} from "./index";

export type AssistantChatStatus = "idle" | "streaming" | "error";

export type AssistantChatState = {
  conversationId: string | null;
  messages: ChatMessage[];
  status: AssistantChatStatus;
  error: string | null;
  activity: string | null;
};

export type AssistantChatTransport = {
  sendMessage(request: ChatRequest, signal: AbortSignal): AsyncIterable<ChatEvent>;
  confirmAction(
    actionId: string,
    request: ConfirmActionRequest,
    signal: AbortSignal
  ): AsyncIterable<ChatEvent>;
};

export type AssistantChatOptions = {
  transport: AssistantChatTransport;
  conversationId?: string | null;
  messages?: ChatMessage[];
  maxRetries?: number;
  retryDelayMs?: number;
};

export type AssistantChat = {
  getState(): AssistantChatState;
  subscribe(listener: () => void): () => void;
  send(text: string): Promise<void>;
  confirm(actionId: string, decision: ConfirmActionRequest["decision"]): Promise<void>;
  stop(): void;
  retry(): Promise<void>;
  reset(conversation?: { id?: string | null; messages: ChatMessage[] }): void;
};

export const ASSISTANT_ERROR_TEXT = "El asistente no ha podido responder.";
export const ASSISTANT_OFFLINE_TEXT = "Sin conexión. Revisa tu red y vuelve a intentarlo.";

export function applyChatEvent(state: AssistantChatState, event: ChatEvent): AssistantChatState {
  switch (event.type) {
    case "message_start":
      return {
        ...state,
        conversationId: event.conversation_id,
        messages: [
          ...state.messages,
          {
            id: event.message_id,
            conversation_id: event.conversation_id,
            role: "assistant",
            blocks: [],
            created_at: new Date().toISOString(),
          },
        ],
      };
    case "text_delta":
      return updateMessage({ ...state, activity: null }, event.message_id, (message) => {
        const last = message.blocks[message.blocks.length - 1];
        if (last?.type === "text") {
          return {
            ...message,
            blocks: [...message.blocks.slice(0, -1), { ...last, text: last.text + event.delta }],
          };
        }
        return { ...message, blocks: [...message.blocks, { type: "text", text: event.delta }] };
      });
    case "tool_status":
      return { ...state, activity: event.label };
    case "block":
      return updateMessage(state, event.message_id, (message) => ({
        ...message,
        blocks: [...message.blocks, event.block],
      }));
    default:
      return state;
  }
}

function updateMessage(
  state: AssistantChatState,
  messageId: string,
  update: (message: ChatMessage) => ChatMessage
): AssistantChatState {
  const exists = state.messages.some((message) => message.id === messageId);
  const messages = exists
    ? state.messages
    : [
        ...state.messages,
        {
          id: messageId,
          conversation_id: state.conversationId ?? "",
          role: "assistant" as const,
          blocks: [],
          created_at: new Date().toISOString(),
        },
      ];
  return {
    ...state,
    messages: messages.map((message) => (message.id === messageId ? update(message) : message)),
  };
}

function httpStatus(error: unknown): number | null {
  const status = (error as { status?: unknown } | null)?.status;
  return typeof status === "number" ? status : null;
}

function isRetryable(error: unknown): boolean {
  const status = httpStatus(error);
  return status === null || status >= 500;
}

export function createAssistantChat(options: AssistantChatOptions): AssistantChat {
  const { transport, maxRetries = 2, retryDelayMs = 500 } = options;
  let state: AssistantChatState = {
    conversationId: options.conversationId ?? null,
    messages: options.messages ?? [],
    status: "idle",
    error: null,
    activity: null,
  };
  const listeners = new Set<() => void>();
  let abortController: AbortController | null = null;
  let lastRun: { open: (signal: AbortSignal) => AsyncIterable<ChatEvent>; messages: ChatMessage[] } | null =
    null;
  let localIds = 0;

  const setState = (next: Partial<AssistantChatState>) => {
    state = { ...state, ...next };
    listeners.forEach((listener) => listener());
  };

  const wait = (ms: number, signal: AbortSignal) =>
    new Promise<void>((resolve) => {
      const timer = setTimeout(resolve, ms);
      signal.addEventListener("abort", () => {
        clearTimeout(timer);
        resolve();
      });
    });

  const run = async (open: (signal: AbortSignal) => AsyncIterable<ChatEvent>) => {
    const controller = new AbortController();
    abortController = controller;
    lastRun = { open, messages: state.messages };
    setState({ status: "streaming", error: null });

    for (let attempt = 0; ; attempt++) {
      let received = false;
      try {
        for await (const event of open(controller.signal)) {
          received = true;
          if (event.type === "error") {
            setState({ status: "error", error: event.message, activity: null });
            return;
          }
          setState(applyChatEvent(state, event));
        }
        setState({ status: "idle", activity: null });
        return;
      } catch (error) {
        if (controller.signal.aborted) {
          if (abortController === controller) setState({ status: "idle", activity: null });
          return;
        }
        if (!received && attempt < maxRetries && isRetryable(error)) {
          await wait(retryDelayMs * 2 ** attempt, controller.signal);
          if (controller.signal.aborted) {
            if (abortController === controller) setState({ status: "idle", activity: null });
            return;
          }
          continue;
        }
        setState({
          status: "error",
          activity: null,
          error: httpStatus(error) === null ? ASSISTANT_OFFLINE_TEXT : ASSISTANT_ERROR_TEXT,
        });
        return;
      }
    }
  };

  return {
    getState: () => state,

    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },

    async send(text) {
      const message = text.trim();
      if (!message || state.status === "streaming") return;
      localIds += 1;
      setState({
        messages: [
          ...state.messages,
          {
            id: `local-${localIds}`,
            conversation_id: state.conversationId ?? "",
            role: "user",
            blocks: [{ type: "text", text: message }],
            created_at: new Date().toISOString(),
          },
        ],
      });
      await run((signal) =>
        transport.sendMessage({ conversation_id: state.conversationId, message }, signal)
      );
    },

    async confirm(actionId, decision) {
      const conversationId = state.conversationId;
      if (!conversationId || state.status === "streaming") return;
      setState({
        messages: state.messages.map((message) => ({
          ...message,
          blocks: message.blocks.map((block) =>
            block.type === "confirmation" && block.action_id === actionId
              ? { ...block, status: decision === "confirm" ? "confirmed" : "cancelled" }
              : block
          ),
        })),
      });
      await run((signal) =>
        transport.confirmAction(actionId, { conversation_id: conversationId, decision }, signal)
      );
    },

    stop() {
      abortController?.abort();
    },

    reset(conversation) {
      abortController?.abort();
      lastRun = null;
      setState({
        conversationId: conversation?.id ?? null,
        messages: conversation?.messages ?? [],
        status: "idle",
        error: null,
        activity: null,
      });
    },

    async retry() {
      if (!lastRun || state.status !== "error") return;
      const { open, messages } = lastRun;
      setState({ messages });
      await run(open);
    },
  };
}
