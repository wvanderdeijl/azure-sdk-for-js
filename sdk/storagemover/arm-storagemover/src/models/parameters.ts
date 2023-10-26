/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

import {
  OperationParameter,
  OperationURLParameter,
  OperationQueryParameter
} from "@azure/core-client";
import {
  StorageMover as StorageMoverMapper,
  StorageMoverUpdateParameters as StorageMoverUpdateParametersMapper,
  Agent as AgentMapper,
  AgentUpdateParameters as AgentUpdateParametersMapper,
  Endpoint as EndpointMapper,
  EndpointBaseUpdateParameters as EndpointBaseUpdateParametersMapper,
  Project as ProjectMapper,
  ProjectUpdateParameters as ProjectUpdateParametersMapper,
  JobDefinition as JobDefinitionMapper,
  JobDefinitionUpdateParameters as JobDefinitionUpdateParametersMapper
} from "../models/mappers";

export const accept: OperationParameter = {
  parameterPath: "accept",
  mapper: {
    defaultValue: "application/json",
    isConstant: true,
    serializedName: "Accept",
    type: {
      name: "String"
    }
  }
};

export const $host: OperationURLParameter = {
  parameterPath: "$host",
  mapper: {
    serializedName: "$host",
    required: true,
    type: {
      name: "String"
    }
  },
  skipEncoding: true
};

export const apiVersion: OperationQueryParameter = {
  parameterPath: "apiVersion",
  mapper: {
    defaultValue: "2023-10-01",
    isConstant: true,
    serializedName: "api-version",
    type: {
      name: "String"
    }
  }
};

export const nextLink: OperationURLParameter = {
  parameterPath: "nextLink",
  mapper: {
    serializedName: "nextLink",
    required: true,
    type: {
      name: "String"
    }
  },
  skipEncoding: true
};

export const subscriptionId: OperationURLParameter = {
  parameterPath: "subscriptionId",
  mapper: {
    constraints: {
      MinLength: 1
    },
    serializedName: "subscriptionId",
    required: true,
    type: {
      name: "String"
    }
  }
};

export const resourceGroupName: OperationURLParameter = {
  parameterPath: "resourceGroupName",
  mapper: {
    constraints: {
      MaxLength: 90,
      MinLength: 1
    },
    serializedName: "resourceGroupName",
    required: true,
    type: {
      name: "String"
    }
  }
};

export const storageMoverName: OperationURLParameter = {
  parameterPath: "storageMoverName",
  mapper: {
    serializedName: "storageMoverName",
    required: true,
    type: {
      name: "String"
    }
  }
};

export const contentType: OperationParameter = {
  parameterPath: ["options", "contentType"],
  mapper: {
    defaultValue: "application/json",
    isConstant: true,
    serializedName: "Content-Type",
    type: {
      name: "String"
    }
  }
};

export const storageMover: OperationParameter = {
  parameterPath: "storageMover",
  mapper: StorageMoverMapper
};

export const storageMover1: OperationParameter = {
  parameterPath: "storageMover",
  mapper: StorageMoverUpdateParametersMapper
};

export const agentName: OperationURLParameter = {
  parameterPath: "agentName",
  mapper: {
    serializedName: "agentName",
    required: true,
    type: {
      name: "String"
    }
  }
};

export const agent: OperationParameter = {
  parameterPath: "agent",
  mapper: AgentMapper
};

export const agent1: OperationParameter = {
  parameterPath: "agent",
  mapper: AgentUpdateParametersMapper
};

export const endpointName: OperationURLParameter = {
  parameterPath: "endpointName",
  mapper: {
    serializedName: "endpointName",
    required: true,
    type: {
      name: "String"
    }
  }
};

export const endpoint: OperationParameter = {
  parameterPath: "endpoint",
  mapper: EndpointMapper
};

export const endpoint1: OperationParameter = {
  parameterPath: "endpoint",
  mapper: EndpointBaseUpdateParametersMapper
};

export const projectName: OperationURLParameter = {
  parameterPath: "projectName",
  mapper: {
    serializedName: "projectName",
    required: true,
    type: {
      name: "String"
    }
  }
};

export const project: OperationParameter = {
  parameterPath: "project",
  mapper: ProjectMapper
};

export const project1: OperationParameter = {
  parameterPath: "project",
  mapper: ProjectUpdateParametersMapper
};

export const jobDefinitionName: OperationURLParameter = {
  parameterPath: "jobDefinitionName",
  mapper: {
    serializedName: "jobDefinitionName",
    required: true,
    type: {
      name: "String"
    }
  }
};

export const jobDefinition: OperationParameter = {
  parameterPath: "jobDefinition",
  mapper: JobDefinitionMapper
};

export const jobDefinition1: OperationParameter = {
  parameterPath: "jobDefinition",
  mapper: JobDefinitionUpdateParametersMapper
};

export const jobRunName: OperationURLParameter = {
  parameterPath: "jobRunName",
  mapper: {
    serializedName: "jobRunName",
    required: true,
    type: {
      name: "String"
    }
  }
};
