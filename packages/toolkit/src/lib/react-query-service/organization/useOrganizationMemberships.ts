import { useQuery } from "@tanstack/react-query";
import type { Nullable } from "../../type";
import { getOrganizationMembershipsQuery } from "../../vdp-sdk";

export const useOrganizationMemberships = ({
  organizationID,
  accessToken,
  enabled,
  retry,
}: {
  organizationID: Nullable<string>;
  accessToken: Nullable<string>;
  enabled: boolean;
  /**
   * - Default is 3
   * - Set to false to disable retry
   */
  retry?: false | number;
}) => {
  let enableQuery = false;

  if (organizationID && enabled) {
    enableQuery = true;
  }

  return useQuery(
    ["organizations", organizationID, "memberships"],
    async () => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      if (!organizationID) {
        return Promise.reject(new Error("organizationID not provided"));
      }

      const membership = await getOrganizationMembershipsQuery({
        organizationID,
        accessToken,
      });

      return Promise.resolve(membership);
    },
    {
      enabled: enableQuery,
      retry: retry === false ? false : retry ? retry : 3,
    }
  );
};
