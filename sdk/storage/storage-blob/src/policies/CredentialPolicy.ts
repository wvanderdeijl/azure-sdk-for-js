// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { PipelinePolicy, PipelineRequest, PipelineResponse, SendRequest } from "@azure/core-rest-pipeline";

/**
 * Credential policy used to sign HTTP(S) requests before sending. This is an
 * abstract class.
 */
export abstract class CredentialPolicy implements PipelinePolicy  {
  public name = "CredentialPolicy";
  /**
     * The main method to implement that manipulates a request/response.
     * @param request - The request being performed.
     * @param next - The next policy in the pipeline. Must be called to continue the pipeline.
     */
  public sendRequest(request: PipelineRequest, next: SendRequest): Promise<PipelineResponse>
   {
      return next(this.signRequest(request));
   }

  /**
   * Child classes must implement this method with request signing. This method
   * will be executed in {@link sendRequest}.
   *
   * @param request -
   */
  protected signRequest(request: PipelineRequest): PipelineRequest {
    // Child classes must override this method with request signing. This method
    // will be executed in sendRequest().
    return request;
  }
}
