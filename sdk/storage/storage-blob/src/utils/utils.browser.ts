// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/**
 * Convert a Browser Blob object into ArrayBuffer.
 *
 * @param blob -
 */
export async function blobToArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
  const fileReader = new FileReader();
  return new Promise<ArrayBuffer>((resolve, reject) => {
    fileReader.onloadend = (ev: any) => {
      resolve(ev.target!.result);
    };
    fileReader.onerror = reject;
    fileReader.readAsArrayBuffer(blob);
  });
}

/**
 * Convert a Browser Blob object into string.
 *
 * @param blob -
 */
export async function blobToString(blob: Blob): Promise<string> {
  const fileReader = new FileReader();
  return new Promise<string>((resolve, reject) => {
    fileReader.onloadend = (ev: any) => {
      resolve(ev.target!.result);
    };
    fileReader.onerror = reject;
    fileReader.readAsText(blob);
  });
}

export function streamToBuffer(): void {
  /* empty */
}

export function streamToBuffer2(): void {
  /* empty */
}

export function readStreamToLocalFile(): void {
  /* empty */
}

export const fsStat = function stat(): void {
  /* empty */
};

export const fsCreateReadStream = function createReadStream(): void {
  /* empty */
};

/**
 * A constant that indicates whether the environment the code is running is Node.JS.
 */
 export const isNode = false;