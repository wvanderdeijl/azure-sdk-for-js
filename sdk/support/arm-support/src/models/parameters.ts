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
  CheckNameAvailabilityInput as CheckNameAvailabilityInputMapper,
  UpdateSupportTicket as UpdateSupportTicketMapper,
  SupportTicketDetails as SupportTicketDetailsMapper,
  CommunicationDetails as CommunicationDetailsMapper,
  FileDetails as FileDetailsMapper,
  UploadFile as UploadFileMapper
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
    defaultValue: "2022-09-01-preview",
    isConstant: true,
    serializedName: "api-version",
    type: {
      name: "String"
    }
  }
};

export const serviceName: OperationURLParameter = {
  parameterPath: "serviceName",
  mapper: {
    serializedName: "serviceName",
    required: true,
    type: {
      name: "String"
    }
  }
};

export const problemClassificationName: OperationURLParameter = {
  parameterPath: "problemClassificationName",
  mapper: {
    serializedName: "problemClassificationName",
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

export const checkNameAvailabilityInput: OperationParameter = {
  parameterPath: "checkNameAvailabilityInput",
  mapper: CheckNameAvailabilityInputMapper
};

export const subscriptionId: OperationURLParameter = {
  parameterPath: "subscriptionId",
  mapper: {
    serializedName: "subscriptionId",
    required: true,
    type: {
      name: "String"
    }
  }
};

export const top: OperationQueryParameter = {
  parameterPath: ["options", "top"],
  mapper: {
    serializedName: "$top",
    type: {
      name: "Number"
    }
  }
};

export const filter: OperationQueryParameter = {
  parameterPath: ["options", "filter"],
  mapper: {
    serializedName: "$filter",
    type: {
      name: "String"
    }
  }
};

export const supportTicketName: OperationURLParameter = {
  parameterPath: "supportTicketName",
  mapper: {
    serializedName: "supportTicketName",
    required: true,
    type: {
      name: "String"
    }
  }
};

export const updateSupportTicket: OperationParameter = {
  parameterPath: "updateSupportTicket",
  mapper: UpdateSupportTicketMapper
};

export const createSupportTicketParameters: OperationParameter = {
  parameterPath: "createSupportTicketParameters",
  mapper: SupportTicketDetailsMapper
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

export const communicationName: OperationURLParameter = {
  parameterPath: "communicationName",
  mapper: {
    serializedName: "communicationName",
    required: true,
    type: {
      name: "String"
    }
  }
};

export const createCommunicationParameters: OperationParameter = {
  parameterPath: "createCommunicationParameters",
  mapper: CommunicationDetailsMapper
};

export const chatTranscriptName: OperationURLParameter = {
  parameterPath: "chatTranscriptName",
  mapper: {
    serializedName: "chatTranscriptName",
    required: true,
    type: {
      name: "String"
    }
  }
};

export const fileWorkspaceName: OperationURLParameter = {
  parameterPath: "fileWorkspaceName",
  mapper: {
    serializedName: "fileWorkspaceName",
    required: true,
    type: {
      name: "String"
    }
  }
};

export const fileWorkspaceName1: OperationURLParameter = {
  parameterPath: "fileWorkspaceName",
  mapper: {
    constraints: {
      Pattern: new RegExp("^[0-9a-zA-Z_\\-. ]+$")
    },
    serializedName: "fileWorkspaceName",
    required: true,
    type: {
      name: "String"
    }
  }
};

export const fileName: OperationURLParameter = {
  parameterPath: "fileName",
  mapper: {
    serializedName: "fileName",
    required: true,
    type: {
      name: "String"
    }
  }
};

export const createFileParameters: OperationParameter = {
  parameterPath: "createFileParameters",
  mapper: FileDetailsMapper
};

export const uploadFile: OperationParameter = {
  parameterPath: "uploadFile",
  mapper: UploadFileMapper
};
