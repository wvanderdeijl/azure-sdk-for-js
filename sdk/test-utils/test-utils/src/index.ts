// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export {
  supports,
  versionsToTest,
  SupportedVersions,
  MultiVersionTestOptions,
  TestFunctionWrapper,
} from "./multiVersion";

export * from "./chai";
export { matrix } from "./matrix";
export { isNode, isNode8 } from "./utils";
export { getYieldedValue } from "./getYieldedValue";

export { TestSpan } from "./tracing/testSpan";
export * from "./tracing/mockInstrumenter";
export * from "./tracing/mockTracingSpan";
export * from "./tracing/testTracer";
export * from "./tracing/testTracerProvider";
export * from "./tracing/spanGraphModel";

export * from "./fakeTestSecrets";

export { createXhrHttpClient } from "./xhrHttpClient";

export { createMockTracingContext } from "./tracing/mockContext";
