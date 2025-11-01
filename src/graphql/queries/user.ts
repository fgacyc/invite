import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { executeQuery, executeMutation } from "../queries";
import { useUser } from "@/stores/useUser";
import type { GraphQLUser, UserCollectionResponse } from "../../types/graphql";

// Helper function to get authenticated headers
const getAuthHeaders = () => {
  const { token } = useUser.getState();
  if (!token) throw new Error("No or Invalid token");
  return {
    Authorization: `Bearer ${token}`,
  };
};

// GraphQL Operations
const GET_SINGLE_PERSON = `
  query GetSinglePerson($uid: String!) {
    userCollection(filter: { id: { eq: $uid } }) {
      edges {
        node {
          id
          no
          name
          given_name
          family_name
          gender
          phone_number
          nickname
          avatar_url
          ic_number
          date_of_birth
          email
          connect_group_inviteCollection(filter: { status: { eq: "pending" } }) {
            edges {
              node {
                cg_id
                status
                created_at
                connect_group {
                  id
                  name
                  satellite {
                    id
                    name
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

const UPDATE_SINGLE_PERSON = `
  mutation UpdateSinglePerson(
    $uid: String!
    $name: String
    $given_name: String
    $family_name: String
    $gender: String
    $phone_number: String
    $nickname: String
    $ic_number: String
    $date_of_birth: String
  ) {
    updateuserCollection(
      filter: { id: { eq: $uid } }
      set: {
        name: $name
        given_name: $given_name
        family_name: $family_name
        gender: $gender
        phone_number: $phone_number
        nickname: $nickname
        ic_number: $ic_number
        date_of_birth: $date_of_birth
      }
    ) {
      affectedCount
      records {
        id
        name
        given_name
        family_name
        gender
        phone_number
        nickname
        ic_number
        date_of_birth
      }
    }
  }
`;

// Query Hooks
export const useSinglePerson = (uid: string) => {
  return useQuery({
    queryKey: ["singlePerson", uid, "v4"], // Added version to bust cache
    queryFn: async (): Promise<GraphQLUser | null> => {
      try {
        const data = await executeQuery(
          GET_SINGLE_PERSON,
          { uid },
          getAuthHeaders(),
        );
        const response = data as UserCollectionResponse;
        return response.userCollection.edges[0]?.node ?? null;
      } catch (error) {
        console.error("Error fetching single person:", error);
        return null;
      }
    },
    enabled: !!uid,
  });
};

export const useUpdateSinglePerson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: {
      uid: string;
      name?: string;
      given_name?: string;
      family_name?: string;
      gender?: string;
      phone_number?: string;
      nickname?: string;
      ic_number?: string;
      date_of_birth?: string;
    }) => {
      return await executeMutation(
        UPDATE_SINGLE_PERSON,
        variables,
        getAuthHeaders(),
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["singlePerson", variables.uid],
      });
    },
  });
};
