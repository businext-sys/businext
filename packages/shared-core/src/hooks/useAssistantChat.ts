"use client";
import { useEffect, useState, useSyncExternalStore } from "react";
import type { ApiClient } from "../api/client";
import { assistantApi } from "../api/assistantApi";
import type { ChatMessage } from "../assistant";
import { createAssistantChat } from "../assistant/chat";

export type UseAssistantChatOptions = {
  client?: ApiClient;
  conversationId?: string | null;
  messages?: ChatMessage[];
};

export function useAssistantChat({ client, conversationId, messages }: UseAssistantChatOptions = {}) {
  const [chat] = useState(() =>
    createAssistantChat({
      conversationId,
      messages,
      transport: {
        sendMessage: (request, signal) => assistantApi.sendMessage(request, signal, client),
        confirmAction: (actionId, request, signal) =>
          assistantApi.confirmAction(actionId, request, signal, client),
      },
    })
  );
  const state = useSyncExternalStore(chat.subscribe, chat.getState, chat.getState);

  useEffect(() => () => chat.stop(), [chat]);

  return {
    ...state,
    send: chat.send,
    confirm: chat.confirm,
    stop: chat.stop,
    retry: chat.retry,
  };
}
