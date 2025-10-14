// Re-export generated surfaces
export * from "./gen/apis";
export * from "./gen/models";
export * from "./gen/runtime";
import { Configuration } from "./gen/runtime";

export type FaradayClientOptions = {
  baseUrl: string;
  apiKey?: string;
  headers?: Record<string, string>;
};

export const makeConfig = (opts: FaradayClientOptions) =>
  new Configuration({
    basePath: opts.baseUrl,
    headers: {
      ...(opts.apiKey ? { Authorization: `Bearer ${opts.apiKey}` } : {}),
      ...(opts.headers ?? {}),
    },
  });

export const faradayClient = <T extends new (cfg: Configuration) => InstanceType<T>>(
  ApiCtor: T,
  opts: FaradayClientOptions
) => new ApiCtor(makeConfig(opts));
