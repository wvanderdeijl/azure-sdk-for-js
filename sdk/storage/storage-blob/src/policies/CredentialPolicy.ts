// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CompatResponse, RequestPolicy, RequestPolicyOptionsLike, WebResourceLike } from "@azure/core-http-compat";
import { BaseRequestPolicy } from "../models";

/**
 * Credential policy used to sign HTTP(S) requests before sending. This is an
 * abstract class.
 */
export abstract class CredentialPolicy extends BaseRequestPolicy {
  /**
   * The main method to implement that manipulates a request/response.
   */
  protected constructor(
    _nextPolicy: RequestPolicy,
     _options: RequestPolicyOptionsLike
  ) {
    super(_nextPolicy, _options)
  }
  /**
   * Sends out request.
   *
   * @param request -
   */
  public sendRequest(request: WebResourceLike): Promise<CompatResponse> {
    return this._nextPolicy.sendRequest(this.signRequest(request));
  }

  /**
   * Child classes must implement this method with request signing. This method
   * will be executed in {@link sendRequest}.
   *
   * @param request -
   */
  protected signRequest(request: WebResourceLike): WebResourceLike {
    // Child classes must override this method with request signing. This method
    // will be executed in sendRequest().
    return request;
  }
}
