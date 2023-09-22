// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { assert } from "@azure/test-utils";
import { constructAuthenticationEndpointFromDomain } from "../src/util/authenticationEndpoint";

describe("authenticationEndpoint", () => {
  it("construct with invalid argument", () => {
    assert.throws(
      () => constructAuthenticationEndpointFromDomain(undefined!),
      "Argument cannot be null or empty: 'accountDomain'."
    );
    assert.throws(
      () => constructAuthenticationEndpointFromDomain(null!),
      "Argument cannot be null or empty: 'accountDomain'."
    );
    assert.throws(
      () => constructAuthenticationEndpointFromDomain(""),
      "Argument cannot be null or empty: 'accountDomain'."
    );
  });

  it("construct with domain value", () => {
    const domain: string = "mixedreality.azure.com";

    const endpointUrl = constructAuthenticationEndpointFromDomain(domain);

    assert.equal(endpointUrl, "https://sts.mixedreality.azure.com");
  });
});
