// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { AbortSignalLike } from "@azure/abort-controller";
import { CompatResponse, HttpPipelineLogLevel, RequestPolicy, RequestPolicyOptionsLike, WebResourceLike } from "@azure/core-http-compat";
import { CancelOnProgress, PollOperationState } from "@azure/core-lro";
import { PipelineResponse } from "@azure/core-rest-pipeline";
import { AppendBlobCreateHeaders, BlobDeleteHeaders, BlobGetPropertiesHeaders, BlockBlobUploadHeaders, ContainerCreateHeaders, ContainerDeleteHeaders, ListContainersSegmentResponse, PageBlobCreateHeaders, PageBlobGetPageRangesDiffHeaders, PageList, ServiceListContainersSegmentHeaders } from "./generated/src/models";
import { BlobDownloadHeaders, BlobImmutabilityPolicyMode, BlobQueryHeaders, ContainerGetPropertiesHeaders, PageBlobGetPageRangesHeaders, ServiceSubmitBatchHeaders } from "./generatedModels";
import {
  LeaseAccessConditions,
  SequenceNumberAccessConditions,
  AppendPositionAccessConditions,
  AccessTier,
  CpkInfo,
} from "./generatedModels";
import { EncryptionAlgorithmAES25 } from "./utils/constants";

/**
 * The base class from which all request policies derive.
 */
 export abstract class BaseRequestPolicy implements RequestPolicy {
  /**
   * The main method to implement that manipulates a request/response.
   */
  protected constructor(
    /**
     * The next policy in the pipeline. Each policy is responsible for executing the next one if the request is to continue through the pipeline.
     */
    readonly _nextPolicy: RequestPolicy,
    /**
     * The options that can be passed to a given request policy.
     */
    readonly _options: RequestPolicyOptionsLike
  ) {}

  /**
   * Sends a network request based on the given web resource.
   * @param webResource - A {@link WebResourceLike} that describes a HTTP request to be made.
   */
  public abstract sendRequest(webResource: WebResourceLike): Promise<CompatResponse>;

  /**
   * Get whether or not a log with the provided log level should be logged.
   * @param logLevel - The log level of the log that will be logged.
   * @returns Whether or not a log with the provided log level should be logged.
   */
  public shouldLog(logLevel: HttpPipelineLogLevel): boolean {
    return this._options.shouldLog(logLevel);
  }

  /**
   * Attempt to log the provided message to the provided logger. If no logger was provided or if
   * the log level does not meat the logger's threshold, then nothing will be logged.
   * @param logLevel - The log level of this log.
   * @param message - The message of this log.
   */
  public log(logLevel: HttpPipelineLogLevel, message: string): void {
    this._options.log(logLevel, message);
  }
}

/** Contains response data for the download operation. */
export type BlobDownloadResponseModel = BlobDownloadHeaders & {
  /**
   * BROWSER ONLY
   *
   * The response body as a browser Blob.
   * Always `undefined` in node.js.
   */
  blobBody?: Promise<Blob>;
  /**
   * NODEJS ONLY
   *
   * The response body as a node.js Readable stream.
   * Always `undefined` in the browser.
   */
  readableStreamBody?: NodeJS.ReadableStream;

  /** The underlying HTTP response. */
  _response: PipelineResponse & {
    /** The parsed HTTP response headers. */
    parsedHeaders: BlobDownloadHeaders;
  };
};

/** Contains response data for the query operation. */
export type BlobQueryResponseModel = BlobQueryHeaders & {
  /**
   * BROWSER ONLY
   *
   * The response body as a browser Blob.
   * Always `undefined` in node.js.
   */
  blobBody?: Promise<Blob>;
  /**
   * NODEJS ONLY
   *
   * The response body as a node.js Readable stream.
   * Always `undefined` in the browser.
   */
  readableStreamBody?: NodeJS.ReadableStream;

  /** The underlying HTTP response. */
  _response: PipelineResponse & {
    /** The parsed HTTP response headers. */
    parsedHeaders: BlobQueryHeaders;
  };
};

export type PageBlobGetPageRangesResponseModel = PageBlobGetPageRangesHeaders &
  PageList & {
    /** The underlying HTTP response. */
    _response: PipelineResponse & {
      /** The response body as text (string format) */
      bodyAsText: string;

      /** The response body as parsed JSON or XML */
      parsedBody: PageList;
      /** The parsed HTTP response headers. */
      parsedHeaders: PageBlobGetPageRangesHeaders;
    };
  };
  
  /** Contains response data for the getPageRangesDiff operation. */
  export type PageBlobGetPageRangesDiffResponseModel = PageBlobGetPageRangesDiffHeaders &
    PageList & {
      /** The underlying HTTP response. */
      _response: PipelineResponse & {
        /** The response body as text (string format) */
        bodyAsText: string;
  
        /** The response body as parsed JSON or XML */
        parsedBody: PageList;
        /** The parsed HTTP response headers. */
        parsedHeaders: PageBlobGetPageRangesDiffHeaders;
      };
};


