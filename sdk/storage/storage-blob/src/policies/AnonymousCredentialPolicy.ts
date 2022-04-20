// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { CredentialPolicy } from "./CredentialPolicy";

/**
 * AnonymousCredentialPolicy is used with HTTP(S) requests that read public resources
 * or for use with Shared Access Signatures (SAS).
 */
export class AnonymousCredentialPolicy extends CredentialPolicy {
  public name = "AnonymousCredentialPolicy";
  /**
   * Creates an instance of AnonymousCredentialPolicy.
   * @param nextPolicy -
   * @param options -
   */
  // The base class has a protected constructor. Adding a public one to enable constructing of this class.
  /* eslint-disable-next-line @typescript-eslint/no-useless-constructor*/
  constructor() {
    super();
  }
}
