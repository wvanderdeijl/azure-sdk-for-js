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
  Cluster,
  ClustersListOptionalParams,
  ClustersListByResourceGroupOptionalParams,
  ClustersCreateOptionalParams,
  ClustersCreateResponse,
  ClustersGetOptionalParams,
  ClustersGetResponse,
  ClustersUpdateOptionalParams,
  ClustersUpdateResponse,
  ClustersDeleteOptionalParams
} from "../models";

/// <reference lib="esnext.asynciterable" />
/** Interface representing a Clusters. */
export interface Clusters {
  /**
   * List of clusters in a subscription.
   * @param options The options parameters.
   */
  list(
    options?: ClustersListOptionalParams
  ): PagedAsyncIterableIterator<Cluster>;
  /**
   * List of clusters in a resource group.
   * @param resourceGroupName The Resource Group Name.
   * @param options The options parameters.
   */
  listByResourceGroup(
    resourceGroupName: string,
    options?: ClustersListByResourceGroupOptionalParams
  ): PagedAsyncIterableIterator<Cluster>;
  /**
   * Create Or Update cluster.
   * @param resourceGroupName The Resource Group Name.
   * @param clusterName Name of the cluster.
   * @param options The options parameters.
   */
  beginCreate(
    resourceGroupName: string,
    clusterName: string,
    options?: ClustersCreateOptionalParams
  ): Promise<
    SimplePollerLike<
      OperationState<ClustersCreateResponse>,
      ClustersCreateResponse
    >
  >;
  /**
   * Create Or Update cluster.
   * @param resourceGroupName The Resource Group Name.
   * @param clusterName Name of the cluster.
   * @param options The options parameters.
   */
  beginCreateAndWait(
    resourceGroupName: string,
    clusterName: string,
    options?: ClustersCreateOptionalParams
  ): Promise<ClustersCreateResponse>;
  /**
   * Implements cluster GET method.
   * @param resourceGroupName The Resource Group Name.
   * @param clusterName Name of the cluster.
   * @param options The options parameters.
   */
  get(
    resourceGroupName: string,
    clusterName: string,
    options?: ClustersGetOptionalParams
  ): Promise<ClustersGetResponse>;
  /**
   * API to update certain properties of the cluster resource.
   * @param resourceGroupName The Resource Group Name.
   * @param clusterName Name of the cluster.
   * @param options The options parameters.
   */
  update(
    resourceGroupName: string,
    clusterName: string,
    options?: ClustersUpdateOptionalParams
  ): Promise<ClustersUpdateResponse>;
  /**
   * Implements cluster DELETE method.
   * @param resourceGroupName The Resource Group Name.
   * @param clusterName Name of the cluster.
   * @param options The options parameters.
   */
  beginDelete(
    resourceGroupName: string,
    clusterName: string,
    options?: ClustersDeleteOptionalParams
  ): Promise<SimplePollerLike<OperationState<void>, void>>;
  /**
   * Implements cluster DELETE method.
   * @param resourceGroupName The Resource Group Name.
   * @param clusterName Name of the cluster.
   * @param options The options parameters.
   */
  beginDeleteAndWait(
    resourceGroupName: string,
    clusterName: string,
    options?: ClustersDeleteOptionalParams
  ): Promise<void>;
}
