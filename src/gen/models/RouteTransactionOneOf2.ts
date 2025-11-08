import {
  RouteTransaction,
  RouteTransactionOneOf1,
  RouteTransactionOneOf2,
} from "faraday-sdk";
import {
  JsonRpcProvider,
  HDNodeWallet,
  parseUnits,
  TransactionRequest,
} from "ethers";
import { Connection, Keypair, VersionedTransaction } from "@solana/web3.js";
import * as bip39 from "bip39";
import { derivePath } from "ed25519-hd-key";
import readline from "readline/promises";

/* -------------------------------------------------------------------------- */
/*                                  Prompts                                   */
/* -------------------------------------------------------------------------- */

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function confirm(prompt: string): Promise<boolean> {
  const ans = (await rl.question(`${prompt} (y/N): `)).trim().toLowerCase();
  return ans === "y" || ans === "yes";
}

/* -------------------------------------------------------------------------- */
/*                             EVM Transaction Signer                         */
/* -------------------------------------------------------------------------- */

export async function signEvm(txInfo: RouteTransactionOneOf1): Promise<string> {
  const rpc = process.env.EVM_RPC!;
  const mnemonic = process.env.EVM_MNEMONIC!;
  const provider: JsonRpcProvider = new JsonRpcProvider(rpc);
  const wallet: HDNodeWallet =
    HDNodeWallet.fromPhrase(mnemonic).connect(provider);

  const nonce = await provider.getTransactionCount(wallet.address);

  // Example: assume msgs[0] is a single call structure { to, data, value? }
  const msg = txInfo.msgs?.[0] ?? {};
  if (!msg.to || !msg.data) throw new Error("Invalid EVM message payload");

  const tx: TransactionRequest = {
    to: msg.to,
    data: msg.data,
    value: BigInt(msg.value ?? 0),
    nonce,
    chainId: Number(txInfo.chain_id) || 42161, // default to Arbitrum if string
    gasLimit: 500_000n,
    maxFeePerGas: parseUnits("30", "gwei"),
    maxPriorityFeePerGas: parseUnits("1", "gwei"),
  };

  const signed = await wallet.signTransaction(tx);
  console.log("\n🧾 Signed EVM transaction (hex):", signed);

  if (await confirm("Submit EVM transaction to network?")) {
    const sent = await provider.sendTransaction(signed);
    console.log("📡 Broadcasted! Hash:", sent.hash);
    return sent.hash;
  }

  return signed;
}

/* -------------------------------------------------------------------------- */
/*                            Solana Transaction Signer                       */
/* -------------------------------------------------------------------------- */

export async function signSvm(txInfo: RouteTransactionOneOf2): Promise<void> {
  const rpc = process.env.SOLANA_RPC!;
  const mnemonic = process.env.SVM_MNEMONIC!;

  const connection = new Connection(rpc, "confirmed");
  const seed = await bip39.mnemonicToSeed(mnemonic);
  const derivedSeed = derivePath("m/44'/501'/0'/0'", seed.toString("hex")).key;
  const keypair = Keypair.fromSeed(derivedSeed);

  console.log("\n🔑 Public key:", keypair.publicKey.toBase58());
  const rawTx = Buffer.from(txInfo.tx_base64, "base64");
  const tx = VersionedTransaction.deserialize(rawTx);
  tx.sign([keypair]);

  const signedBase64 = Buffer.from(tx.serialize()).toString("base64");
  console.log("🧾 Signed Solana tx (base64):", signedBase64);

  if (await confirm("Submit Solana transaction to network?")) {
    const sig = await connection.sendRawTransaction(tx.serialize());
    console.log("📡 Broadcasted! Signature:", sig);
  }
}

/* -------------------------------------------------------------------------- */
/*                           Dispatcher with Type Guard                       */
/* -------------------------------------------------------------------------- */

export async function handleTransaction(tx: RouteTransaction): Promise<void> {
  switch (tx.kind) {
    case "evm":
      await signEvm(tx as RouteTransactionOneOf1);
      break;

    case "svm":
      await signSvm(tx as RouteTransactionOneOf2);
      break;

    default:
      console.warn(`⚠️ Unknown transaction kind: ${tx.kind}`);
  }

  rl.close();
}
