// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/**
 * THIS IS AN AUTO-GENERATED FILE - DO NOT EDIT!
 *
 * Any changes you make here may be lost.
 *
 * If you need to make changes, please do so in the original source file, \{project-root\}/sources/custom
 */

import { StreamableMethod } from "@azure-rest/core-client";
import { EventMessage, toSSE } from "./sse.js";
import { Readable } from "stream";
import { StreamIterator } from "./util.js";

async function getStream<TResponse>(
  response: StreamableMethod<TResponse>
): Promise<StreamIterator<Uint8Array>> {
  const stream = (await response.asNodeStream()).body;
  if (!stream) throw new Error("No stream found in response. Did you enable the stream option?");
  return {
    iter: stream as AsyncIterable<Uint8Array>,
    destroy: () => {
      (stream as Readable).destroy();
    }
  }
}

export async function getSSEs(
  response: StreamableMethod<unknown>
): Promise<StreamIterator<EventMessage>> {
  const { destroy, iter } = await getStream(response);
  return { iter: toSSE(iter), destroy };
}
