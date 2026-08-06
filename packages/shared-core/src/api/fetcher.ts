const MAX_RETRIES = 3;

/**
 * Fetch con reintentos (backoff exponencial) para GET. No reintenta errores
 * 4xx (asume que un reintento no cambiara el resultado).
 * Movido desde apps/web/src/lib/fetcher.ts (issue #16).
 */
export async function fetcher<T>(url: string): Promise<T> {
  let lastError: Error = new Error("Max retries exceeded");

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(url);

      if (response.ok) {
        return response.json() as Promise<T>;
      }

      // Don't retry 4xx client errors
      if (response.status < 500) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      lastError = new Error(`HTTP ${response.status}: ${response.statusText}`);
    } catch (err) {
      if (err instanceof Error && /^HTTP 4/.test(err.message)) throw err;
      lastError = err instanceof Error ? err : new Error(String(err));
    }

    if (attempt < MAX_RETRIES - 1) {
      await new Promise((resolve) =>
        setTimeout(resolve, Math.pow(2, attempt) * 500)
      );
    }
  }

  throw lastError;
}
