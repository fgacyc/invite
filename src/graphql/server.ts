import { gql } from "graphql-request";
import { executeQuery, executeMutation } from "./queries";
import { jwtDecode } from "jwt-decode";
import type {
  GetUserProfileResponse,
  UpdateUserProfileResponse,
  CreateUserResponse,
  DeleteUserResponse,
  FetchSinglePersonResponse,
  FetchAllPersonsResponse,
  UpdateSinglePersonResponse,
  CreateShadowUserResponse,
  FetchCGDetailsResponse,
  GetUserCGResponse,
  GetCGMembersResponse,
  GetLatestCGAttendanceResponse,
  FetchSatelliteResponse,
  GetAllPastoralRoleResponse,
  GetPastoralRoleResponse,
  EditCGResponse,
  GetAllAttendanceResponse,
  GetAllCGResponse,
  GetCGLeaderResponse,
  CreateCGInviteResponse,
  GetPendingCGInvitesResponse,
  RemoveMemberFromCGResponse,
  BindShadowUserResponse,
} from "@/types/graphql";

// Helper function to get authenticated headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No authentication token available. Please log in again.");
  }

  // Check token expiration
  try {
    const decoded = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    const tokenExp = decoded.exp;

    if (tokenExp && currentTime > tokenExp) {
      throw new Error("Token has expired. Please log in again.");
    }
  } catch (error) {
    console.error("Error decoding token:", error);
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};

// User operations
export const getUserProfile = async (): Promise<GetUserProfileResponse> => {
  const query = gql`
    query GetUserProfile {
      user {
        id
        name
        email
        avatar_url
        created_at
        updated_at
      }
    }
  `;

  return executeQuery(
    query,
    {},
    getAuthHeaders(),
  ) as Promise<GetUserProfileResponse>;
};

export const updateUserProfile = async (data: {
  name?: string;
  email?: string;
  avatar_url?: string;
}): Promise<UpdateUserProfileResponse> => {
  const mutation = gql`
    mutation UpdateUserProfile(
      $name: String
      $email: String
      $avatar_url: String
    ) {
      update_user(name: $name, email: $email, avatar_url: $avatar_url) {
        id
        name
        email
        avatar_url
        updated_at
      }
    }
  `;

  return executeMutation(
    mutation,
    data,
    getAuthHeaders(),
  ) as Promise<UpdateUserProfileResponse>;
};

// Add more operations as needed
export const createUser = async (data: {
  name: string;
  email: string;
}): Promise<CreateUserResponse> => {
  const mutation = gql`
    mutation CreateUser($name: String!, $email: String!) {
      create_user(name: $name, email: $email) {
        id
        name
        email
        created_at
      }
    }
  `;

  return executeMutation(
    mutation,
    data,
    getAuthHeaders(),
  ) as Promise<CreateUserResponse>;
};

export const deleteUser = async (id: string): Promise<DeleteUserResponse> => {
  const mutation = gql`
    mutation DeleteUser($id: ID!) {
      delete_user(id: $id) {
        success
      }
    }
  `;

  return executeMutation(
    mutation,
    { id },
    getAuthHeaders(),
  ) as Promise<DeleteUserResponse>;
};

export const fetchSinglePerson = async (
  email: string,
): Promise<FetchSinglePersonResponse> => {
  const query = gql`
    query FetchSinglePerson($email: String) {
      userCollection(filter: { email: { eq: $email } }) {
        edges {
          node {
            id
            name
            email
          }
        }
      }
    }
  `;

  return executeQuery(
    query,
    { email },
    getAuthHeaders(),
  ) as Promise<FetchSinglePersonResponse>;
};

export const fetchAllPersons = async (): Promise<FetchAllPersonsResponse> => {
  const query = gql`
    query FetchAllPersons {
      userCollection {
        edges {
          node {
            id
            name
            email
          }
        }
      }
    }
  `;

  return executeQuery(
    query,
    {},
    getAuthHeaders(),
  ) as Promise<FetchAllPersonsResponse>;
};

export const updateSinglePerson = async (data: {
  email: string;
  name: string;
}): Promise<UpdateSinglePersonResponse> => {
  const mutation = gql`
    mutation UpdateSinglePerson($email: String, $name: String) {
      updateuserCollection(
        filter: { email: { eq: $email } }
        set: { name: $name }
      ) {
        records {
          name
          address
          email
        }
      }
    }
  `;

  return executeMutation(
    mutation,
    data,
    getAuthHeaders(),
  ) as Promise<UpdateSinglePersonResponse>;
};

