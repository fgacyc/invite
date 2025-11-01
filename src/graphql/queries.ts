import { GraphQLClient } from "graphql-request";

const client = new GraphQLClient(import.meta.env.VITE_GRAPHQL_URL as string);

// Export the client for direct usage if needed
export { client };

// Base GraphQL operations
export const executeQuery = async (
  query: string,
  variables?: Record<string, unknown>,
  headers?: Record<string, string>,
) => {
  try {
    const result = await client.request(query, variables, headers);
    return result;
  } catch (error) {
    throw error;
  }
};

export const executeMutation = async (
  mutation: string,
  variables?: Record<string, unknown>,
  headers?: Record<string, string>,
) => {
  try {
    const result = await client.request(mutation, variables, headers);
    return result;
  } catch (error) {
    throw error;
  }
};
