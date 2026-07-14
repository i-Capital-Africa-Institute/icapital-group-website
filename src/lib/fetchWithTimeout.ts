/**
 * Fetch wrapper for GraphQL with a hard time limit.
 * Avoids undici TimeoutError dumps from AbortSignal.timeout / invalid fetchOptions.timeout.
 */
export function createTimedFetch(timeoutMs = 20_000): typeof fetch {
  return async (input, init = {}) => {
    const controller = new AbortController();
    const timer = setTimeout(() => {
      controller.abort();
    }, timeoutMs);

    try {
      const upstream = init.signal;
      if (upstream) {
        if (upstream.aborted) {
          controller.abort();
        } else {
          upstream.addEventListener("abort", () => controller.abort(), {
            once: true,
          });
        }
      }

      return await fetch(input, {
        ...init,
        signal: controller.signal,
      });
    } catch (error) {
      if (
        error instanceof Error &&
        (error.name === "AbortError" || error.name === "TimeoutError")
      ) {
        const url =
          typeof input === "string"
            ? input
            : input instanceof URL
              ? input.toString()
              : "request";
        console.warn(
          `[fetch] Timed out after ${timeoutMs}ms → ${url}`,
        );
        throw new Error(`Request timed out after ${timeoutMs}ms`);
      }
      throw error;
    } finally {
      clearTimeout(timer);
    }
  };
}
