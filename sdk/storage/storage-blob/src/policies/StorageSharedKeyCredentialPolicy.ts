// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { PipelineRequest } from "@azure/core-rest-pipeline";
import { StorageSharedKeyCredential } from "../credentials/StorageSharedKeyCredential";
import { HeaderConstants } from "../utils/constants";
import { getURLPath, getURLQueries } from "../utils/utils.common";
import { CredentialPolicy } from "./CredentialPolicy";

/**
 * StorageSharedKeyCredentialPolicy is a policy used to sign HTTP request with a shared key.
 */
export class StorageSharedKeyCredentialPolicy extends CredentialPolicy {
  public readonly name = "StorageSharedKeyCredentialPolicy";
  /**
   * Reference to StorageSharedKeyCredential which generates StorageSharedKeyCredentialPolicy
   */
  public readonly credential: StorageSharedKeyCredential;

  /**
   * Creates an instance of StorageSharedKeyCredentialPolicy.
   * @param nextPolicy -
   * @param options -
   * @param factory -
   */
  constructor(
    crediential: StorageSharedKeyCredential
  ) {
    super();
    this.credential = crediential;
  }

  /**
   * Signs request.
   *
   * @param request -
   */
  protected signRequest(request: PipelineRequest): PipelineRequest {
    request.headers.set(HeaderConstants.X_MS_DATE, new Date().toUTCString());

    if (request.body)
    {
      if ((typeof request.body === "string"))
      {
        if (Buffer.byteLength(request.body) > 0)
        {
        request.headers.set(HeaderConstants.CONTENT_LENGTH, Buffer.byteLength(request.body));
        }
      }
      else if ((request.body as Buffer) !== undefined)
      {
        const bufferBody = request.body as Buffer;
        if (Buffer.byteLength(bufferBody) > 0)
        {
        request.headers.set(HeaderConstants.CONTENT_LENGTH, Buffer.byteLength(bufferBody));
        }
      }
    }

    const stringToSign: string =
      [
        request.method.toUpperCase(),
        this.getHeaderValueToSign(request, HeaderConstants.CONTENT_LANGUAGE),
        this.getHeaderValueToSign(request, HeaderConstants.CONTENT_ENCODING),
        this.getHeaderValueToSign(request, HeaderConstants.CONTENT_LENGTH),
        this.getHeaderValueToSign(request, HeaderConstants.CONTENT_MD5),
        this.getHeaderValueToSign(request, HeaderConstants.CONTENT_TYPE),
        this.getHeaderValueToSign(request, HeaderConstants.DATE),
        this.getHeaderValueToSign(request, HeaderConstants.IF_MODIFIED_SINCE),
        this.getHeaderValueToSign(request, HeaderConstants.IF_MATCH),
        this.getHeaderValueToSign(request, HeaderConstants.IF_NONE_MATCH),
        this.getHeaderValueToSign(request, HeaderConstants.IF_UNMODIFIED_SINCE),
        this.getHeaderValueToSign(request, HeaderConstants.RANGE),
      ].join("\n") +
      "\n" +
      this.getCanonicalizedHeadersString(request) +
      this.getCanonicalizedResourceString(request);

    const signature: string = this.credential.computeHMACSHA256(stringToSign);
    request.headers.set(
      HeaderConstants.AUTHORIZATION,
      `SharedKey ${this.credential.accountName}:${signature}`
    );

    // console.log(`[URL]:${request.url}`);
    // console.log(`[HEADERS]:${request.headers.toString()}`);
    // console.log(`[STRING TO SIGN]:${JSON.stringify(stringToSign)}`);
    // console.log(`[KEY]: ${request.headers.get(HeaderConstants.AUTHORIZATION)}`);
    return request;
  }

  /**
   * Retrieve header value according to shared key sign rules.
   * @see https://docs.microsoft.com/en-us/rest/api/storageservices/authenticate-with-shared-key
   *
   * @param request -
   * @param headerName -
   */
  private getHeaderValueToSign(request: PipelineRequest, headerName: string): string {
    const value = request.headers.get(headerName);

    if (!value) {
      return "";
    }

    // When using version 2015-02-21 or later, if Content-Length is zero, then
    // set the Content-Length part of the StringToSign to an empty string.
    // https://docs.microsoft.com/en-us/rest/api/storageservices/authenticate-with-shared-key
    if (headerName === HeaderConstants.CONTENT_LENGTH && value === "0") {
      return "";
    }

    return value;
  }

  /**
   * To construct the CanonicalizedHeaders portion of the signature string, follow these steps:
   * 1. Retrieve all headers for the resource that begin with x-ms-, including the x-ms-date header.
   * 2. Convert each HTTP header name to lowercase.
   * 3. Sort the headers lexicographically by header name, in ascending order.
   *    Each header may appear only once in the string.
   * 4. Replace any linear whitespace in the header value with a single space.
   * 5. Trim any whitespace around the colon in the header.
   * 6. Finally, append a new-line character to each canonicalized header in the resulting list.
   *    Construct the CanonicalizedHeaders string by concatenating all headers in this list into a single string.
   *
   * @param request -
   */
  private getCanonicalizedHeadersString(request: PipelineRequest): string {
    let headersArray: Array<[string, string]> = [];
    for (const header of request.headers)
    {
      if (header[0].toLocaleLowerCase().startsWith(HeaderConstants.PREFIX_FOR_STORAGE))
      {
        headersArray.push(header);
      }
    }

    headersArray.sort((a: any, b: any): number => {
      return a[0].toLowerCase().localeCompare(b[0].toLowerCase());
    });

    // Remove duplicate headers
    headersArray = headersArray.filter((value, index, array) => {
      if (index > 0 && value[0].toLowerCase() === array[index - 1][0].toLowerCase()) {
        return false;
      }
      return true;
    });

    let canonicalizedHeadersStringToSign: string = "";
    headersArray.forEach((header) => {
      canonicalizedHeadersStringToSign += `${header[0]
        .toLowerCase()
        .trimRight()}:${header[0].trimLeft()}\n`;
    });

    return canonicalizedHeadersStringToSign;
  }

  /**
   * Retrieves the webResource canonicalized resource string.
   *
   * @param request -
   */
  private getCanonicalizedResourceString(request: PipelineRequest): string {
    const path = getURLPath(request.url) || "/";

    let canonicalizedResourceString: string = "";
    canonicalizedResourceString += `/${this.credential.accountName}${path}`;

    const queries = getURLQueries(request.url);
    const lowercaseQueries: { [key: string]: string } = {};
    if (queries) {
      const queryKeys: string[] = [];
      for (const key in queries) {
        if (Object.prototype.hasOwnProperty.call(queries, key)) {
          const lowercaseKey = key.toLowerCase();
          lowercaseQueries[lowercaseKey] = queries[key];
          queryKeys.push(lowercaseKey);
        }
      }

      queryKeys.sort();
      for (const key of queryKeys) {
        canonicalizedResourceString += `\n${key}:${decodeURIComponent(lowercaseQueries[key])}`;
      }
    }

    return canonicalizedResourceString;
  }
}
