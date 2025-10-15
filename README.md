# Faraday SDK

TypeScript client for the Faraday API 

## Install

```bash
npm install @rangesecurity/faraday-sdk
```

## Basic Usage

```ts
import { faradayClient, makeConfig, DefaultApi } from "faraday-sdk";

const baseUrl = "https://api.faraday.range.org";

// Option A: generic helper + API class
const api = faradayClient(DefaultApi, { baseUrl, apiKey: "YOUR_TOKEN" });

// Option B: manual configuration
// import { Configuration, DefaultApi } from "faraday-sdk";
// const cfg = makeConfig({ baseUrl, apiKey: "YOUR_TOKEN" });
// const api = new DefaultApi(cfg);

const run = async () => {
  const res = await api.healthCheck();   // replace with a real method from your API
  console.log(res);
};

run();
````
