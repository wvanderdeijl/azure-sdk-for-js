// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CompatResponse, RequestPolicy, RequestPolicyOptionsLike, WebResourceLike } from "@azure/core-http-compat";
import { BaseRequestPolicy } from "../models";
import { HeaderConstants } from "../utils/constants";
import { HttpHeadersV1 } from "../utils/utils.common";
import { isNode } from "../utils/utils.node";

/**
 * TelemetryPolicy is a policy used to tag user-agent header for every requests.
 */
export class TelemetryPolicy extends BaseRequestPolicy {
  /**
   * Telemetry string.
   */
  public readonly telemetry: string;

  /**
   * Creates an instance of TelemetryPolicy.
   * @param nextPolicy -
   * @param options -
   * @param telemetry -
   */
  constructor(nextPolicy: RequestPolicy, options: RequestPolicyOptionsLike, telemetry: string) {
    super(nextPolicy, options);
    this.telemetry = telemetry;
  }

  /**
   * Sends out request.
   *
   * @param request -
   */
  public async sendRequest(request: WebResourceLike): Promise<CompatResponse> {
    if (isNode) {
      if (!request.headers) {
        request.headers = new HttpHeadersV1();
      }
      if (!request.headers.get(HeaderConstants.USER_AGENT)) {
        request.headers.set(HeaderConstants.USER_AGENT, this.telemetry);
      }
    }

    return this._nextPolicy.sendRequest(request);
  }
}
