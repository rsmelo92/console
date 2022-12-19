import { useMutation, useQueryClient } from "react-query";
import {
  getModelInstanceQuery,
  ModelInstance,
  unDeployModelInstanceAction,
} from "@/lib/instill";

const useUnDeployModelInstance = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (modelInstanceName: string) => {
      const operation = await unDeployModelInstanceAction(modelInstanceName);

      // Get the current model instance staus
      const modelInstance = await getModelInstanceQuery(modelInstanceName);
      return Promise.resolve({ modelInstance, operation });
    },
    {
      onSuccess: ({ modelInstance }) => {
        const modelId = modelInstance.name.split("/")[1];

        queryClient.setQueryData<ModelInstance>(
          ["models", modelId, "modelInstances", modelInstance.id],
          modelInstance
        );

        queryClient.setQueryData<ModelInstance[]>(
          ["models", modelId, "modelInstances"],
          (old) => {
            if (!old) {
              return [modelInstance];
            }

            return [
              ...old.filter((e) => e.id !== modelInstance.id),
              modelInstance,
            ];
          }
        );
      },
    }
  );
};

export default useUnDeployModelInstance;
