// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { AbortError, AbortSignalLike } from "@azure/abort-controller";

import { URLConstants } from "../utils/constants";
import { delay, setURLHost, setURLParameter } from "../utils/utils.common";
import { logger } from "../log";
import { PipelinePolicy, PipelineRequest, PipelineResponse, RestError, SendRequest } from "@azure/core-rest-pipeline";

/**
 * RetryPolicy types.
 */
 export enum StorageRetryPolicyType {
  /**
   * Exponential retry. Retry time delay grows exponentially.
   */
  EXPONENTIAL,
  /**
   * Linear retry. Retry time delay grows linearly.
   */
  FIXED,
}

/**
 * Storage Blob retry options interface.
 */
export interface StorageRetryOptions {
  /**
   * Optional. StorageRetryPolicyType, default is exponential retry policy.
   */
  readonly retryPolicyType?: StorageRetryPolicyType;

  /**
   * Optional. Max try number of attempts, default is 4.
   * A value of 1 means 1 try and no retries.
   * A value smaller than 1 means default retry number of attempts.
   */
  readonly maxTries?: number;

  /**
   * Optional. Indicates the maximum time in ms allowed for any single try of an HTTP request.
   * A value of zero or undefined means no default timeout on SDK client, Azure
   * Storage server's default timeout policy will be used.
   *
   * @see https://docs.microsoft.com/en-us/rest/api/storageservices/setting-timeouts-for-blob-service-operations
   */
  readonly tryTimeoutInMs?: number;

  /**
   * Optional. Specifies the amount of delay to use before retrying an operation (default is 4s or 4 * 1000ms).
   * The delay increases (exponentially or linearly) with each retry up to a maximum specified by
   * maxRetryDelayInMs. If you specify 0, then you must also specify 0 for maxRetryDelayInMs.
   */
  readonly retryDelayInMs?: number;

  /**
   * Optional. Specifies the maximum delay allowed before retrying an operation (default is 120s or 120 * 1000ms).
   * If you specify 0, then you must also specify 0 for retryDelayInMs.
   */
  readonly maxRetryDelayInMs?: number;

  /**
   * If a secondaryHost is specified, retries will be tried against this host. If secondaryHost is undefined
   * (the default) then operations are not retried against another host.
   *
   * NOTE: Before setting this field, make sure you understand the issues around
   * reading stale and potentially-inconsistent data at
   * {@link https://docs.microsoft.com/en-us/azure/storage/common/storage-designing-ha-apps-with-ragrs}
   */
  readonly secondaryHost?: string;
}

// Default values of StorageRetryOptions
const DEFAULT_RETRY_OPTIONS: StorageRetryOptions = {
  maxRetryDelayInMs: 120 * 1000,
  maxTries: 4,
  retryDelayInMs: 4 * 1000,
  retryPolicyType: StorageRetryPolicyType.EXPONENTIAL,
  secondaryHost: "",
  tryTimeoutInMs: undefined, // Use server side default timeout strategy
};

const RETRY_ABORT_ERROR = new AbortError("The operation was aborted.");

/**
 * Retry policy with exponential retry and linear retry implemented.
 */
export class StorageRetryPolicy implements PipelinePolicy {
  public readonly name = "StorageRetryPolicy";
  /**
   * RetryOptions.
   */
  private readonly retryOptions: StorageRetryOptions;

  /**
   * Creates an instance of RetryPolicy.
   *
   * @param retryOptions -
   */
  constructor(
    retryOptions: StorageRetryOptions = DEFAULT_RETRY_OPTIONS
  ) {
    // Initialize retry options
    this.retryOptions = {
      retryPolicyType: retryOptions.retryPolicyType
        ? retryOptions.retryPolicyType
        : DEFAULT_RETRY_OPTIONS.retryPolicyType,

      maxTries:
        retryOptions.maxTries && retryOptions.maxTries >= 1
          ? Math.floor(retryOptions.maxTries)
          : DEFAULT_RETRY_OPTIONS.maxTries,

      tryTimeoutInMs:
        retryOptions.tryTimeoutInMs && retryOptions.tryTimeoutInMs >= 0
          ? retryOptions.tryTimeoutInMs
          : DEFAULT_RETRY_OPTIONS.tryTimeoutInMs,

      retryDelayInMs:
        retryOptions.retryDelayInMs && retryOptions.retryDelayInMs >= 0
          ? Math.min(
              retryOptions.retryDelayInMs,
              retryOptions.maxRetryDelayInMs
                ? retryOptions.maxRetryDelayInMs
                : DEFAULT_RETRY_OPTIONS.maxRetryDelayInMs!
            )
          : DEFAULT_RETRY_OPTIONS.retryDelayInMs,

      maxRetryDelayInMs:
        retryOptions.maxRetryDelayInMs && retryOptions.maxRetryDelayInMs >= 0
          ? retryOptions.maxRetryDelayInMs
          : DEFAULT_RETRY_OPTIONS.maxRetryDelayInMs,

      secondaryHost: retryOptions.secondaryHost
        ? retryOptions.secondaryHost
        : DEFAULT_RETRY_OPTIONS.secondaryHost,
    };
  }

  /**
   * Sends request.
   *
   * @param request -
   */
  public async sendRequest(request: PipelineRequest, next: SendRequest): Promise<PipelineResponse> {
    return this.attemptSendRequest(request, next, false, 1);
  }

