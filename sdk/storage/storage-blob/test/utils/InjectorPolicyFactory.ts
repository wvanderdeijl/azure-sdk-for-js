// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { RequestPolicy, RequestPolicyFactory, RequestPolicyOptionsLike } from "@azure/core-http-compat";
import { InjectorPolicy, Injector } from "./InjectorPolicy";

/**
 * InjectorPolicyFactory is a factory class which injects customized errors for retry policy testing.
 */
export class InjectorPolicyFactory implements RequestPolicyFactory {
  public readonly injector: Injector;

  public constructor(injector: Injector) {
    this.injector = injector;
  }

  public create(nextPolicy: RequestPolicy, options: RequestPolicyOptionsLike): InjectorPolicy {
    return new InjectorPolicy(nextPolicy, options, this.injector);
  }
}
