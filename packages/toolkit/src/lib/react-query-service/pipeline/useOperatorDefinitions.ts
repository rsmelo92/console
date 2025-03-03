import { useQuery } from "@tanstack/react-query";
import { env } from "../../utility";
import { listOperatorDefinitionsQuery } from "../../vdp-sdk";
import type { Nullable } from "../../type";

export const useOperatorDefinitions = ({
  accessToken,
  enabled,
  retry,
}: {
  accessToken: Nullable<string>;
  enabled: boolean;
  /**
   * - Default is 3
   * - Set to false to disable retry
   */
  retry?: false | number;
}) => {
  return useQuery(
    ["operator-definitions"],
    async () => {
      const operatorDefinitions = await listOperatorDefinitionsQuery({
        pageSize: env("NEXT_PUBLIC_QUERY_PAGE_SIZE"),
        nextPageToken: null,
        accessToken,
        filter: null,
      });

      return Promise.resolve(operatorDefinitions);
    },
    {
      enabled,
      retry: retry === false ? false : retry ? retry : 3,
    }
  );
};