export const editCG = async (data: {
  id: string;
  name?: string;
  image_url?: string;
  description?: string;
}): Promise<EditCGResponse> => {
  const mutation = gql`
    mutation (
      $id: String
      $name: String
      $image_url: String
      $description: String
    ) {
      updateconnect_groupCollection(
        filter: { id: { eq: $id } }
        set: { name: $name, image_url: $image_url, description: $description }
      ) {
        records {
          name
          image_url
          description
        }
      }
    }
  `;

  return executeMutation(
    mutation,
    data,
    getAuthHeaders(),
  ) as Promise<EditCGResponse>;
};

export const removeMemberFromCG = async (data: {
  id: string;
}): Promise<RemoveMemberFromCGResponse> => {
  const mutation = gql`
    mutation ($id: String) {
      deleteFromuser_connect_groupCollection(filter: { user_id: { eq: $id } }) {
        records {
          connect_group_id
        }
      }
    }
  `;

  return executeMutation(
    mutation,
    data,
    getAuthHeaders(),
  ) as Promise<RemoveMemberFromCGResponse>;
};

export const createCGInvite = async (data: {
  cg_id: string;
  user_id: string;
  created_by: string;
}): Promise<CreateCGInviteResponse> => {
  // First, try to update existing invite if it exists
  const updateMutation = gql`
    mutation UpdateCGInvite(
      $cg_id: String!
      $user_id: String!
      $created_by: String!
    ) {
      updateconnect_group_inviteCollection(
        filter: {
          cg_id: { eq: $cg_id }
          user_id: { eq: $user_id }
          created_by: { eq: $created_by }
        }
        set: { status: "pending", updated_at: "now()" }
      ) {
        affectedCount
        records {
          status
          user {
            name
            id
          }
          connect_group {
            name
            id
          }
        }
      }
    }
  `;

  try {
    const updateResult = (await executeMutation(
      updateMutation,
      data,
      getAuthHeaders(),
    )) as {
      updateconnect_group_inviteCollection: {
        affectedCount: number;
        records: Array<{
          status: string;
          user: { name?: string; id: string };
          connect_group: { name: string; id: string };
        }>;
      };
    };

    // If update was successful (affected count > 0), return the result
    if (updateResult.updateconnect_group_inviteCollection.affectedCount > 0) {
      return {
        insertIntoconnect_group_inviteCollection: {
          records: updateResult.updateconnect_group_inviteCollection.records,
        },
      };
    }
  } catch {
    console.log("No existing invite to update, will create new one");
  }

  // If no existing invite was found, create a new one
  const insertMutation = gql`
    mutation CreateCGInvite(
      $cg_id: String!
      $user_id: String!
      $created_by: String!
    ) {
      insertIntoconnect_group_inviteCollection(
        objects: { cg_id: $cg_id, user_id: $user_id, created_by: $created_by }
      ) {
        records {
          status
          user {
            name
            id
          }
          connect_group {
            name
            id
          }
        }
      }
    }
  `;

  return executeMutation(
    insertMutation,
    data,
    getAuthHeaders(),
  ) as Promise<CreateCGInviteResponse>;
};

export const cancelCGInvite = async (data: {
  user_id: string;
}): Promise<{
  updateconnect_group_inviteCollection: { affectedCount: number };
}> => {
  const mutation = gql`
    mutation CancelCGInvite($user_id: String!) {
      updateconnect_group_inviteCollection(
        filter: { user_id: { eq: $user_id } }
        set: { status: "cancelled" }
      ) {
        affectedCount
        records {
          user_id
          status
        }
      }
    }
  `;

  return executeMutation(mutation, data, getAuthHeaders()) as Promise<{
    updateconnect_group_inviteCollection: { affectedCount: number };
  }>;
};

export const declineCGInvite = async (data: {
  user_id: string;
}): Promise<{
  updateconnect_group_inviteCollection: { affectedCount: number };
}> => {
  const mutation = gql`
    mutation CancelCGInvite($user_id: String!) {
      updateconnect_group_inviteCollection(
        filter: { user_id: { eq: $user_id } }
        set: { status: "declined" }
      ) {
        affectedCount
        records {
          user_id
          status
        }
      }
    }
  `;

  return executeMutation(mutation, data, getAuthHeaders()) as Promise<{
    updateconnect_group_inviteCollection: { affectedCount: number };
  }>;
};

