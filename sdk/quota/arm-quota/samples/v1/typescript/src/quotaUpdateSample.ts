/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import {
  CurrentQuotaLimitBase,
  AzureQuotaExtensionAPI
} from "@azure/arm-quota";
import { DefaultAzureCredential } from "@azure/identity";
import * as dotenv from "dotenv";

dotenv.config();

/**
 * This sample demonstrates how to Update the quota limit for a specific resource to the specified value:
1. Use the Usages-GET and Quota-GET operations to determine the remaining quota for the specific resource and to calculate the new quota limit. These steps are detailed in [this example](https://techcommunity.microsoft.com/t5/azure-governance-and-management/using-the-new-quota-rest-api/ba-p/2183670).
2. Use this PUT operation to update the quota limit. Please check the URI in location header for the detailed status of the request.
 *
 * @summary Update the quota limit for a specific resource to the specified value:
1. Use the Usages-GET and Quota-GET operations to determine the remaining quota for the specific resource and to calculate the new quota limit. These steps are detailed in [this example](https://techcommunity.microsoft.com/t5/azure-governance-and-management/using-the-new-quota-rest-api/ba-p/2183670).
2. Use this PUT operation to update the quota limit. Please check the URI in location header for the detailed status of the request.
 * x-ms-original-file: specification/quota/resource-manager/Microsoft.Quota/stable/2023-02-01/examples/patchComputeQuotaRequest.json
 */
async function quotasRequestPatchForCompute() {
  const resourceName = "standardFSv2Family";
  const scope =
    "subscriptions/D7EC67B3-7657-4966-BFFC-41EFD36BAAB3/providers/Microsoft.Compute/locations/eastus";
  const createQuotaRequest: CurrentQuotaLimitBase = {
    properties: {
      name: { value: "standardFSv2Family" },
      limit: { limitObjectType: "LimitValue", value: 10 }
    }
  };
  const credential = new DefaultAzureCredential();
  const client = new AzureQuotaExtensionAPI(credential);
  const result = await client.quota.beginUpdateAndWait(
    resourceName,
    scope,
    createQuotaRequest
  );
  console.log(result);
}

/**
 * This sample demonstrates how to Update the quota limit for a specific resource to the specified value:
1. Use the Usages-GET and Quota-GET operations to determine the remaining quota for the specific resource and to calculate the new quota limit. These steps are detailed in [this example](https://techcommunity.microsoft.com/t5/azure-governance-and-management/using-the-new-quota-rest-api/ba-p/2183670).
2. Use this PUT operation to update the quota limit. Please check the URI in location header for the detailed status of the request.
 *
 * @summary Update the quota limit for a specific resource to the specified value:
1. Use the Usages-GET and Quota-GET operations to determine the remaining quota for the specific resource and to calculate the new quota limit. These steps are detailed in [this example](https://techcommunity.microsoft.com/t5/azure-governance-and-management/using-the-new-quota-rest-api/ba-p/2183670).
2. Use this PUT operation to update the quota limit. Please check the URI in location header for the detailed status of the request.
 * x-ms-original-file: specification/quota/resource-manager/Microsoft.Quota/stable/2023-02-01/examples/patchNetworkOneSkuQuotaRequest.json
 */
async function quotasRequestPatchForNetwork() {
  const resourceName = "MinPublicIpInterNetworkPrefixLength";
  const scope =
    "subscriptions/D7EC67B3-7657-4966-BFFC-41EFD36BAAB3/providers/Microsoft.Network/locations/eastus";
  const createQuotaRequest: CurrentQuotaLimitBase = {
    properties: {
      name: { value: "MinPublicIpInterNetworkPrefixLength" },
      limit: { limitObjectType: "LimitValue", value: 10 },
      resourceType: "MinPublicIpInterNetworkPrefixLength"
    }
  };
  const credential = new DefaultAzureCredential();
  const client = new AzureQuotaExtensionAPI(credential);
  const result = await client.quota.beginUpdateAndWait(
    resourceName,
    scope,
    createQuotaRequest
  );
  console.log(result);
}

async function main() {
  quotasRequestPatchForCompute();
  quotasRequestPatchForNetwork();
}

main().catch(console.error);
