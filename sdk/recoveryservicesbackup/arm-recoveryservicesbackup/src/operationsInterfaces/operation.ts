/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

import {
  ValidateOperationRequestResource,
  OperationValidateOptionalParams,
  OperationValidateResponse
} from "../models";

/** Interface representing a Operation. */
export interface Operation {
  /**
   * Validate operation for specified backed up item. This is a synchronous operation.
   * @param vaultName The name of the recovery services vault.
   * @param resourceGroupName The name of the resource group where the recovery services vault is
   *                          present.
   * @param parameters resource validate operation request
   * @param options The options parameters.
   */
  validate(
    vaultName: string,
    resourceGroupName: string,
    parameters: ValidateOperationRequestResource,
    options?: OperationValidateOptionalParams
  ): Promise<OperationValidateResponse>;
}
