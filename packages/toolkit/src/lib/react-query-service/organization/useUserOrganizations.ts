import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Nullable } from "../../type";
import {
  Organization,
  UpdateOrganizationPayload,
  getUserOrganizations,
  updateOrganizationMutation,
} from "../../vdp-sdk";

export const useUserOrganizations = ({
  userName,
  accessToken,
  enabled,
  retry,
}: {
  userName: Nullable<string>;
  accessToken: Nullable<string>;
  enabled: boolean;
  /**
   * - Default is 3
   * - Set to false to disable retry
   */
  retry?: false | number;
}) => {
  let enableQuery = false;

  if (userName && enabled) {
    enableQuery = true;
  }

  return useQuery(
    ["users", userName, "memberships"],
    async () => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      if (!userName) {
        return Promise.reject(new Error("User name not provided"));
      }

      const model = await getUserOrganizations({
        userName,
        accessToken,
      });

      return Promise.resolve(model);
    },
    {
      enabled: enableQuery,
      retry: retry === false ? false : retry ? retry : 3,
    }
  );
};