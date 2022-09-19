// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { OperationOptions } from "@azure/core-client";
import { createSpanFunction } from "@azure/core-tracing";

/**
 * Creates a span using the global tracer.
 * @internal
 */
export const createSpan = createSpanFunction({
  packagePrefix: "Azure.Storage.Blob",
  namespace: "Microsoft.Storage",
});

/**
 * @internal
 *
 * Adapt the tracing options from OperationOptions to what they need to be for
 * RequestOptionsBase (when we update to later OpenTelemetry versions this is now
 * two separate fields, not just one).
 */
export function convertTracingToRequestOptionsBase(
  options?: OperationOptions
): OperationOptions | undefined {
  return options;
} // TODO: convertTracingToRequestOptionsBase