/** Contains response data for the upload operation. */
export type BlockBlobUploadResponse = BlockBlobUploadHeaders & {
  /** The underlying HTTP response. */
  _response: PipelineResponse & {
    /** The parsed HTTP response headers. */
    parsedHeaders: BlockBlobUploadHeaders;
  };
};

/** Contains response data for the listContainersSegment operation. */
export type ServiceListContainersSegmentResponse = ServiceListContainersSegmentHeaders &
  ListContainersSegmentResponse & {
    /** The underlying HTTP response. */
    _response: PipelineResponse & {
      /** The response body as text (string format) */
      bodyAsText: string;

      /** The response body as parsed JSON or XML */
      parsedBody: ListContainersSegmentResponse;
      /** The parsed HTTP response headers. */
      parsedHeaders: ServiceListContainersSegmentHeaders;
    };
  };

/** Contains response data for the delete operation. */
export type ContainerDeleteResponse = ContainerDeleteHeaders & {
  /** The underlying HTTP response. */
  _response: PipelineResponse & {
    /** The parsed HTTP response headers. */
    parsedHeaders: ContainerDeleteHeaders;
  };
};

/** Contains response data for the create operation. */
export type ContainerCreateResponse = ContainerCreateHeaders & {
  /** The underlying HTTP response. */
  _response: PipelineResponse & {
    /** The parsed HTTP response headers. */
    parsedHeaders: ContainerCreateHeaders;
  };
};

/** Contains response data for the getProperties operation. */
export type ContainerGetPropertiesResponse = ContainerGetPropertiesHeaders & {
  /** The underlying HTTP response. */
  _response: PipelineResponse & {
    /** The parsed HTTP response headers. */
    parsedHeaders: ContainerGetPropertiesHeaders;
  };
};

/** Contains response data for the delete operation. */
export type BlobDeleteResponse = BlobDeleteHeaders & {
  /** The underlying HTTP response. */
  _response: PipelineResponse & {
    /** The parsed HTTP response headers. */
    parsedHeaders: BlobDeleteHeaders;
  };
};

/** Contains response data for the create operation. */
export type PageBlobCreateResponse = PageBlobCreateHeaders & {
  /** The underlying HTTP response. */
  _response: PipelineResponse & {
    /** The parsed HTTP response headers. */
    parsedHeaders: PageBlobCreateHeaders;
  };
};

/** Contains response data for the create operation. */
export type AppendBlobCreateResponse = AppendBlobCreateHeaders & {
  /** The underlying HTTP response. */
  _response: PipelineResponse & {
    /** The parsed HTTP response headers. */
    parsedHeaders: AppendBlobCreateHeaders;
  };
};

/** Contains response data for the getProperties operation. */
export type BlobGetPropertiesResponseModel = BlobGetPropertiesHeaders & {
  /** The underlying HTTP response. */
  _response: PipelineResponse & {
    /** The parsed HTTP response headers. */
    parsedHeaders: BlobGetPropertiesHeaders;
  };
};

/** Contains response data for the submitBatch operation. */
export type ServiceSubmitBatchResponseModel = ServiceSubmitBatchHeaders & {
  /**
   * BROWSER ONLY
   *
   * The response body as a browser Blob.
   * Always `undefined` in node.js.
   */
  blobBody?: Promise<Blob>;
  /**
   * NODEJS ONLY
   *
   * The response body as a node.js Readable stream.
   * Always `undefined` in the browser.
   */
  readableStreamBody?: NodeJS.ReadableStream;

  /** The underlying HTTP response. */
  _response: PipelineResponse & {
    /** The parsed HTTP response headers. */
    parsedHeaders: ServiceSubmitBatchHeaders;
  };
};

/**
 * Blob tags.
 */
export type Tags = Record<string, string>;

/**
 * A map of name-value pairs to associate with the resource.
 */
export interface Metadata {
  /**
   * A name-value pair.
   */
  [propertyName: string]: string;
}

/**
 * standard HTTP conditional headers and tags condition.
 */
export interface ModifiedAccessConditions
  extends MatchConditions,
    ModificationConditions,
    TagConditions {}

/**
 * standard HTTP conditional headers, tags condition and lease condition
 */
export interface BlobRequestConditions extends ModifiedAccessConditions, LeaseAccessConditions {}

