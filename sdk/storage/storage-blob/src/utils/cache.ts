// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { createDefaultHttpClient } from "@azure/core-rest-pipeline";
import { HttpClient } from "../Pipeline";

const _defaultHttpClient = createDefaultHttpClient();

export function getCachedDefaultHttpClient(): HttpClient {
  return _defaultHttpClient;
}
