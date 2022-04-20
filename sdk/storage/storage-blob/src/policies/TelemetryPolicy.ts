// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { createHttpHeaders, PipelinePolicy, PipelineRequest, PipelineResponse, SendRequest } from "@azure/core-rest-pipeline";
import { HeaderConstants } from "../utils/constants";
import { isNode } from "../utils/utils.node";

/**
 * TelemetryPolicy is a policy used to tag user-agent header for every requests.
 */
export class TelemetryPolicy implements PipelinePolicy {
  public readonly name = "TelemetryPolicy";

  /**
   * Telemetry string.
   */
  public readonly telemetry: string;

  /**
   * Creates an instance of TelemetryPolicy.
   * @param telemetry -
   */
  constructor(telemetry: string) {
    this.telemetry = telemetry;
  }

  /**
   * Sends out request.
   *
   * @param request -
   */
  public async sendRequest(request: PipelineRequest, next: SendRequest): Promise<PipelineResponse> {
    if (isNode) {
      if (!request.headers) {
        request.headers = createHttpHeaders();
      }
      if (!request.headers.get(HeaderConstants.USER_AGENT)) {
        request.headers.set(HeaderConstants.USER_AGENT, this.telemetry);
      }
    }

    return next(request);
  }
}