export const acceptCGInvite = async (data: {
  user_id: string;
}): Promise<{
  updateconnect_group_inviteCollection: { affectedCount: number };
}> => {
  const mutation = gql`
    mutation AcceptCGInvite($user_id: String!) {
      updateconnect_group_inviteCollection(
        filter: { user_id: { eq: $user_id } }
        set: { status: "accepted" }
      ) {
        affectedCount
        records {
          user_id
          status
        }
      }
    }
  `;

  return executeMutation(mutation, data, getAuthHeaders()) as Promise<{
    updateconnect_group_inviteCollection: { affectedCount: number };
  }>;
};

export const updateUserConnectGroup = async (data: {
  user_id: string;
  connect_group_id: string;
}): Promise<{
  updateuser_connect_groupCollection: {
    affectedCount: number;
    records: Array<{
      connect_group_id: string;
      connect_group: { name: string };
    }>;
  };
}> => {
  const mutation = gql`
    mutation UpdateUserConnectGroup(
      $user_id: String!
      $connect_group_id: String!
    ) {
      updateuser_connect_groupCollection(
        filter: { user_id: { eq: $user_id } }
        set: { connect_group_id: $connect_group_id }
      ) {
        affectedCount
        records {
          connect_group_id
          connect_group {
            name
          }
        }
      }
    }
  `;

  return executeMutation(mutation, data, getAuthHeaders()) as Promise<{
    updateuser_connect_groupCollection: {
      affectedCount: number;
      records: Array<{
        connect_group_id: string;
        connect_group: { name: string };
      }>;
    };
  }>;
};

export const getPendingCGInvites = async (
  cgId: string,
): Promise<GetPendingCGInvitesResponse> => {
  const query = gql`
    query GetPendingCGInvites($cgId: String!) {
      connect_group_inviteCollection(
        filter: { cg_id: { eq: $cgId }, status: { eq: "pending" } }
      ) {
        edges {
          node {
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
            user {
              id
              name
              avatar_url
              deleted
            }
          }
        }
      }
    }
  `;

  return executeQuery(
    query,
    { cgId },
    getAuthHeaders(),
  ) as Promise<GetPendingCGInvitesResponse>;
};

// Shadow User operations
export const createShadowUser = async (data: {
  name?: string;
  cg?: string;
  remarks?: string;
}): Promise<CreateShadowUserResponse> => {
  const mutation = gql`
    mutation CreateShadowUser(
      $name: String
      $dob: Datetime
      $cg: String
      $metadata: JSON
      $role: String
      $gender: String
    ) {
      create_shadow_user(
        name: $name
        connect_group_id: $cg
        metadata: $metadata
        user_role: $role
        gender: $gender
        date_of_birth: $dob
      ) {
        id
      }
    }
  `;

  return executeMutation(
    mutation,
    data,
    getAuthHeaders(),
  ) as Promise<CreateShadowUserResponse>;
};

export const bindShadowUser = async (data: {
  shadowUserId: string;
  targetUserId: string;
}): Promise<BindShadowUserResponse> => {
  const mutation = gql`
    mutation BindShadowUser($shadowUserId: String, $targetUserId: String) {
      merge_shadow_user(
        shadow_user_id: $shadowUserId
        target_user_id: $targetUserId
      ) {
        id
      }
    }
  `;

  return executeMutation(
    mutation,
    data,
    getAuthHeaders(),
  ) as Promise<BindShadowUserResponse>;
};

export const fetchSatellite = async (
  id: string,
): Promise<FetchSatelliteResponse> => {
  const query = gql`
    query FetchSatellite($id: String) {
      satelliteCollection(filter: { id: { eq: $id } }) {
        edges {
          node {
            id
            name
          }
        }
      }
    }
  `;

  return executeQuery(
    query,
    { id },
    getAuthHeaders(),
  ) as Promise<FetchSatelliteResponse>;
};

