// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { ClientContext } from "../../ClientContext";
import { DiagnosticNodeInternal } from "../../CosmosDiagnostics";
import { startTracing } from "../../CosmosDiagnosticsContext";
import {
  createUserDefinedFunctionUri,
  getIdFromLink,
  getPathFromLink,
  isResourceValid,
  ResourceType,
} from "../../common";
import { RequestOptions } from "../../request";
import { Container } from "../Container";
import { UserDefinedFunctionDefinition } from "./UserDefinedFunctionDefinition";
import { UserDefinedFunctionResponse } from "./UserDefinedFunctionResponse";

/**
 * Used to read, replace, or delete a specified User Definied Function by id.
 *
 * @see {@link UserDefinedFunction} to create, upsert, query, read all User Defined Functions.
 */
export class UserDefinedFunction {
  /**
   * Returns a reference URL to the resource. Used for linking in Permissions.
   */
  public get url(): string {
    return createUserDefinedFunctionUri(this.container.database.id, this.container.id, this.id);
  }
  /**
   * @hidden
   * @param container - The parent {@link Container}.
   * @param id - The id of the given {@link UserDefinedFunction}.
   */
  constructor(
    public readonly container: Container,
    public readonly id: string,
    private readonly clientContext: ClientContext
  ) {}

  /**
   * Read the {@link UserDefinedFunctionDefinition} for the given {@link UserDefinedFunction}.
   */
  public async read(options?: RequestOptions): Promise<UserDefinedFunctionResponse> {
    return await startTracing(async (diagnosticNode: DiagnosticNodeInternal) => {
      const path = getPathFromLink(this.url);
      const id = getIdFromLink(this.url);

      const response = await this.clientContext.read<UserDefinedFunctionDefinition>({
        path,
        resourceType: ResourceType.udf,
        resourceId: id,
        options,
        diagnosticNode,
      });
      return new UserDefinedFunctionResponse(
        response.result,
        response.headers,
        response.code,
        this,
        diagnosticNode.toDiagnostic()
      );
    }, this.clientContext);
  }

  /**
   * Replace the given {@link UserDefinedFunction} with the specified {@link UserDefinedFunctionDefinition}.
   * @param options -
   */
  public async replace(
    body: UserDefinedFunctionDefinition,
    options?: RequestOptions
  ): Promise<UserDefinedFunctionResponse> {
    return await startTracing(async (diagnosticNode: DiagnosticNodeInternal) => {
      if (body.body) {
        body.body = body.body.toString();
      }

      const err = {};
      if (!isResourceValid(body, err)) {
        throw err;
      }

      const path = getPathFromLink(this.url);
      const id = getIdFromLink(this.url);

      const response = await this.clientContext.replace<UserDefinedFunctionDefinition>({
        body,
        path,
        resourceType: ResourceType.udf,
        resourceId: id,
        options,
        diagnosticNode,
      });
      return new UserDefinedFunctionResponse(
        response.result,
        response.headers,
        response.code,
        this,
        diagnosticNode.toDiagnostic()
      );
    }, this.clientContext);
  }

  /**
   * Delete the given {@link UserDefined}.
   */
  public async delete(options?: RequestOptions): Promise<UserDefinedFunctionResponse> {
    return await startTracing(async (diagnosticNode: DiagnosticNodeInternal) => {
      const path = getPathFromLink(this.url);
      const id = getIdFromLink(this.url);

      const response = await this.clientContext.delete({
        path,
        resourceType: ResourceType.udf,
        resourceId: id,
        options,
        diagnosticNode,
      });
      return new UserDefinedFunctionResponse(
        response.result,
        response.headers,
        response.code,
        this,
        diagnosticNode.toDiagnostic()
      );
    }, this.clientContext);
  }
}