/**
 * Conditions to add to the creation of this page blob.
 */
export interface PageBlobRequestConditions
  extends BlobRequestConditions,
    SequenceNumberAccessConditions {}

/**
 * Conditions to add to the creation of this append blob.
 */
export interface AppendBlobRequestConditions
  extends BlobRequestConditions,
    AppendPositionAccessConditions {}

/**
 * Specifies HTTP options for conditional requests based on modification time.
 */
export interface ModificationConditions {
  /**
   * Specify this header value to operate only on a blob if it has been modified since the
   * specified date/time.
   */
  ifModifiedSince?: Date;
  /**
   * Specify this header value to operate only on a blob if it has not been modified since the
   * specified date/time.
   */
  ifUnmodifiedSince?: Date;
}

/**
 * Specifies HTTP options for conditional requests based on ETag matching.
 */
export interface MatchConditions {
  /**
   * Specify an ETag value to operate only on blobs with a matching value.
   */
  ifMatch?: string;
  /**
   * Specify an ETag value to operate only on blobs without a matching value.
   */
  ifNoneMatch?: string;
}

/**
 * Specifies HTTP options for conditional requests based on blob tags.
 */
export interface TagConditions {
  /**
   * Optional SQL statement to apply to the tags of the blob.
   */
  tagConditions?: string;
}

/**
 * Conditions to meet for the container.
 */
export interface ContainerRequestConditions extends LeaseAccessConditions, ModificationConditions {}

/**
 * Represents the access tier on a blob.
 * For detailed information about block blob level tiering see {@link https://docs.microsoft.com/azure/storage/blobs/storage-blob-storage-tiers|Hot, cool and archive storage tiers.}
 */
export enum BlockBlobTier {
  /**
   * Optimized for storing data that is accessed frequently.
   */
  Hot = "Hot",
  /**
   * Optimized for storing data that is infrequently accessed and stored for at least 30 days.
   */
  Cool = "Cool",
  /**
   * Optimized for storing data that is rarely accessed and stored for at least 180 days
   * with flexible latency requirements (on the order of hours).
   */
  Archive = "Archive",
}

/**
 * Specifies the page blob tier to set the blob to. This is only applicable to page blobs on premium storage accounts.
 * Please see {@link https://docs.microsoft.com/azure/storage/storage-premium-storage#scalability-and-performance-targets|here}
 * for detailed information on the corresponding IOPS and throughput per PageBlobTier.
 */
export enum PremiumPageBlobTier {
  /**
   * P4 Tier.
   */
  P4 = "P4",
  /**
   * P6 Tier.
   */
  P6 = "P6",
  /**
   * P10 Tier.
   */
  P10 = "P10",
  /**
   * P15 Tier.
   */
  P15 = "P15",
  /**
   * P20 Tier.
   */
  P20 = "P20",
  /**
   * P30 Tier.
   */
  P30 = "P30",
  /**
   * P40 Tier.
   */
  P40 = "P40",
  /**
   * P50 Tier.
   */
  P50 = "P50",
  /**
   * P60 Tier.
   */
  P60 = "P60",
  /**
   * P70 Tier.
   */
  P70 = "P70",
  /**
   * P80 Tier.
   */
  P80 = "P80",
}

export function toAccessTier(
  tier: BlockBlobTier | PremiumPageBlobTier | string | undefined
): AccessTier | undefined {
  if (tier === undefined) {
    return undefined;
  }

  return tier as AccessTier; // No more check if string is a valid AccessTier, and left this to underlay logic to decide(service).
}

export function ensureCpkIfSpecified(cpk: CpkInfo | undefined, isHttps: boolean): void {
  if (cpk && !isHttps) {
    throw new RangeError("Customer-provided encryption key must be used over HTTPS.");
  }

  if (cpk && !cpk.encryptionAlgorithm) {
    cpk.encryptionAlgorithm = EncryptionAlgorithmAES25;
  }
}

/**
 * Specifies the Replication Status of a blob. This is used when a storage account has
 * Object Replication Policy(s) applied. See {@link ObjectReplicationPolicy} and {@link ObjectReplicationRule}.
 */
export type ObjectReplicationStatus = "complete" | "failed";

/**
 * Contains the Object Replication Rule ID and {@link ObjectReplicationStatus} of a blob.
 * There can be more than one {@link ObjectReplicationRule} under a {@link ObjectReplicationPolicy}.
 */
export interface ObjectReplicationRule {
  /**
   * The Object Replication Rule ID.
   */
  ruleId: string;

  /**
   * The Replication Status
   */
  replicationStatus: ObjectReplicationStatus;
}

