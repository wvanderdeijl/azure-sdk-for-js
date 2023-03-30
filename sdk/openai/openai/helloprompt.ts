// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

// Example code for using the generated client.
// Run this code with `tsc helloprompt.ts && node helloprompt.js` from the root of the repo.

import createClient from "./src/azureOpenAIApi";
import { AzureKeyCredential } from "@azure/core-auth";

const endpoint = "https://openai-gharper-test.openai.azure.com/";
const key = "cad9de954a8b401082ae04eebb11671f";
const keyCredential = new AzureKeyCredential(key);
const client = createClient(endpoint, keyCredential);

client.path("/deployments/{deploymentId}/completions", "test001").post({
    body: {
        prompt: ["When I was driving once I saw this painted on a bridge: 'I don't want the world, I just"],
    }
}).then((response) => {console.log(response.body);});

