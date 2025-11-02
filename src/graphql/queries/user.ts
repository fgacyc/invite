import { useMutation, useQueryClient } from "@tanstack/react-query";
import { executeMutation } from "../queries";
import { getAuthHeaders } from "../server";

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
