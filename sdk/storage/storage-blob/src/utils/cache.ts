// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { createDefaultHttpClient } from "@azure/core-rest-pipeline";
import { IHttpClient } from "../Pipeline";

const _defaultHttpClient = createDefaultHttpClient();

export function getCachedDefaultHttpClient(): IHttpClient {
  return _defaultHttpClient;
}
