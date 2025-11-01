# GraphQL Structure

This directory contains the GraphQL setup for the application, following the modern TanStack Query pattern.

## Structure

```
src/graphql/
├── queries.ts              # GraphQL client setup and base operations
├── server.ts               # Server-side GraphQL operations
├── declaration.ts          # DEPRECATED - Legacy GraphQL queries
├── queries/
│   ├── index.ts            # Export all query modules
│   ├── user.ts             # User-related queries and mutations
│   ├── connect-group.ts    # Connect Group queries
│   ├── attendance.ts       # Attendance queries
│   └── shadow-user.ts      # Shadow User mutations
└── index.ts                # Main exports
```

## Available Operations

### User Operations

- `useUserProfile()` - Get current user profile
- `useSinglePerson(email)` - Get single person by email
- `useAllPersons()` - Get all persons
- `useUpdateUserProfile()` - Update user profile
- `useCreateUser()` - Create new user
- `useDeleteUser()` - Delete user
- `useUpdateSinglePerson()` - Update single person

### Connect Group Operations

- `useCGDetails()` - Get connect group details
- `useUserCG(uid)` - Get user's connect group
- `useCGMembers(uid)` - Get connect group members

### Attendance Operations

- `useLatestCGAttendance(uid)` - Get latest CG attendance

### Shadow User Operations

- `useCreateShadowUser()` - Create shadow user

## Usage Examples

### User Operations

```tsx
import {
  useUserProfile,
  useUpdateUserProfile,
  useSinglePerson,
  useAllPersons,
} from "@/graphql/queries/user";

function UserProfile() {
  const { data: user } = useUserProfile();
  const { data: allUsers } = useAllPersons();
  const { data: specificUser } = useSinglePerson("user@example.com");
  const updateUser = useUpdateUserProfile();

  const handleUpdate = () => {
    updateUser.mutate({
      name: "New Name",
      email: "new@email.com",
    });
  };

  return (
    <div>
      <h1>{user.name}</h1>
      <p>Total users: {allUsers.length}</p>
      <button onClick={handleUpdate}>Update Profile</button>
    </div>
  );
}
```

### Connect Group Operations

```tsx
import {
  useCGDetails,
  useUserCG,
  useCGMembers,
} from "@/graphql/queries/connect-group";

function ConnectGroup({ userId }: { userId: string }) {
  const { data: cgDetails } = useCGDetails();
  const { data: userCG } = useUserCG(userId);
  const { data: cgMembers } = useCGMembers(userId);

  return (
    <div>
      <h2>Connect Group</h2>
      <p>Members: {cgMembers.length}</p>
    </div>
  );
}
```

### Attendance Operations

```tsx
import { useLatestCGAttendance } from "@/graphql/queries/attendance";

function AttendanceInfo({ userId }: { userId: string }) {
  const { data: attendance } = useLatestCGAttendance(userId);

  return (
    <div>
      <p>Last attended: {attendance.created_at}</p>
    </div>
  );
}
```

### Shadow User Operations

```tsx
import { useCreateShadowUser } from "@/graphql/queries/shadow-user";

function CreateShadowUser() {
  const createShadowUser = useCreateShadowUser();

  const handleCreate = () => {
    createShadowUser.mutate({
      name: "Shadow User",
      cg: "CG001",
    });
  };

  return <button onClick={handleCreate}>Create Shadow User</button>;
}
```

## Migration from Legacy Approach

### Before (Legacy)

```tsx
import { useGraphQL } from "@/hooks/useGraphQL";
import { fetchSinglePerson, updateSinglePerson } from "@/graphql/declaration";

function Component() {
  const { query, mutate } = useGraphQL();

  const fetchUser = async () => {
    const result = await query(fetchSinglePerson, {
      email: "user@example.com",
    });
    return result;
  };

  const updateUser = async () => {
    await mutate(updateSinglePerson, {
      email: "user@example.com",
      name: "New Name",
    });
  };
}
```

### After (Modern)

```tsx
import { useSinglePerson, useUpdateSinglePerson } from "@/graphql/queries/user";

function Component() {
  const { data: user } = useSinglePerson("user@example.com");
  const updateUser = useUpdateSinglePerson();

  const handleUpdate = () => {
    updateUser.mutate({ email: "user@example.com", name: "New Name" });
  };
}
```

## Adding New Operations

1. **Add server functions** in `server.ts`:

```ts
export const getNewEntity = async () => {
  const query = gql`
    query GetNewEntity {
      entity {
        id
        name
      }
    }
  `;

  return executeQuery(query, {}, getAuthHeaders());
};
```

2. **Create query module** in `queries/entity.ts`:

```ts
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { getNewEntity } from "../server";

export const entityQueries = {
  default: [{ scope: "entity" }] as const,
  entity: () =>
    queryOptions({
      queryKey: [{ ...entityQueries.default[0], type: "entity" }] as const,
      queryFn: getNewEntity,
    }),
};

export const useEntity = () => useSuspenseQuery(entityQueries.entity());
```

3. **Export from index**:

```ts
// In queries/index.ts
export * from "./entity";
```

## Environment Variables

Make sure to set your GraphQL endpoint:

```env
VITE_GRAPHQL_URL=https://your-graphql-endpoint.com/graphql
```

## ⚠️ Deprecation Notice

The legacy approach using `useGraphQL()` hook and raw GraphQL strings from `declaration.ts` is deprecated. All operations have been migrated to the modern TanStack Query approach for better type safety, caching, and developer experience.
