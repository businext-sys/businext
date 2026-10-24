import { fetch as expoFetch } from "expo/fetch";
import { createApiClient } from "@businext/shared-core/api";
import { getApiBaseUrl } from "./bootstrapApiClient";
import { getValidAccessToken } from "./session";

/**
 * Cliente del chat del asistente (issue #76). Usa `expo/fetch` porque el
 * `fetch` global de React Native no expone el body como stream, y sin el
 * stream las respuestas SSE solo se verian al terminar.
 */
export const assistantClient = createApiClient({
  baseURL: getApiBaseUrl(),
  apiPrefix: "",
  getAuthToken: getValidAccessToken,
  fetch: expoFetch as unknown as typeof fetch,
});
