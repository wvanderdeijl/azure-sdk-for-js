// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CompatResponse, RequestPolicy, RequestPolicyOptionsLike, WebResourceLike } from "@azure/core-http-compat";
import {
  RestError,
} from "../../src";
import { BaseRequestPolicy } from "../../src/models";

export interface NextInjectErrorHolder {
  nextInjectError?: RestError;
}

export type Injector = () => RestError | undefined;

/**
 * InjectorPolicy will inject a customized error before next HTTP request.
 */
export class InjectorPolicy extends BaseRequestPolicy {
  /**
   * Creates an instance of InjectorPolicy.
   *
   * @param nextPolicy -
   * @param options -
   */
  public constructor(nextPolicy: RequestPolicy, options: RequestPolicyOptionsLike, injector: Injector) {
    super(nextPolicy, options);
    this.injector = injector;
  }

  /**
   * Sends request.
   *
   * @param request -
   */
  public async sendRequest(request: WebResourceLike): Promise<CompatResponse> {
    const error = this.injector();
    if (error) {
      throw error;
    }
    return this._nextPolicy.sendRequest(request);
  }

  private injector: Injector;
}