// Connect Group operations
export const getAllCGWithParams = async (
  key: string,
): Promise<GetAllCGResponse> => {
  const query = gql`
    query GetAllCGs($key: String) {
      connect_groupCollection(filter: { name: { ilike: $key } }) {
        edges {
          node {
            name
            id
            satellite {
              id
              name
            }
          }
        }
      }
    }
  `;

  return executeQuery(
    query,
    { key },
    getAuthHeaders(),
  ) as Promise<GetAllCGResponse>;
};

export const getCGLeader = async (
  connectGroupId: string,
): Promise<GetCGLeaderResponse> => {
  const query = gql`
    query GetCGLeader($connectGroupId: String!) {
      user_connect_groupCollection(
        filter: { connect_group_id: { eq: $connectGroupId } }
      ) {
        edges {
          node {
            user {
              id
              name
              avatar_url
            }
            pastoral_role {
              weight
            }
          }
        }
      }
    }
  `;

  return executeQuery(
    query,
    { connectGroupId },
    getAuthHeaders(),
  ) as Promise<GetCGLeaderResponse>;
};

export const fetchCGDetails = async (
  id: string,
): Promise<FetchCGDetailsResponse> => {
  const query = gql`
    query FetchCGDetails($id: String) {
      connect_groupCollection(filter: { id: { eq: $id } }) {
        edges {
          node {
            id
            satellite_id
            description
            image_url
            name
          }
        }
      }
    }
  `;

  return executeQuery(
    query,
    { id },
    getAuthHeaders(),
  ) as Promise<FetchCGDetailsResponse>;
};

export const getUserCG = async (uid: string): Promise<GetUserCGResponse> => {
  const query = gql`
    query GetUserCG($uid: String) {
      user_connect_groupCollection(filter: { user_id: { eq: $uid } }) {
        edges {
          node {
            connect_group_id
            user {
              name
              id
            }
          }
        }
      }
    }
  `;

  return executeQuery(
    query,
    { uid },
    getAuthHeaders(),
  ) as Promise<GetUserCGResponse>;
};

export const getPastoralRole = async (
  id: string,
): Promise<GetPastoralRoleResponse> => {
  const query = gql`
    query GetPastoralRole($id: String) {
      user_connect_groupCollection(filter: { user_id: { eq: $id } }) {
        edges {
          node {
            pastoral_role {
              id
              name
              weight
            }
          }
        }
      }
    }
  `;

  return executeQuery(
    query,
    { id },
    getAuthHeaders(),
  ) as Promise<GetPastoralRoleResponse>;
};

export const getAllPastoralRole =
  async (): Promise<GetAllPastoralRoleResponse> => {
    const query = gql`
      query {
        pastoral_roleCollection {
          edges {
            node {
              id
              name
              weight
            }
          }
        }
      }
    `;

    return executeQuery(
      query,
      {},
      getAuthHeaders(),
    ) as Promise<GetAllPastoralRoleResponse>;
  };
export const getCGMembers = async (
  cgId: string,
): Promise<GetCGMembersResponse> => {
  const query = gql`
    query GetCGMembers($cgId: String) {
      connect_groupCollection(filter: { id: { eq: $cgId } }) {
        edges {
          node {
            user_connect_groupCollection {
              edges {
                node {
                  user_role
                  pastoral_role {
                    weight
                  }
                  user {
                    id
                    name
                    avatar_url
                    deleted
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  return executeQuery(
    query,
    { cgId },
    getAuthHeaders(),
  ) as Promise<GetCGMembersResponse>;
};

// Attendance operations
export const getLatestCGAttendance = async (
  uid: string,
): Promise<GetLatestCGAttendanceResponse> => {
  const query = gql`
    query GetLatestAttendance($uid: String) {
      latest_attendance(user_id: $uid, event_type: "Connect Group") {
        edges {
          node {
            created_at
          }
        }
      }
    }
  `;

  return executeQuery(
    query,
    { uid },
    getAuthHeaders(),
  ) as Promise<GetLatestCGAttendanceResponse>;
};

export const getAllAttendance = async (
  uid: string,
): Promise<GetAllAttendanceResponse> => {
  const query = gql`
    query GetAllAttendance($uid: String) {
      attendanceCollection(filter: { user_id: { eq: $uid } }) {
        edges {
          node {
            created_at
            session {
              id
              name
              description
              end_at
            }
            attended
            description
          }
        }
      }
    }
  `;

  return executeQuery(
    query,
    { uid },
    getAuthHeaders(),
  ) as Promise<GetAllAttendanceResponse>;
};
