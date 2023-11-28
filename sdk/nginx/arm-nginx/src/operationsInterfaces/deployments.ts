/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

import { PagedAsyncIterableIterator } from "@azure/core-paging";
import { SimplePollerLike, OperationState } from "@azure/core-lro";
import {
  NginxDeployment,
  DeploymentsListOptionalParams,
  DeploymentsListByResourceGroupOptionalParams,
  DeploymentsGetOptionalParams,
  DeploymentsGetResponse,
  DeploymentsCreateOrUpdateOptionalParams,
  DeploymentsCreateOrUpdateResponse,
  DeploymentsUpdateOptionalParams,
  DeploymentsUpdateResponse,
  DeploymentsDeleteOptionalParams
} from "../models";

/// <reference lib="esnext.asynciterable" />
/** Interface representing a Deployments. */
export interface Deployments {
  /**
   * List the NGINX deployments resources
   * @param options The options parameters.
   */
  list(
    options?: DeploymentsListOptionalParams
  ): PagedAsyncIterableIterator<NginxDeployment>;
  /**
   * List all NGINX deployments under the specified resource group.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param options The options parameters.
   */
  listByResourceGroup(
    resourceGroupName: string,
    options?: DeploymentsListByResourceGroupOptionalParams
  ): PagedAsyncIterableIterator<NginxDeployment>;
  /**
   * Get the NGINX deployment
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param deploymentName The name of targeted NGINX deployment
   * @param options The options parameters.
   */
  get(
    resourceGroupName: string,
    deploymentName: string,
    options?: DeploymentsGetOptionalParams
  ): Promise<DeploymentsGetResponse>;
  /**
   * Create or update the NGINX deployment
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param deploymentName The name of targeted NGINX deployment
   * @param options The options parameters.
   */
  beginCreateOrUpdate(
    resourceGroupName: string,
    deploymentName: string,
    options?: DeploymentsCreateOrUpdateOptionalParams
  ): Promise<
    SimplePollerLike<
      OperationState<DeploymentsCreateOrUpdateResponse>,
      DeploymentsCreateOrUpdateResponse
    >
  >;
  /**
   * Create or update the NGINX deployment
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param deploymentName The name of targeted NGINX deployment
   * @param options The options parameters.
   */
  beginCreateOrUpdateAndWait(
    resourceGroupName: string,
    deploymentName: string,
    options?: DeploymentsCreateOrUpdateOptionalParams
  ): Promise<DeploymentsCreateOrUpdateResponse>;
  /**
   * Update the NGINX deployment
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param deploymentName The name of targeted NGINX deployment
   * @param options The options parameters.
   */
  beginUpdate(
    resourceGroupName: string,
    deploymentName: string,
    options?: DeploymentsUpdateOptionalParams
  ): Promise<
    SimplePollerLike<
      OperationState<DeploymentsUpdateResponse>,
      DeploymentsUpdateResponse
    >
  >;
  /**
   * Update the NGINX deployment
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param deploymentName The name of targeted NGINX deployment
   * @param options The options parameters.
   */
  beginUpdateAndWait(
    resourceGroupName: string,
    deploymentName: string,
    options?: DeploymentsUpdateOptionalParams
  ): Promise<DeploymentsUpdateResponse>;
  /**
   * Delete the NGINX deployment resource
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param deploymentName The name of targeted NGINX deployment
   * @param options The options parameters.
   */
  beginDelete(
    resourceGroupName: string,
    deploymentName: string,
    options?: DeploymentsDeleteOptionalParams
  ): Promise<SimplePollerLike<OperationState<void>, void>>;
  /**
   * Delete the NGINX deployment resource
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param deploymentName The name of targeted NGINX deployment
   * @param options The options parameters.
   */
  beginDeleteAndWait(
    resourceGroupName: string,
    deploymentName: string,
    options?: DeploymentsDeleteOptionalParams
  ): Promise<void>;
}
