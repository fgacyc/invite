import {
  useQuery,
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useState, useEffect } from "react";
import {
  fetchCGDetails,
  getUserCG,
  getCGMembers,
  getAuthHeaders,
  fetchSatellite,
  getAllPastoralRole,
  getPastoralRole,
  editCG,
  getAllCGWithParams,
  getCGLeader,
  createCGInvite,
  cancelCGInvite,
  getPendingCGInvites,
  removeMemberFromCG,
  declineCGInvite,
  acceptCGInvite,
  updateUserConnectGroup,
} from "../server";
import { executeQuery } from "../queries";
import type {
  FetchCGDetailsResponse,
  GetUserCGResponse,
  GetCGMembersResponse,
  GetCGMembersHookResponse,
  FetchSatelliteResponse,
  GetAllPastoralRoleResponse,
  GetPastoralRoleResponse,
  GetAllCGResponse,
  GetCGLeaderResponse,
  GetPendingCGInvitesResponse,
} from "@/types/graphql";

export const connectGroupQueries = {
  default: [{ scope: "connect_group" }] as const,
  allCGWithParams: (key: string) =>
    queryOptions({
      queryKey: [{ ...connectGroupQueries.default[0], type: "all_cg" }],
      queryFn: () => getAllCGWithParams(key),
    }),
  cgDetails: (id: string) =>
    queryOptions({
      queryKey: [
        { ...connectGroupQueries.default[0], type: "cg_details" },
      ] as const,
      queryFn: () => fetchCGDetails(id),
    }),
  satellite: (id: string) =>
    queryOptions({
      queryKey: [
        { ...connectGroupQueries.default[0], type: "satellite" },
      ] as const,
      queryFn: () => fetchSatellite(id),
    }),
  userCG: (uid: string) =>
    queryOptions({
      queryKey: [
        { ...connectGroupQueries.default[0], type: "user_cg", uid },
      ] as const,
      queryFn: (): Promise<GetUserCGResponse> => {
        console.log("Fetching user CG for UID:", uid);
        if (!uid) {
          throw new Error("UID is required for fetching user CG");
        }
        return getUserCG(uid);
      },
      enabled: !!uid,
    }),
  pastoralRole: (id: string) =>
    queryOptions({
      queryKey: [
        { ...connectGroupQueries.default[0], type: "pastoral_role", id },
      ],
      queryFn: () => getPastoralRole(id),
    }),
  allPastoralRole: () =>
    queryOptions({
      queryKey: [
        { ...connectGroupQueries.default[0], type: "all_pastoral_role" },
      ],
      queryFn: () => getAllPastoralRole(),
    }),
  cgMembers: (uid: string) =>
    queryOptions({
      queryKey: [
        { ...connectGroupQueries.default[0], type: "cg_members", uid },
      ] as const,
      queryFn: (): Promise<GetCGMembersResponse> => {
        console.log("Fetching CG members for UID:", uid);
        if (!uid) {
          throw new Error("UID is required for fetching CG members");
        }
        return getCGMembers(uid);
      },
      enabled: !!uid,
    }),
};

// Query hooks
export const usePastoralRole = (id: string) => {
  const token = localStorage.getItem("token");
  return useQuery<GetPastoralRoleResponse>({
    queryKey: ["pastoralRole", id],
    queryFn: () => getPastoralRole(id),
    enabled: !!token && !!id,
  });
};

export const useAllPastoralRole = () => {
  const token = localStorage.getItem("token");

  return useQuery<GetAllPastoralRoleResponse>({
    queryKey: ["allPastoralRole"],
    queryFn: () => getAllPastoralRole(),
    enabled: !!token,
  });
};

export const useCGDetails = (cgId: string) => {
  const token = localStorage.getItem("token");

  return useQuery<FetchCGDetailsResponse>({
    queryKey: [{ ...connectGroupQueries.default[0], type: "cg_details", cgId }],
    queryFn: () => fetchCGDetails(cgId),
    enabled: !!token && !!cgId,
  });
};

export const useSatellite = (id: string) => {
  const token = localStorage.getItem("token");

  return useQuery<FetchSatelliteResponse>({
    queryKey: ["satellite", id],
    queryFn: () => fetchSatellite(id),
    enabled: !!token && !!id,
  });
};

