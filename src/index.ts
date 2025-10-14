// Re-export everything the generator provides
export * from "./gen";

// Convenience: create a configured API instance in one call
import { Configuration } from "./gen";

export type FaradayClientOptions = {
  baseUrl: string;
  apiKey?: string;              // if you use bearer auth
  headers?: Record<string, string>;
};

export const makeConfig = (opts: FaradayClientOptions) =>
  new Configuration({
    basePath: opts.baseUrl,
    headers: {
      ...(opts.apiKey ? { Authorization: `Bearer ${opts.apiKey}` } : {}),
      ...(opts.headers ?? {})
    }
  });

/**
 * Example helper for creating an API class with default config.
 * Replace `DefaultApi` with the actual API class your generator emits
 * (e.g., `TransactionsApi`, `QuotesApi`, etc.).
 */
export const faradayClient = <T extends new (cfg: Configuration) => InstanceType<T>>(
  ApiCtor: T,
  opts: FaradayClientOptions
) => new ApiCtor(makeConfig(opts));

