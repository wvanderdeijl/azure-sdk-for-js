// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ManagementClient } from "../../src/core/managementClient";
import { createConnectionContextForTests } from "./unit/unittestUtils";
import { delay } from "rhea-promise";
import { assert } from "@azure/test-utils";

describe("ManagementClient unit tests", () => {
  it("actionAfterTimeout throws error that can be caught on timeout", async () => {
    const connectionContext = createConnectionContextForTests();

    const mgmtClient = new ManagementClient(
      connectionContext,
      connectionContext.config.entityPath || ""
    );
    try {
      mgmtClient["_init"] = async () => {
        // To make sure _init is in progress
        await delay(50);
      };

      // Error thrown after timeout
      await mgmtClient["initWithUniqueReplyTo"]({
        timeoutInMs: 5,
      });

      assert.fail("_makeManagementRequest should have failed");
    } catch (error: any) {
      assert.equal(error.message, "The management request timed out. Please try again later.");
    }
    await mgmtClient.close();
  });
});
