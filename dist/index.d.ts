export * from "./gen/apis";
export * from "./gen/models";
export * from "./gen/runtime";
import { Configuration } from "./gen/runtime";
export type FaradayClientOptions = {
    baseUrl: string;
    apiKey?: string;
    headers?: Record<string, string>;
};
export declare const makeConfig: (opts: FaradayClientOptions) => Configuration;
export declare const faradayClient: <T extends new (cfg: Configuration) => InstanceType<T>>(ApiCtor: T, opts: FaradayClientOptions) => InstanceType<T>;
//# sourceMappingURL=index.d.ts.map