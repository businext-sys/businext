"use client";
import useSWR from "swr";
import type { ApiClient } from "../api/client";
import { assistantApi } from "../api/assistantApi";
import type { ConversationSummary } from "../assistant";

const SWR_KEY = "/assistant/conversations";

export function useAssistantConversations({ client }: { client?: ApiClient } = {}) {
  const {
    data: conversations = [],
    isLoading: loading,
    error,
    mutate,
  } = useSWR<ConversationSummary[]>(SWR_KEY, () => assistantApi.listConversations(client));

  const deleteConversation = async (id: string): Promise<boolean> => {
    try {
      await mutate(
        async (current: ConversationSummary[] = []) => {
          await assistantApi.deleteConversation(id, client);
          return current.filter((c) => c.id !== id);
        },
        {
          optimisticData: (current: ConversationSummary[] = []) =>
            current.filter((c) => c.id !== id),
          rollbackOnError: true,
          revalidate: false,
        }
      );
      return true;
    } catch {
      return false;
    }
  };

  return { conversations, loading, error, mutate, deleteConversation };
}
