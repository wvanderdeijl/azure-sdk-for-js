// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { PipelinePolicy, PipelineRequest, PipelineResponse, SendRequest } from "@azure/core-rest-pipeline";

import { HeaderConstants, URLConstants } from "../utils/constants";
import { setURLParameter } from "../utils/utils.common";
import { isNode } from "../utils/utils.node";

/**
 * StorageBrowserPolicy will handle differences between Node.js and browser runtime, including:
 *
 * 1. Browsers cache GET/HEAD requests by adding conditional headers such as 'IF_MODIFIED_SINCE'.
 * StorageBrowserPolicy is a policy used to add a timestamp query to GET/HEAD request URL
 * thus avoid the browser cache.
 *
 * 2. Remove cookie header for security
 *
 * 3. Remove content-length header to avoid browsers warning
 */
export class StorageBrowserPolicy implements PipelinePolicy {
  public name = "StorageBrowserPolicy";
    /**
   * Creates an instance of StorageBrowserPolicy.
   * @param nextPolicy -
   * @param options -
   */
  // The base class has a protected constructor. Adding a public one to enable constructing of this class.
  constructor() {
  }
  /**
   * Sends out request.
   *
   * @param request -
   */
  public async sendRequest(request: PipelineRequest, next: SendRequest): Promise<PipelineResponse> {
    if (isNode) {
      return next(request);
    }

    if (request.method.toUpperCase() === "GET" || request.method.toUpperCase() === "HEAD") {
      request.url = setURLParameter(
        request.url,
        URLConstants.Parameters.FORCE_BROWSER_NO_CACHE,
        new Date().getTime().toString()
      );
    }

    request.headers.delete(HeaderConstants.COOKIE);

    // According to XHR standards, content-length should be fully controlled by browsers
    request.headers.delete(HeaderConstants.CONTENT_LENGTH);

    return next(request);
  }
}
