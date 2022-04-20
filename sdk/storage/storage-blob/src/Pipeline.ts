// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import {createPipelineFromOptions, HttpClient, HttpHeaders, Pipeline as PipelineContext, PipelinePolicy, PipelineRequest, PipelineResponse, ProxySettings, RequestBodyType, UserAgentPolicyOptions } from "@azure/core-rest-pipeline"


import { StorageRetryOptions } from "./policies/StorageRetryPolicy";
import { StorageSharedKeyCredential } from "./credentials/StorageSharedKeyCredential";
import { AnonymousCredential } from "./credentials/AnonymousCredential";
import {
  StorageOAuthScopes,
} from "./utils/constants";
import { getCachedDefaultHttpClient } from "./utils/cache";
import { storageBearerTokenChallengeAuthenticationPolicy } from "./policies/StorageBearerTokenChallengeAuthenticationPolicy";
import { StorageClientOptionalParams } from "./generated/src";
import { deserializationPolicy } from "@azure/core-client";
import { isTokenCredential, TokenCredential } from "@azure/core-auth";
import { KeepAliveOptions } from "@azure/core-http-compat";
import { StorageBrowserPolicy } from "./policies/StorageBrowserPolicy";
import { StorageRetryPolicy } from "./policies/StorageRetryPolicy";
import { isNode } from "./utils/utils.node";
import { StorageSharedKeyCredentialPolicy } from "./policies/StorageSharedKeyCredentialPolicy";
import { AnonymousCredentialPolicy } from "./index.browser";
import { attachCredential } from "./utils/utils.common";

// Export following interfaces and types for customers who want to implement their
// own RequestPolicy or HTTPClient
export {
  PipelinePolicy,
  StorageOAuthScopes,
  deserializationPolicy,
  HttpClient,
  HttpHeaders,
  RequestBodyType,
  PipelineResponse,
  PipelineRequest,
};

/**
 * Option interface for Pipeline constructor.
 */
export interface PipelineOptions {
  /**
   * Optional. Configures the HTTP client to send requests and receive responses.
   */
  httpClient?: HttpClient;
}

/**
 * An interface for the {@link Pipeline} class containing HTTP request policies.
 * You can create a default Pipeline by calling {@link newPipeline}.
 * Or you can create a Pipeline with your own policies by the constructor of Pipeline.
 *
 * Refer to {@link newPipeline} and provided policies before implementing your
 * customized Pipeline.
 */
export interface PipelineLike {  
  /**
   * A list of chained request policy factories.
   */
  pipelineContext: PipelineContext;
   /**
    * Configures pipeline logger and HTTP client.
    */
  options: PipelineOptions;
  /**
   * Transfer Pipeline object to ServiceClientOptions object which is required by
   * ServiceClient constructor.
   *
   * @returns The ServiceClientOptions object from this Pipeline.
   */
  toServiceClientOptions(): StorageClientOptionalParams;
}

/**
 * A helper to decide if a given argument satisfies the Pipeline contract
 * @param pipeline - An argument that may be a Pipeline
 * @returns true when the argument satisfies the Pipeline contract
 */
export function isPipelineLike(pipeline: unknown): pipeline is PipelineLike {
  if (!pipeline || typeof pipeline !== "object") {
    return false;
  }

  const castPipeline = pipeline as PipelineLike;

  return (
    typeof castPipeline.toServiceClientOptions === "function"
  );
}

/**
 * A Pipeline class containing HTTP request policies.
 * You can create a default Pipeline by calling {@link newPipeline}.
 * Or you can create a Pipeline with your own policies by the constructor of Pipeline.
 *
 * Refer to {@link newPipeline} and provided policies before implementing your
 * customized Pipeline.
 */
export class Pipeline implements PipelineLike {
  /**
   * A list of chained request policy factories.
   */
  public readonly pipelineContext: PipelineContext;
  /**
   * Configures pipeline logger and HTTP client.
   */
  public readonly options: PipelineOptions;

  /**
   * Creates an instance of Pipeline. Customize HTTPClient by implementing IHttpClient interface.
   *
   * @param factories -
   * @param options -
   */
  constructor(pipelineContext: PipelineContext, options: PipelineOptions = {}) {
    this.pipelineContext = pipelineContext;
    // when options.httpClient is not specified, passing in a DefaultHttpClient instance to
    // avoid each client creating its own http client.
    this.options = {
      ...options,
      httpClient: options.httpClient || getCachedDefaultHttpClient(),
    };
  }

