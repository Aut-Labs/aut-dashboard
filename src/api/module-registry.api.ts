import AutSDK, { DAOExpander, fetchMetadata } from "@aut-labs-private/sdk";
import { BaseQueryApi, createApi } from "@reduxjs/toolkit/query/react";
import { REHYDRATE } from "redux-persist";
import { environment } from "./environment";
import { ModuleDefinition } from "@aut-labs-private/sdk/dist/models/plugin";

const fetch = async (body: any, api: BaseQueryApi) => {
  const sdk = AutSDK.getInstance();
  const state = api.getState() as any;
  const { selectedCommunityAddress } = state.community;

  if (!sdk.daoExpander) {
    sdk.daoExpander = sdk.initService<DAOExpander>(
      DAOExpander,
      selectedCommunityAddress
    );
  }

  const response = await sdk.moduleRegistry.getModuleDefinitions();

  if (response?.isSuccess) {
    const definitionsWithMetadata: ModuleDefinition[] = [];
    for (let i = 1; i < response.data.length; i++) {
      const def = response.data[i];
      const isActivatedResponse = await sdk.daoExpander.isModuleActivated(1);

      const moduleData = {
        ...def,
        isActivated: isActivatedResponse.data,
        metadata: await fetchMetadata<typeof def.metadata>(
          def.metadataURI,
          environment.nftStorageUrl
        )
      };

      moduleData.metadata.properties.type =
        moduleData.metadata.properties.title;

      if (moduleData.metadata.properties.title === "Onboarding Strategy") {
        moduleData.metadata.properties.type = "OnboardingStrategy";
      }

      if (moduleData.metadata.properties.title === "Task Type") {
        moduleData.metadata.properties.type = "Task";
      }

      definitionsWithMetadata.push(moduleData);
    }
    response.data = definitionsWithMetadata;
    return response;
  }
  return {
    error: response.errorMessage
  };
};

const activateModule = async ({ moduleId = 1 }, api: BaseQueryApi) => {
  const sdk = AutSDK.getInstance();
  const state = api.getState() as any;
  const { selectedCommunityAddress } = state.community;

  if (!sdk.daoExpander) {
    sdk.daoExpander = sdk.initService<DAOExpander>(
      DAOExpander,
      selectedCommunityAddress
    );
  }

  const response = await sdk.daoExpander.activateModule(moduleId);

  if (response.isSuccess) {
    return {
      data: true
    };
  }
  return {
    data: response.errorMessage
  };
};

const KEEP_DATA_UNUSED = 5 * 60;

export const moduleRegistryApi = createApi({
  reducerPath: "moduleRegistryApi",
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.payload && action.type === REHYDRATE) {
      return action.payload[reducerPath];
    }
  },
  keepUnusedDataFor: KEEP_DATA_UNUSED,
  baseQuery: async (args, api) => {
    const { url, body } = args;
    if (url === "getAllModuleDefinitions") {
      return fetch(body, api);
    }

    if (url === "activateModule") {
      return activateModule(body, api);
    }

    return {
      data: "Test"
    };
  },
  tagTypes: ["Modules"],
  endpoints: (builder) => ({
    getAllModuleDefinitions: builder.query<ModuleDefinition[], void>({
      query: (body) => {
        return {
          body,
          url: "getAllModuleDefinitions"
        };
      },
      providesTags: ["Modules"]
    }),
    activateModule: builder.mutation<
      boolean,
      {
        moduleId: number;
      }
    >({
      query: (body) => {
        return {
          body,
          url: "activateModule"
        };
      },
      invalidatesTags: ["Modules"]
    })
  })
});

export const {
  useGetAllModuleDefinitionsQuery,
  useActivateModuleMutation,
  useLazyGetAllModuleDefinitionsQuery
} = moduleRegistryApi;