  /**
   * Decide and perform next retry. Won't mutate request parameter.
   *
   * @param request -
   * @param secondaryHas404 -  If attempt was against the secondary & it returned a StatusNotFound (404), then
   *                                   the resource was not found. This may be due to replication delay. So, in this
   *                                   case, we'll never try the secondary again for this operation.
   * @param attempt -           How many retries has been attempted to performed, starting from 1, which includes
   *                                   the attempt will be performed by this method call.
   */
  protected async attemptSendRequest(
    request: PipelineRequest,
    next: SendRequest,
    secondaryHas404: boolean,
    attempt: number
  ): Promise<PipelineResponse> {
    const newRequest: PipelineRequest = {
      ...request
    };

    const isPrimaryRetry =
      secondaryHas404 ||
      !this.retryOptions.secondaryHost ||
      !(request.method === "GET" || request.method === "HEAD" || request.method === "OPTIONS") ||
      attempt % 2 === 1;

    if (!isPrimaryRetry) {
      newRequest.url = setURLHost(newRequest.url, this.retryOptions.secondaryHost!);
    }

    // Set the server-side timeout query parameter "timeout=[seconds]"
    if (this.retryOptions.tryTimeoutInMs) {
      newRequest.url = setURLParameter(
        newRequest.url,
        URLConstants.Parameters.TIMEOUT,
        Math.floor(this.retryOptions.tryTimeoutInMs! / 1000).toString()
      );
    }

    let response: PipelineResponse | undefined;
    try {
      logger.info(`RetryPolicy: =====> Try=${attempt} ${isPrimaryRetry ? "Primary" : "Secondary"}`);
      response = await next(newRequest);
      if (!this.shouldRetry(isPrimaryRetry, attempt, response)) {
        return response;
      }

      secondaryHas404 = secondaryHas404 || (!isPrimaryRetry && response.status === 404);
    } catch (err: any) {
      logger.error(`RetryPolicy: Caught error, message: ${err.message}, code: ${err.code}`);
      if (!this.shouldRetry(isPrimaryRetry, attempt, response, err)) {
        throw err;
      }
    }

    await this.delay(isPrimaryRetry, attempt, request.abortSignal);
    return this.attemptSendRequest(request, next, secondaryHas404, ++attempt);
  }

  /**
   * Decide whether to retry according to last HTTP response and retry counters.
   *
   * @param isPrimaryRetry -
   * @param attempt -
   * @param response -
   * @param err -
   */
  protected shouldRetry(
    isPrimaryRetry: boolean,
    attempt: number,
    response?: PipelineResponse,
    err?: RestError
  ): boolean {
    if (attempt >= this.retryOptions.maxTries!) {
      logger.info(
        `RetryPolicy: Attempt(s) ${attempt} >= maxTries ${this.retryOptions
          .maxTries!}, no further try.`
      );
      return false;
    }

    // Handle network failures, you may need to customize the list when you implement
    // your own http client
    const retriableErrors = [
      "ETIMEDOUT",
      "ESOCKETTIMEDOUT",
      "ECONNREFUSED",
      "ECONNRESET",
      "ENOENT",
      "ENOTFOUND",
      "TIMEOUT",
      "EPIPE",
      "REQUEST_SEND_ERROR", // For default xhr based http client provided in ms-rest-js
    ];
    if (err) {
      for (const retriableError of retriableErrors) {
        if (
          err.name.toUpperCase().includes(retriableError) ||
          err.message.toUpperCase().includes(retriableError) ||
          (err.code && err.code.toString().toUpperCase() === retriableError)
        ) {
          logger.info(`RetryPolicy: Network error ${retriableError} found, will retry.`);
          return true;
        }
      }
    }

    // If attempt was against the secondary & it returned a StatusNotFound (404), then
    // the resource was not found. This may be due to replication delay. So, in this
    // case, we'll never try the secondary again for this operation.
    if (response || err) {
      const statusCode = response ? response.status : err ? err.statusCode : 0;
      if (!isPrimaryRetry && statusCode === 404) {
        logger.info(`RetryPolicy: Secondary access with 404, will retry.`);
        return true;
      }

      // Server internal error or server timeout
      if (statusCode === 503 || statusCode === 500) {
        logger.info(`RetryPolicy: Will retry for status code ${statusCode}.`);
        return true;
      }
    }

    if (err?.code === "PARSE_ERROR" && err?.message.startsWith(`Error "Error: Unclosed root tag`)) {
      logger.info(
        "RetryPolicy: Incomplete XML response likely due to service timeout, will retry."
      );
      return true;
    }

    return false;
  }

  /**
   * Delay a calculated time between retries.
   *
   * @param isPrimaryRetry -
   * @param attempt -
   * @param abortSignal -
   */
  private async delay(isPrimaryRetry: boolean, attempt: number, abortSignal?: AbortSignalLike) {
    let delayTimeInMs: number = 0;

    if (isPrimaryRetry) {
      switch (this.retryOptions.retryPolicyType) {
        case StorageRetryPolicyType.EXPONENTIAL:
          delayTimeInMs = Math.min(
            (Math.pow(2, attempt - 1) - 1) * this.retryOptions.retryDelayInMs!,
            this.retryOptions.maxRetryDelayInMs!
          );
          break;
        case StorageRetryPolicyType.FIXED:
          delayTimeInMs = this.retryOptions.retryDelayInMs!;
          break;
      }
    } else {
      delayTimeInMs = Math.random() * 1000;
    }

    logger.info(`RetryPolicy: Delay for ${delayTimeInMs}ms`);
    return delay(delayTimeInMs, abortSignal, RETRY_ABORT_ERROR);
  }
}
