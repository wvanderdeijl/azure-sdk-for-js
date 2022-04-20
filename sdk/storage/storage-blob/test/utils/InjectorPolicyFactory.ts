// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { InjectorPolicy, Injector } from "./InjectorPolicy";

/**
 * InjectorPolicyFactory is a factory class which injects customized errors for retry policy testing.
 */
export class InjectorPolicyFactory {
  public readonly injector: Injector;

  public constructor(injector: Injector) {
    this.injector = injector;
  }

  public create(): InjectorPolicy {
    return new InjectorPolicy(this.injector);
  }
}
