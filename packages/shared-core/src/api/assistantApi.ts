import type { ApiClient } from "./client";
import { apiClient } from "./client";
import {
  parseChatEvent,
  parseConversation,
  type ChatEvent,
  type ChatRequest,
  type ConfirmActionRequest,
  type Conversation,
  type ConversationSummary,
} from "../assistant";
import { ConversationSummarySchema } from "../schemas/assistant";

const PATH = "/assistant";

export class AssistantHttpError extends Error {
  constructor(readonly status: number) {
    super(`HTTP ${status}`);
  }
}

function parseSseFrame(frame: string): ChatEvent | null {
  const data = frame
    .split("\n")
    .filter((line) => line.startsWith("data:"))
    .map((line) => line.slice(5).replace(/^ /, ""))
    .join("\n");
  if (!data) return null;
  try {
    return parseChatEvent(JSON.parse(data));
  } catch {
    return null;
  }
}

export async function* readChatEvents(response: Response): AsyncGenerator<ChatEvent> {
  if (!response.body) {
    const text = (await response.text()).replace(/\r\n/g, "\n");
    for (const frame of text.split("\n\n")) {
      const event = parseSseFrame(frame);
      if (event) yield event;
    }
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      buffer += decoder.decode(value, { stream: !done }).replace(/\r\n/g, "\n");
      let boundary = buffer.indexOf("\n\n");
      while (boundary !== -1) {
        const event = parseSseFrame(buffer.slice(0, boundary));
        buffer = buffer.slice(boundary + 2);
        if (event) yield event;
        boundary = buffer.indexOf("\n\n");
      }
      if (done) break;
    }
    const event = parseSseFrame(buffer);
    if (event) yield event;
  } finally {
    reader.releaseLock();
  }
}

async function openStream(
  client: ApiClient,
  path: string,
  body: unknown,
  signal?: AbortSignal
): Promise<Response> {
  const response = await client.raw(path, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "text/event-stream" },
    body: JSON.stringify(body),
    signal,
  });
  if (!response.ok) throw new AssistantHttpError(response.status);
  return response;
}

export const assistantApi = {
  sendMessage: async function* (
    request: ChatRequest,
    signal?: AbortSignal,
    client: ApiClient = apiClient
  ): AsyncGenerator<ChatEvent> {
    yield* readChatEvents(await openStream(client, `${PATH}/chat`, request, signal));
  },

  confirmAction: async function* (
    actionId: string,
    request: ConfirmActionRequest,
    signal?: AbortSignal,
    client: ApiClient = apiClient
  ): AsyncGenerator<ChatEvent> {
    yield* readChatEvents(
      await openStream(client, `${PATH}/actions/${actionId}/confirm`, request, signal)
    );
  },

  listConversations: (client: ApiClient = apiClient): Promise<ConversationSummary[]> =>
    client
      .get<unknown[]>(`${PATH}/conversations`)
      .then((data) => data.map((item) => ConversationSummarySchema.parse(item))),

  getConversation: (id: string, client: ApiClient = apiClient): Promise<Conversation> =>
    client.get<unknown>(`${PATH}/conversations/${id}`).then(parseConversation),

  deleteConversation: (id: string, client: ApiClient = apiClient): Promise<void> =>
    client.delete(`${PATH}/conversations/${id}`),
};
