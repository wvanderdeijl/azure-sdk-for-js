// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/**
 * A constant that indicates whether the environment the code is running is a Web Browser.
 */
// eslint-disable-next-line @azure/azure-sdk/ts-no-window
export const isBrowser = typeof window !== "undefined" && typeof window.document !== "undefined";

/**
 * A constant that indicates whether the environment the code is running is Node.JS.
 */
export const isNode =
  typeof process !== "undefined" && Boolean(process.version) && Boolean(process.versions?.node);

/**
 * Reads value of an Environment Variable, based on the environment (node, browser) the process
 * is running.
 * @param envVarName Name of the environment variable to be read.
 * @returns
 */
export function readEnvironmentVariable(envVarName: string): string | undefined {
  if (isNode) {
    return process.env[envVarName];
  }
  return undefined;
}
