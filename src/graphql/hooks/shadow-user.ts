import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bindShadowUser, createShadowUser } from "../server";
import type {
  BindShadowUserResponse,
  CreateShadowUserResponse,
} from "@/types/graphql";

export const shadowUserQueries = {
  default: [{ scope: "shadow_user" }] as const,
};

// Mutation hooks
export const useCreateShadowUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      name?: string;
      cg?: string;
      dob?: string;
      role?: string;
      gender?: string;
      metadata?: string;
    }): Promise<CreateShadowUserResponse> => createShadowUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shadowUserQueries.default });
    },
  });
};

export const useBindShadowUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      shadowUserId: string;
      targetUserId: string;
    }): Promise<BindShadowUserResponse> => bindShadowUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["connect-group", shadowUserQueries.default],
      });
    },
  });
};
