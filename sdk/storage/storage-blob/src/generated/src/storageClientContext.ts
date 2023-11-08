/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

import * as coreHttp from "@azure/core-http";
import { StorageClientOptionalParams } from "./models";

const packageName = "azure-storage-blob";
const packageVersion = "12.17.0";

export class StorageClientContext extends coreHttp.ServiceClient {
  url: string;
  version: string;

  /**
   * Initializes a new instance of the StorageClientContext class.
   * @param url The URL of the service account, container, or blob that is the target of the desired
   *            operation.
   * @param options The parameter options
   */
  constructor(url: string, options?: StorageClientOptionalParams) {
    if (url === undefined) {
      throw new Error("'url' cannot be null");
    }

    // Initializing default values for options
    if (!options) {
      options = {};
    }

    if (!options.userAgent) {
      const defaultUserAgent = coreHttp.getDefaultUserAgentValue();
      options.userAgent = `${packageName}/${packageVersion} ${defaultUserAgent}`;
    }

    super(undefined, options);

    this.requestContentType = "application/json; charset=utf-8";

    this.baseUri = options.endpoint || "{url}";

    // Parameter assignments
    this.url = url;

    // Assigning values to Constant parameters
    this.version = options.version || "2023-11-03";
  }
}
