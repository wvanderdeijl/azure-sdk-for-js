// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/**
 * @summary Authenticates using Interactive Browser Credential
 */

import {
  InteractiveBrowserCredential,
  InteractiveBrowserCredentialNodeOptions,
} from "@azure/identity";
import dotenv from "dotenv";

dotenv.config();

const clientId = process.env.AZURE_CLIENT_ID; // The app registration client Id in the Microsoft Entra tenant
const tenantId = process.env.AZURE_TENANT_ID; // The tenant ID in Microsoft Entra ID

async function main(): Promise<void> {
  const credential = new InteractiveBrowserCredential({
    clientId,
    tenantId,
  } as InteractiveBrowserCredentialNodeOptions);

  const token = await credential.getToken("https://storage.azure.com/.default");
  console.log(`Token: ${token}`);
}

main().catch((err) => {
  console.error("The sample encountered an error:", err);
});
