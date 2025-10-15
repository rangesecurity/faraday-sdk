# Faraday SDK

TypeScript client for the Faraday API 

## Install

```sh
npm install @rangesecurity/faraday-sdk
```

## Basic Usage

```ts
import "dotenv/config";
import { Configuration, ChainsApi } from "faraday-sdk"; 

const baseUrl = process.env.FARADAY_BASE_URL || "https://api.faraday.range.org";

const cfg = new Configuration({
  basePath: baseUrl,
  headers: { accept: "application/json" },
});
const chainsApi = new ChainsApi(cfg);

/**
 * Example: Fetch all supported chains
 */
const main = async (): Promise<void> => {
  try {
    const res = await chainsApi.listNetworks();

    console.log("Chains:");
    console.dir(res, { depth: null });
  } catch (err) {
    console.error("Error fetching chains:");
    console.error(err instanceof Error ? err.message : err);
    process.exitCode = 1;
  }
};

main().catch((err) => {
  console.error("Unhandled exception:", err);
  process.exit(1);
});
````
