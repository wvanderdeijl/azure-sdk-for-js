// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { stringToUint8Array, uint8ArrayToString } from "./bytesEncoding.browser";

// stubs for browser self.crypto
interface JsonWebKey {}
interface CryptoKey {}
type KeyUsage =
  | "decrypt"
  | "deriveBits"
  | "deriveKey"
  | "encrypt"
  | "sign"
  | "unwrapKey"
  | "verify"
  | "wrapKey";
interface Algorithm {
  name: string;
}
interface SubtleCrypto {
  importKey(
    format: string,
    keyData: JsonWebKey,
    algorithm: HmacImportParams,
    extractable: boolean,
    usage: KeyUsage[]
  ): Promise<CryptoKey>;
  sign(
    algorithm: HmacImportParams,
    key: CryptoKey,
    data: ArrayBufferView | ArrayBuffer
  ): Promise<ArrayBuffer>;
  digest(algorithm: Algorithm, data: ArrayBufferView | ArrayBuffer): Promise<ArrayBuffer>;
}
interface Crypto {
  readonly subtle: SubtleCrypto;
  getRandomValues<T extends ArrayBufferView | null>(array: T): T;
}
declare const self: {
  crypto: Crypto;
};
interface HmacImportParams {
  name: string;
  hash: Algorithm;
  length?: number;
}

let subtleCrypto: SubtleCrypto | undefined;

/**
 * Returns a cached reference to the Web API crypto.subtle object.
 * @internal
 */
function getCrypto(): SubtleCrypto {
  if (subtleCrypto) {
    return subtleCrypto;
  }

  if (!self.crypto || !self.crypto.subtle) {
    throw new Error("Your browser environment does not support cryptography functions.");
  }

  subtleCrypto = self.crypto.subtle;
  return subtleCrypto;
}

/**
 * Generates a SHA-256 HMAC signature.
 * @param key - The HMAC key represented as a base64 string, used to generate the cryptographic HMAC hash.
 * @param stringToSign - The data to be signed.
 * @param encoding - The textual encoding to use for the returned HMAC digest.
 */
export async function computeSha256Hmac(
  key: string,
  stringToSign: string,
  encoding: "base64" | "hex"
): Promise<string> {
  const crypto = getCrypto();
  const keyBytes = stringToUint8Array(key, "base64");
  const stringToSignBytes = stringToUint8Array(stringToSign, "utf-8");

  const cryptoKey = await crypto.importKey(
    "raw",
    keyBytes,
    {
      name: "HMAC",
      hash: { name: "SHA-256" },
    },
    false,
    ["sign"]
  );
  const signature = await crypto.sign(
    {
      name: "HMAC",
      hash: { name: "SHA-256" },
    },
    cryptoKey,
    stringToSignBytes
  );

  return uint8ArrayToString(new Uint8Array(signature), encoding);
}

/**
 * Generates a SHA-256 hash.
 * @param content - The data to be included in the hash.
 * @param encoding - The textual encoding to use for the returned hash.
 */
export async function computeSha256Hash(
  content: string,
  encoding: "base64" | "hex"
): Promise<string> {
  const contentBytes = stringToUint8Array(content, "utf-8");
  const digest = await getCrypto().digest({ name: "SHA-256" }, contentBytes);

  return uint8ArrayToString(new Uint8Array(digest), encoding);
}
