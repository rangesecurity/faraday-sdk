// Re-export generated surfaces
export * from "./gen/apis";
export * from "./gen/models";
export * from "./gen/runtime";
import { Configuration } from "./gen/runtime";
export const makeConfig = (opts) => new Configuration({
    basePath: opts.baseUrl,
    headers: {
        ...(opts.apiKey ? { Authorization: `Bearer ${opts.apiKey}` } : {}),
        ...(opts.headers ?? {}),
    },
});
export const faradayClient = (ApiCtor, opts) => new ApiCtor(makeConfig(opts));