  /**
   * Transfer Pipeline object to ServiceClientOptions object which is required by
   * ServiceClient constructor.
   *
   * @returns The ServiceClientOptions object from this Pipeline.
   */
  public toServiceClientOptions(): StorageClientOptionalParams {
    return {
      httpClient: this.options.httpClient,
      pipeline: this.pipelineContext,
    };
  }
}

/**
 * Options interface for the {@link newPipeline} function.
 */
export interface StoragePipelineOptions {
  /**
   * Options to configure a proxy for outgoing requests.
   */
  proxyOptions?: ProxySettings;
  /**
   * Options for adding user agent details to outgoing requests.
   */
  userAgentOptions?: UserAgentPolicyOptions;
  /**
   * Configures the built-in retry policy behavior.
   */
  retryOptions?: StorageRetryOptions;
  /**
   * Keep alive configurations. Default keep-alive is enabled.
   */
  keepAliveOptions?: KeepAliveOptions;
  /**
   * Configures the HTTP client to send requests and receive responses.
   */
  httpClient?: HttpClient;
  /**
   * The audience used to retrieve an AAD token.
   */
  audience?: string | string[];
}

/**
 * Creates a new Pipeline object with Credential provided.
 *
 * @param credential -  Such as AnonymousCredential, StorageSharedKeyCredential or any credential from the `@azure/identity` package to authenticate requests to the service. You can also provide an object that implements the TokenCredential interface. If not specified, AnonymousCredential is used.
 * @param pipelineOptions - Optional. Options.
 * @returns A new Pipeline object.
 */


/// Several policies cannot be found. TODO==========================================================
export function newPipeline(
  credential?: StorageSharedKeyCredential | AnonymousCredential | TokenCredential,
  pipelineOptions: StoragePipelineOptions = {}
): Pipeline {
  if (credential === undefined) {
    credential = new AnonymousCredential();
  }

  // Order is important. Closer to the API at the top & closer to the network at the bottom.
  // The credential's policy factory must appear close to the wire so it can sign any
  // changes made by other factories (like UniqueRequestIDPolicyFactory)

  const pipelineContext = createPipelineFromOptions({});
  //const telemetryPolicy = new TelemetryPolicyFactory(pipelineOptions.userAgentOptions); // Tracing Policy duplicated
  //pipelineContext.addPolicy(tracingPolicy({ userAgentPrefix: telemetryPolicy.telemetryString }));
  pipelineContext.addPolicy(new StorageBrowserPolicy());
  pipelineContext.addPolicy(new StorageRetryPolicy()); // Retry policy should be above any policy that throws retryable errors
  
  // Default deserializationPolicy is provided by protocol layer
  // Use customized XML char key of "#" so we could deserialize metadata
  // with "_" key
  pipelineContext.addPolicy(deserializationPolicy({
    serializerOptions: { 
      xml: {
        xmlCharKey: "#" 
  }}}));

  // log policy 
  // pipelineContext.addPolicy(logPolicy({
  //   logger: logger.info,
  //   allowedHeaderNames: StorageBlobLoggingAllowedHeaderNames,
  //   allowedQueryParameters: StorageBlobLoggingAllowedQueryParameters,
  // }));

  if (isNode) {
    // policies only available in Node.js runtime, not in browsers
    // pipelineContext.addPolicy(proxyPolicy(pipelineOptions.proxyOptions)); // proxyPolicy
    // pipelineContext.addPolicy(disableResponseDecompressionPolicy());
  }
  let credentialPolicy;
  if (isTokenCredential(credential))
  {
    credentialPolicy = attachCredential(storageBearerTokenChallengeAuthenticationPolicy(
      credential,
      pipelineOptions.audience ?? StorageOAuthScopes
    ), credential);
  }
  else
  {
    const sharedKeyCredenital = credential as StorageSharedKeyCredential;sharedKeyCredenital;

    if (sharedKeyCredenital) {
      credentialPolicy = new StorageSharedKeyCredentialPolicy(sharedKeyCredenital);
    }
    else {
      credentialPolicy = new AnonymousCredentialPolicy();
    }
  }

  pipelineContext.addPolicy(credentialPolicy);

  return new Pipeline(pipelineContext, pipelineOptions);
}
