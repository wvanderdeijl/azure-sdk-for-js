// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { PipelinePolicy } from "@azure/core-rest-pipeline";
import { CredentialPolicy } from "../policies/CredentialPolicy";

/**
 * Credential is an abstract class for Azure Storage HTTP requests signing. This
 * class will host an credentialPolicyCreator factory which generates CredentialPolicy.
 */
export abstract class Credential {
  /**
   * Creates a RequestPolicy object.
   *
   * @param _nextPolicy -
   * @param _options -
   */
  public create(): PipelinePolicy {
    throw new Error("Method should be implemented in children classes.");
  }
}

/**
 * A factory function that creates a new CredentialPolicy that uses the provided nextPolicy.
 */
export type CredentialPolicyCreator = (
) => CredentialPolicy;
