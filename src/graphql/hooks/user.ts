import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { executeQuery, executeMutation } from "../queries";
import { getAuthHeaders } from "../server";
import type {
  GetSinglePersonHookResponse,
  UpdateSinglePersonHookResponse,
} from "@/types/graphql";

// GraphQL Operations
export const GET_SINGLE_PERSON = `
  query GetSinglePerson($uid: String!) {
  userCollection(filter: {id: {eq: $uid}}) {
    edges {
      node {
        id
        no
        created_at
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
        metadata
        connect_group_inviteCollection (filter: { status: { eq: "pending" } }) {
          edges {
            node {
              status
              created_at
              connect_group {
                id
                name
                satellite_id
              }
            }
          }
        }
        user_connect_groupCollection {
          edges {
            node {
              pastoral_role {
                id
                name
                weight
              }
              connect_group {
                id
                name
                satellite_id
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
    queryKey: ["singlePerson", uid],
    queryFn: async () => {
      try {
        const data = await executeQuery(
          GET_SINGLE_PERSON,
          { uid },
          getAuthHeaders(),
        );
        const response = data as GetSinglePersonHookResponse;
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
    }): Promise<UpdateSinglePersonHookResponse> => {
      return (await executeMutation(
        UPDATE_SINGLE_PERSON,
        variables,
        getAuthHeaders(),
      )) as Promise<UpdateSinglePersonHookResponse>;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["singlePerson", variables.uid],
      });
    },
  });
};