/**
 * Contains Object Replication Policy ID and the respective list of {@link ObjectReplicationRule}.
 * This is used when retrieving the Object Replication Properties on the source blob. The policy id for the
 * destination blob is set in ObjectReplicationDestinationPolicyId of the respective method responses
 * (e.g. {@link BlobProperties.ObjectReplicationDestinationPolicyId}.
 */
export interface ObjectReplicationPolicy {
  /**
   * The Object Replication Policy ID.
   */
  policyId: string;

  /**
   * The Rule ID(s) and respective Replication Status(s) that are under the Policy ID.
   */
  rules: ObjectReplicationRule[];
}

/**
 * Contains response data for the {@link BlobClient.download} operation.
 */
export interface BlobDownloadResponseParsed extends BlobDownloadResponseModel {
  /**
   * Parsed Object Replication Policy Id, Rule Id(s) and status of the source blob.
   */
  objectReplicationSourceProperties?: ObjectReplicationPolicy[];

  /**
   * Object Replication Policy Id of the destination blob.
   */
  objectReplicationDestinationPolicyId?: string;
}

/**
 * The type of a {@link BlobQueryArrowField}.
 */
export type BlobQueryArrowFieldType =
  | "int64"
  | "bool"
  | "timestamp[ms]"
  | "string"
  | "double"
  | "decimal";

/**
 * Describe a field in {@link BlobQueryArrowConfiguration}.
 */
export interface BlobQueryArrowField {
  /**
   * The type of the field.
   */
  type: BlobQueryArrowFieldType;

  /**
   * The name of the field.
   */
  name?: string;

  /**
   * The precision of the field. Required if type is "decimal".
   */
  precision?: number;

  /**
   * The scale of the field.  Required if type is is "decimal".
   */
  scale?: number;
}

/**
 * Describe immutable policy for blob.
 */
export interface BlobImmutabilityPolicy {
  /**
   * Specifies the date time when the blobs immutability policy is set to expire.
   */
  expiriesOn?: Date;
  /**
   * Specifies the immutability policy mode to set on the blob.
   */
  policyMode?: BlobImmutabilityPolicyMode;
}

/**
 * Represents authentication information in Authorization, ProxyAuthorization,
 * WWW-Authenticate, and Proxy-Authenticate header values.
 */
export interface HttpAuthorization {
  /**
   * The scheme to use for authorization.
   */
  scheme: string;

  /**
   * the credentials containing the authentication information of the user agent for the resource being requested.
   */
  value: string;
}

/**
 * Defines the known cloud audiences for Storage.
 */
export enum StorageBlobAudience {
  /**
   * The OAuth scope to use to retrieve an AAD token for Azure Storage.
   */
  StorageOAuthScopes = "https://storage.azure.com/.default",
  /**
   * The OAuth scope to use to retrieve an AAD token for Azure Disk.
   */
  DiskComputeOAuthScopes = "https://disk.compute.azure.com/.default",
}

/**
 * Abstract representation of a poller, intended to expose just the minimal API that the user needs to work with.
 */
export interface PollerLikeWithCancellation<TState extends PollOperationState<TTResult>, TTResult> {
  /**
   * Returns a promise that will resolve once a single polling request finishes.
   * It does this by calling the update method of the Poller's operation.
   */
  poll(options?: { abortSignal?: AbortSignalLike }): Promise<void>;
  /**
   * Returns a promise that will resolve once the underlying operation is completed.
   */
  pollUntilDone(): Promise<TTResult>;
  /**
   * Invokes the provided callback after each polling is completed,
   * sending the current state of the poller's operation.
   *
   * It returns a method that can be used to stop receiving updates on the given callback function.
   */
  onProgress(callback: (state: TState) => void): CancelOnProgress;
  /**
   * Returns true if the poller has finished polling.
   */
  isDone(): boolean;
  /**
   * Stops the poller. After this, no manual or automated requests can be sent.
   */
  stopPolling(): void;
  /**
   * Returns true if the poller is stopped.
   */
  isStopped(): boolean;
  /**
   * Attempts to cancel the underlying operation.
   */
  cancelOperation(options?: { abortSignal?: AbortSignalLike }): Promise<void>;
  /**
   * Returns the state of the operation.
   * The TState defined in PollerLike can be a subset of the TState defined in
   * the Poller implementation.
   */
  getOperationState(): TState;
  /**
   * Returns the result value of the operation,
   * regardless of the state of the poller.
   * It can return undefined or an incomplete form of the final TResult value
   * depending on the implementation.
   */
  getResult(): TTResult | undefined;
  /**
   * Returns a serialized version of the poller's operation
   * by invoking the operation's toString method.
   */
  toString(): string;
}