export const useUserCG = (uid: string) => {
  const token = localStorage.getItem("token");

  return useQuery<GetUserCGResponse>({
    queryKey: ["userCG", uid],
    queryFn: () => getUserCG(uid),
    enabled: !!token && !!uid,
  });
};

export const useCGMembers = (uid: string) => {
  const token = localStorage.getItem("token");

  return useQuery<GetCGMembersResponse>({
    queryKey: ["cgMembers", uid],
    queryFn: () => getCGMembers(uid),
    enabled: !!token && !!uid,
  });
};

// GraphQL query for getting members by group ID
const GET_CG_MEMBERS_BY_ID = `
  query GetCGMembers($connectGroupId: String!) {
    user_connect_groupCollection(
      filter: { connect_group_id: { eq: $connectGroupId } }
    ) {
      edges {
        node {
          user {
            id
            no
            name
            given_name
            family_name
            phone_number
            nickname
            avatar_url
          }
        }
      }
    }
  }
`;

export const useAllCGWithParams = (key: string, enabled = true) => {
  const [debouncedKey, setDebouncedKey] = useState(key);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKey(key);
    }, 500);

    return () => clearTimeout(timer);
  }, [key]);

  return useQuery<GetAllCGResponse>({
    queryKey: ["allCGWithParams", debouncedKey],
    queryFn: () => getAllCGWithParams(debouncedKey),
    enabled: enabled && debouncedKey.length > 0,
  });
};

export const useCGMembersByGroupId = (connectGroupId: string) => {
  return useQuery({
    queryKey: ["cgMembersByGroupId", connectGroupId],
    queryFn: async () => {
      try {
        const data = await executeQuery(
          GET_CG_MEMBERS_BY_ID,
          { connectGroupId },
          getAuthHeaders(),
        );
        const response = data as GetCGMembersHookResponse;
        return response.user_connect_groupCollection.edges.map(
          (edge) => edge.node.user,
        );
      } catch (error) {
        console.error("Error fetching CG members by group ID:", error);
        return [];
      }
    },
    enabled: !!connectGroupId,
  });
};

export const useCGLeader = (connectGroupId: string) => {
  const token = localStorage.getItem("token");

  return useQuery<GetCGLeaderResponse>({
    queryKey: ["cgLeader", connectGroupId],
    queryFn: () => getCGLeader(connectGroupId),
    enabled: !!token && !!connectGroupId,
  });
};

export const usePendingCGInvites = (cgId: string) => {
  const token = localStorage.getItem("token");

  return useQuery<GetPendingCGInvitesResponse>({
    queryKey: ["pendingCGInvites", cgId],
    queryFn: () => getPendingCGInvites(cgId),
    enabled: !!token && !!cgId,
  });
};

// Mutation hooks
export const useEditCG = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      id: string;
      name?: string;
      image_url?: string;
      description?: string;
    }) => editCG(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: connectGroupQueries.default });
    },
  });
};

export const useRemoveMemberFromCG = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { id: string }) => removeMemberFromCG(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: connectGroupQueries.default });
    },
  });
};

export const useCreateCGInvite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      cg_id: string;
      user_id: string;
      created_by: string;
    }) => createCGInvite(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: connectGroupQueries.default });
    },
  });
};

export const useCancelCGInvite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { user_id: string }) => cancelCGInvite(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: connectGroupQueries.default });
      queryClient.invalidateQueries({ queryKey: ["singlePerson"] });
    },
  });
};

export const useDeclineCGInvite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { user_id: string }) => declineCGInvite(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: connectGroupQueries.default });
      queryClient.invalidateQueries({ queryKey: ["singlePerson"] });
    },
  });
};

export const useAcceptCGInvite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { user_id: string; connect_group_id: string }) => {
      // First, update invite status to "accepted"
      await acceptCGInvite({ user_id: data.user_id });

      // Then, update the user's connect group
      return await updateUserConnectGroup({
        user_id: data.user_id,
        connect_group_id: data.connect_group_id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: connectGroupQueries.default });
      queryClient.invalidateQueries({ queryKey: ["singlePerson"] });
    },
  });
};
