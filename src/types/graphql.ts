// GraphQL Schema Types - Generated from introspection

// Enums
export type Gender = "male" | "female";
export type FilterIs = "NULL" | "NOT_NULL";
export type OrderByDirection = "ASC" | "DESC";

// Scalar types
export type BigFloat = number;
export type BigInt = number;
export type Cursor = string;
export type Date = string;
export type Datetime = string;
export type JSON = unknown;
export type Opaque = unknown;
export type Time = string;
export type UUID = string;

// Core GraphQL User type (from database)
export interface GraphQLUser {
  nodeId: string;
  id: string;
  no: number;
  email?: string | null;
  email_verified: boolean;
  name?: string | null;
  username?: string | null;
  given_name?: string | null;
  family_name?: string | null;
  gender?: Gender | null;
  ic_number?: string | null;
  phone_number?: string | null;
  phone_number_verified?: boolean | null;
  nickname?: string | null;
  avatar_url?: string | null;
  address?: Opaque;
  date_of_birth?: Datetime | null;
  created_at: Datetime;
  updated_at: Datetime;
  deleted: boolean;
  metadata?: JSON;
  user_connect_groupCollection?: UserConnectGroupConnection;
  user_ministryCollection?: UserMinistryConnection;
  user_relationshipCollection?: UserRelationshipConnection;
  connect_group_inviteCollection?: {
    edges: Array<{
      node: {
        cg_id: string;
        status: string;
        created_at: string;
        connect_group: {
          id: string;
          name: string;
          satellite: {
            id: string;
            name: string;
          };
        };
      };
    }>;
  };
}

// Attendance
export interface Attendance {
  nodeId: string;
  session_id: string;
  user_id: string;
  created_at: Datetime;
  updated_at: Datetime;
  attended: boolean;
  description?: string | null;
  session: Session;
}

// Connect Group
export interface ConnectGroup {
  nodeId: string;
  id: string;
  no: number;
  name?: string | null;
  variant?: string | null;
  satellite_id: string;
  created_at: Datetime;
  updated_at: Datetime;
  category_id: string;
  active: boolean;
  closed_at?: Datetime | null;
  image_url?: string | null;
  satellite: Satellite;
  connect_group_category: ConnectGroupCategory;
  user_connect_groupCollection?: UserConnectGroupConnection;
  event_connect_groupCollection?: EventConnectGroupConnection;
}

// Connect Group Category
export interface ConnectGroupCategory {
  nodeId: string;
  id: string;
  name: string;
  connect_groupCollection?: ConnectGroupConnection;
}

// Currency
export interface Currency {
  nodeId: string;
  code: string;
  num: number;
  denominator: number;
  name: string;
  countries: string[];
  priceCollection?: PriceConnection;
}

// Event
export interface Event {
  nodeId: string;
  id: string;
  name: string;
  description: string;
  type: string;
  created_at: Datetime;
  updated_at: Datetime;
  event_type: EventType;
  registrationCollection?: RegistrationConnection;
  priceCollection?: PriceConnection;
  sessionCollection?: SessionConnection;
  event_connect_groupCollection?: EventConnectGroupConnection;
}

// Event Connect Group
export interface EventConnectGroup {
  nodeId: string;
  event_id: string;
  connect_group_id: string;
  event: Event;
  connect_group: ConnectGroup;
}

// Event Type
export interface EventType {
  nodeId: string;
  name: string;
  created_at: Datetime;
  updated_at: Datetime;
  eventCollection?: EventConnection;
}

// Form Field Type
export interface FormFieldType {
  nodeId: string;
  type: string;
  description: string;
  created_at: Datetime;
  updated_at: Datetime;
  registration_form_fieldCollection?: RegistrationFormFieldConnection;
}

// Ministry
export interface Ministry {
  nodeId: string;
  id: string;
  name: string;
  description: string;
  department_id: string;
  team_id: string;
  satellite_id: string;
  created_at: Datetime;
  updated_at: Datetime;
  ministry_department: MinistryDepartment;
  ministry_team: MinistryTeam;
  satellite: Satellite;
  user_ministryCollection?: UserMinistryConnection;
}

// Ministry Department
export interface MinistryDepartment {
  nodeId: string;
  id: string;
  name: string;
  description: string;
  created_at: Datetime;
  updated_at: Datetime;
  ministryCollection?: MinistryConnection;
}

// Ministry Role
export interface MinistryRole {
  nodeId: string;
  id: string;
  name: string;
  description: string;
  weight: number;
  user_ministryCollection?: UserMinistryConnection;
}

// Ministry Team
export interface MinistryTeam {
  nodeId: string;
  id: string;
  name: string;
  description: string;
  created_at: Datetime;
  updated_at: Datetime;
  ministryCollection?: MinistryConnection;
}

// Pastoral Role
export interface PastoralRole {
  nodeId: string;
  id: string;
  name: string;
  description: string;
  weight: number;
  user_connect_groupCollection?: UserConnectGroupConnection;
}

// Price
export interface Price {
  nodeId: string;
  id: string;
  event_id: string;
  name: string;
  fee: BigFloat;
  currency_code: string;
  created_at: Datetime;
  updated_at: Datetime;
  event: Event;
  currency: Currency;
}

// Registration
export interface Registration {
  nodeId: string;
  id: string;
  event_id: string;
  name: string;
  close_at: Datetime;
  created_at: Datetime;
  updated_at: Datetime;
  event: Event;
  registration_form_fieldCollection?: RegistrationFormFieldConnection;
}

// Registration Form Field
export interface RegistrationFormField {
  nodeId: string;
  registration_id: string;
  name: string;
  label: string;
  description?: string | null;
  type: string;
  weight: number;
  created_at: Datetime;
  updated_at: Datetime;
  registration: Registration;
  form_field_type: FormFieldType;
  registration_form_field_dataCollection?: RegistrationFormFieldDataConnection;
}

// Registration Form Field Data
export interface RegistrationFormFieldData {
  nodeId: string;
  registration_id: string;
  name: string;
  user_id: string;
  data: JSON;
  created_at: Datetime;
  updated_at: Datetime;
  registration_form_field: RegistrationFormField;
}

// Satellite
export interface Satellite {
  nodeId: string;
  id: string;
  no: number;
  name: string;
  address: string;
  created_at: Datetime;
  updated_at: Datetime;
  connect_groupCollection?: ConnectGroupConnection;
  ministryCollection?: MinistryConnection;
}

// Session
export interface Session {
  nodeId: string;
  id: string;
  event_id: string;
  name: string;
  description?: string | null;
  expected_attendees: number;
  start_at: Datetime;
  end_at: Datetime;
  actual_start_at?: Datetime | null;
  actual_end_at?: Datetime | null;
  created_at: Datetime;
  updated_at: Datetime;
  event: Event;
  attendanceCollection?: AttendanceConnection;
}

// User Connect Group
export interface UserConnectGroup {
  nodeId: string;
  user_id: string;
  connect_group_id: string;
  user_role: string;
  user: GraphQLUser;
  connect_group: ConnectGroup;
  pastoral_role: PastoralRole;
}

// User Ministry
export interface UserMinistry {
  nodeId: string;
  user_id: string;
  ministry_id: string;
  user_role: string;
  user: GraphQLUser;
  ministry: Ministry;
  ministry_role: MinistryRole;
}

// User Relationship
export interface UserRelationship {
  nodeId: string;
  source_user_id: string;
  destination_user_id: string;
  relationship: string;
  created_at: Datetime;
  updated_at: Datetime;
  source_user: GraphQLUser;
  destination_user: GraphQLUser;
}

// Connection types (GraphQL Relay pattern)
export interface PageInfo {
  endCursor?: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor?: string | null;
}

export interface AttendanceEdge {
  cursor: string;
  node: Attendance;
}

export interface AttendanceConnection {
  edges: AttendanceEdge[];
  pageInfo: PageInfo;
}

export interface ConnectGroupEdge {
  cursor: string;
  node: ConnectGroup;
}

export interface ConnectGroupConnection {
  edges: ConnectGroupEdge[];
  pageInfo: PageInfo;
}

export interface ConnectGroupCategoryEdge {
  cursor: string;
  node: ConnectGroupCategory;
}

export interface ConnectGroupCategoryConnection {
  edges: ConnectGroupCategoryEdge[];
  pageInfo: PageInfo;
}

export interface CurrencyEdge {
  cursor: string;
  node: Currency;
}

export interface CurrencyConnection {
  edges: CurrencyEdge[];
  pageInfo: PageInfo;
}

export interface EventEdge {
  cursor: string;
  node: Event;
}

export interface EventConnection {
  edges: EventEdge[];
  pageInfo: PageInfo;
}

export interface EventConnectGroupEdge {
  cursor: string;
  node: EventConnectGroup;
}

export interface EventConnectGroupConnection {
  edges: EventConnectGroupEdge[];
  pageInfo: PageInfo;
}

export interface EventTypeEdge {
  cursor: string;
  node: EventType;
}

export interface EventTypeConnection {
  edges: EventTypeEdge[];
  pageInfo: PageInfo;
}

export interface FormFieldTypeEdge {
  cursor: string;
  node: FormFieldType;
}

export interface FormFieldTypeConnection {
  edges: FormFieldTypeEdge[];
  pageInfo: PageInfo;
}

export interface MinistryEdge {
  cursor: string;
  node: Ministry;
}

export interface MinistryConnection {
  edges: MinistryEdge[];
  pageInfo: PageInfo;
}

export interface MinistryDepartmentEdge {
  cursor: string;
  node: MinistryDepartment;
}

export interface MinistryDepartmentConnection {
  edges: MinistryDepartmentEdge[];
  pageInfo: PageInfo;
}

export interface MinistryRoleEdge {
  cursor: string;
  node: MinistryRole;
}

export interface MinistryRoleConnection {
  edges: MinistryRoleEdge[];
  pageInfo: PageInfo;
}

export interface MinistryTeamEdge {
  cursor: string;
  node: MinistryTeam;
}

export interface MinistryTeamConnection {
  edges: MinistryTeamEdge[];
  pageInfo: PageInfo;
}

export interface PastoralRoleEdge {
  cursor: string;
  node: PastoralRole;
}

export interface PastoralRoleConnection {
  edges: PastoralRoleEdge[];
  pageInfo: PageInfo;
}

export interface PriceEdge {
  cursor: string;
  node: Price;
}

export interface PriceConnection {
  edges: PriceEdge[];
  pageInfo: PageInfo;
}

export interface RegistrationEdge {
  cursor: string;
  node: Registration;
}

export interface RegistrationConnection {
  edges: RegistrationEdge[];
  pageInfo: PageInfo;
}

export interface RegistrationFormFieldEdge {
  cursor: string;
  node: RegistrationFormField;
}

export interface RegistrationFormFieldConnection {
  edges: RegistrationFormFieldEdge[];
  pageInfo: PageInfo;
}

export interface RegistrationFormFieldDataEdge {
  cursor: string;
  node: RegistrationFormFieldData;
}

export interface RegistrationFormFieldDataConnection {
  edges: RegistrationFormFieldDataEdge[];
  pageInfo: PageInfo;
}

export interface SatelliteEdge {
  cursor: string;
  node: Satellite;
}

export interface SatelliteConnection {
  edges: SatelliteEdge[];
  pageInfo: PageInfo;
}

export interface SessionEdge {
  cursor: string;
  node: Session;
}

export interface SessionConnection {
  edges: SessionEdge[];
  pageInfo: PageInfo;
}

export interface UserEdge {
  cursor: string;
  node: GraphQLUser;
}

export interface UserConnection {
  edges: UserEdge[];
  pageInfo: PageInfo;
}

export interface UserConnectGroupEdge {
  cursor: string;
  node: UserConnectGroup;
}

export interface UserConnectGroupConnection {
  edges: UserConnectGroupEdge[];
  pageInfo: PageInfo;
}

export interface UserMinistryEdge {
  cursor: string;
  node: UserMinistry;
}

export interface UserMinistryConnection {
  edges: UserMinistryEdge[];
  pageInfo: PageInfo;
}

export interface UserRelationshipEdge {
  cursor: string;
  node: UserRelationship;
}

export interface UserRelationshipConnection {
  edges: UserRelationshipEdge[];
  pageInfo: PageInfo;
}

// Query response types
export interface UserCollectionResponse {
  userCollection: UserConnection;
}

export interface AttendanceCollectionResponse {
  attendanceCollection: AttendanceConnection;
}

export interface ConnectGroupCollectionResponse {
  connect_groupCollection: ConnectGroupConnection;
}

export interface ConnectGroupCategoryCollectionResponse {
  connect_group_categoryCollection: ConnectGroupCategoryConnection;
}

export interface CurrencyCollectionResponse {
  currencyCollection: CurrencyConnection;
}

export interface EventCollectionResponse {
  eventCollection: EventConnection;
}

export interface EventConnectGroupCollectionResponse {
  event_connect_groupCollection: EventConnectGroupConnection;
}

export interface EventTypeCollectionResponse {
  event_typeCollection: EventTypeConnection;
}

export interface FormFieldTypeCollectionResponse {
  form_field_typeCollection: FormFieldTypeConnection;
}

export interface MinistryCollectionResponse {
  ministryCollection: MinistryConnection;
}

export interface MinistryDepartmentCollectionResponse {
  ministry_departmentCollection: MinistryDepartmentConnection;
}

export interface MinistryRoleCollectionResponse {
  ministry_roleCollection: MinistryRoleConnection;
}

export interface MinistryTeamCollectionResponse {
  ministry_teamCollection: MinistryTeamConnection;
}

export interface PastoralRoleCollectionResponse {
  pastoral_roleCollection: PastoralRoleConnection;
}

export interface PriceCollectionResponse {
  priceCollection: PriceConnection;
}

export interface RegistrationCollectionResponse {
  registrationCollection: RegistrationConnection;
}

export interface RegistrationFormFieldCollectionResponse {
  registration_form_fieldCollection: RegistrationFormFieldConnection;
}

export interface RegistrationFormFieldDataCollectionResponse {
  registration_form_field_dataCollection: RegistrationFormFieldDataConnection;
}

export interface SatelliteCollectionResponse {
  satelliteCollection: SatelliteConnection;
}

export interface SessionCollectionResponse {
  sessionCollection: SessionConnection;
}

export interface UserConnectGroupCollectionResponse {
  user_connect_groupCollection: UserConnectGroupConnection;
}

export interface UserMinistryCollectionResponse {
  user_ministryCollection: UserMinistryConnection;
}

export interface UserRelationshipCollectionResponse {
  user_relationshipCollection: UserRelationshipConnection;
}

// Special query responses
export interface LatestAttendanceResponse {
  latest_attendance?: Attendance | null;
}

// Mutation response types
export interface AttendanceInsertResponse {
  affectedCount: number;
  records: Attendance[];
}

export interface AttendanceUpdateResponse {
  affectedCount: number;
  records: Attendance[];
}

export interface AttendanceDeleteResponse {
  affectedCount: number;
  records: Attendance[];
}

export interface ConnectGroupInsertResponse {
  affectedCount: number;
  records: ConnectGroup[];
}

export interface ConnectGroupUpdateResponse {
  affectedCount: number;
  records: ConnectGroup[];
}

export interface ConnectGroupDeleteResponse {
  affectedCount: number;
  records: ConnectGroup[];
}

export interface UserInsertResponse {
  affectedCount: number;
  records: GraphQLUser[];
}

export interface UserUpdateResponse {
  affectedCount: number;
  records: GraphQLUser[];
}

export interface UserDeleteResponse {
  affectedCount: number;
  records: GraphQLUser[];
}

// Add more mutation response types as needed...

// Filter types (commonly used)
export interface StringFilter {
  eq?: string;
  neq?: string;
  gt?: string;
  gte?: string;
  lt?: string;
  lte?: string;
  in?: string[];
  is?: FilterIs;
}

export interface IntFilter {
  eq?: number;
  neq?: number;
  gt?: number;
  gte?: number;
  lt?: number;
  lte?: number;
  in?: number[];
  is?: FilterIs;
}

export interface BooleanFilter {
  eq?: boolean;
  is?: FilterIs;
}

export interface DatetimeFilter {
  eq?: Datetime;
  neq?: Datetime;
  gt?: Datetime;
  gte?: Datetime;
  lt?: Datetime;
  lte?: Datetime;
  in?: Datetime[];
  is?: FilterIs;
}

export interface UUIDFilter {
  eq?: UUID;
  neq?: UUID;
  in?: UUID[];
  is?: FilterIs;
}

// User filter type
export interface UserFilter {
  id?: StringFilter;
  no?: IntFilter;
  email?: StringFilter;
  email_verified?: BooleanFilter;
  name?: StringFilter;
  username?: StringFilter;
  given_name?: StringFilter;
  family_name?: StringFilter;
  gender?: StringFilter; // Could be more specific with Gender enum
  ic_number?: StringFilter;
  phone_number?: StringFilter;
  phone_number_verified?: BooleanFilter;
  nickname?: StringFilter;
  created_at?: DatetimeFilter;
  updated_at?: DatetimeFilter;
  deleted?: BooleanFilter;
  and?: UserFilter[];
  or?: UserFilter[];
  not?: UserFilter;
}

// Connect Group filter type
export interface ConnectGroupFilter {
  id?: StringFilter;
  no?: IntFilter;
  name?: StringFilter;
  variant?: StringFilter;
  satellite_id?: StringFilter;
  category_id?: StringFilter;
  active?: BooleanFilter;
  closed_at?: DatetimeFilter;
  created_at?: DatetimeFilter;
  updated_at?: DatetimeFilter;
  and?: ConnectGroupFilter[];
  or?: ConnectGroupFilter[];
  not?: ConnectGroupFilter;
}

// Order by types
export interface UserOrderBy {
  id?: OrderByDirection;
  no?: OrderByDirection;
  name?: OrderByDirection;
  created_at?: OrderByDirection;
  updated_at?: OrderByDirection;
}

export interface ConnectGroupOrderBy {
  id?: OrderByDirection;
  no?: OrderByDirection;
  name?: OrderByDirection;
  created_at?: OrderByDirection;
  updated_at?: OrderByDirection;
}

// Insert input types
export interface UserInsertInput {
  id?: string;
  no?: number;
  email?: string;
  email_verified?: boolean;
  name?: string;
  username?: string;
  given_name?: string;
  family_name?: string;
  gender?: Gender;
  ic_number?: string;
  phone_number?: string;
  phone_number_verified?: boolean;
  nickname?: string;
  avatar_url?: string;
  address?: Opaque;
  date_of_birth?: Datetime;
  deleted?: boolean;
  metadata?: JSON;
}

export interface ConnectGroupInsertInput {
  id?: string;
  no?: number;
  name?: string;
  variant?: string;
  satellite_id: string;
  category_id: string;
  active?: boolean;
  closed_at?: Datetime;
  image_url?: string;
}

// Update input types
export interface UserUpdateInput {
  id?: string;
  no?: number;
  email?: string;
  email_verified?: boolean;
  name?: string;
  username?: string;
  given_name?: string;
  family_name?: string;
  gender?: Gender;
  ic_number?: string;
  phone_number?: string;
  phone_number_verified?: boolean;
  nickname?: string;
  avatar_url?: string;
  address?: Opaque;
  date_of_birth?: Datetime;
  deleted?: boolean;
  metadata?: JSON;
}

export interface ConnectGroupUpdateInput {
  id?: string;
  no?: number;
  name?: string;
  variant?: string;
  satellite_id?: string;
  category_id?: string;
  active?: boolean;
  closed_at?: Datetime;
  image_url?: string;
}

// Auth0 JWT Token type (from authentication)
export interface Auth0JWTToken {
  email: string;
  email_verified: boolean;
  given_name: string;
  name: string;
  nickname: string;
  picture: string;
  sub: string;
  updated_at: string;
}

// Type that maps Auth0 JWT fields to GraphQL User compatible fields
export type Auth0ToGraphQLUserMapping = Omit<
  Auth0JWTToken,
  "sub" | "picture"
> & {
  id: string; // mapped from 'sub'
  avatar_url: string; // mapped from 'picture'
  cg: string; // mapped from 'cg'
};

// Specific return types for GraphQL operations

// User Profile Operations
export interface GetUserProfileResponse {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    avatar_url?: string | null;
    created_at: Datetime;
    updated_at: Datetime;
  };
}

export interface UpdateUserProfileResponse {
  update_user: {
    id: string;
    name?: string | null;
    email?: string | null;
    avatar_url?: string | null;
    updated_at: Datetime;
  };
}

export interface CreateUserResponse {
  create_user: {
    id: string;
    name?: string | null;
    email?: string | null;
    created_at: Datetime;
  };
}

export interface DeleteUserResponse {
  delete_user: {
    success: boolean;
  };
}

// Single Person Operations
export interface FetchSinglePersonResponse {
  userCollection: {
    edges: Array<{
      node: {
        id: string;
        name?: string | null;
        email?: string | null;
      };
    }>;
  };
}

export interface FetchAllPersonsResponse {
  userCollection: {
    edges: Array<{
      node: {
        id: string;
        name?: string | null;
        email?: string | null;
      };
    }>;
  };
}

export interface UpdateSinglePersonResponse {
  updateuserCollection: {
    records: Array<{
      name?: string | null;
      address?: Opaque;
      email?: string | null;
    }>;
  };
}

// Shadow User Operations
export interface CreateShadowUserResponse {
  create_shadow_user: {
    id: string;
  };
}

export interface BindShadowUserResponse {
  bind_shadow_user: {
    id: string;
  };
}

// Satellite Operations
export interface FetchSatelliteResponse {
  satelliteCollection: {
    edges: Array<{
      node: {
        id: string;
        name: string;
      };
    }>;
  };
}

// Connect Group Operations
export interface EditCGResponse {
  updateconnect_groupCollection: {
    records: Array<{
      name: string;
      image_url: string;
      description: string;
    }>;
  };
}

export interface RemoveMemberFromCGResponse {
  deleteFromuser_connect_groupCollection: {
    records: Array<{
      connect_group_id: string;
    }>;
  };
}

export interface GetAllCGResponse {
  connect_groupCollection: {
    edges: Array<{
      node: {
        name: string;
        id: string;
        satellite: {
          id: string;
          name: string;
        };
      };
    }>;
  };
}

export interface GetCGLeaderResponse {
  user_connect_groupCollection: {
    edges: Array<{
      node: {
        user: {
          id: string;
          name?: string | null;
          avatar_url?: string | null;
        };
        pastoral_role: {
          weight: number;
        };
      };
    }>;
  };
}

export interface CreateCGInviteResponse {
  insertIntoconnect_group_inviteCollection: {
    records: Array<{
      status: string;
      user: {
        name?: string | null;
        id: string;
      };
      connect_group: {
        name: string;
        id: string;
      };
    }>;
  };
}

export interface GetPendingCGInvitesResponse {
  connect_group_inviteCollection: {
    edges: Array<{
      node: {
        id: string;
        user_id: string;
        cg_id: string;
        status: string;
        created_at: string;
        connect_group: {
          id: string;
          name: string;
          satellite: {
            id: string;
            name: string;
          };
        };
        user: {
          id: string;
          name?: string | null;
          avatar_url?: string | null;
          deleted: boolean;
        };
      };
    }>;
  };
}

export interface FetchCGDetailsResponse {
  connect_groupCollection: {
    edges: Array<{
      node: {
        id: string;
        satellite_id: string;
        description: string;
        image_url: string;
        name: string;
      };
    }>;
  };
}

export interface GetPastoralRoleResponse {
  user_connect_groupCollection: {
    edges: Array<{
      node: {
        pastoral_role: {
          id: string;
          name: string;
          weight: number;
        };
      };
    }>;
  };
}

export interface GetAllPastoralRoleResponse {
  pastoral_roleCollection: {
    edges: Array<{
      node: {
        id: string;
        name: string;
        weight: number;
      };
    }>;
  };
}

export interface GetUserCGResponse {
  user_connect_groupCollection: {
    edges: Array<{
      node: {
        connect_group_id: string;
        user: {
          name?: string | null;
          id: string;
        };
      };
    }>;
  };
}

export interface GetCGMembersResponse {
  connect_groupCollection: {
    edges: Array<{
      node: {
        id: string;
        name: string;
        user_connect_groupCollection: {
          edges: Array<{
            node: {
              user_role: string;
              pastoral_role: {
                weight: number;
              };
              user: {
                name?: string | null;
                id: string;
                avatar_url?: string | null;
                deleted: boolean;
              };
            };
          }>;
        };
      };
    }>;
  };
}

// User Hooks Operations (from user.ts)
export interface GetSinglePersonHookResponse {
  userCollection: {
    edges: Array<{
      node: {
        id: string;
        no: number;
        name?: string | null;
        given_name?: string | null;
        family_name?: string | null;
        gender?: Gender | null;
        phone_number?: string | null;
        nickname?: string | null;
        avatar_url?: string | null;
        ic_number?: string | null;
        date_of_birth?: Datetime | null;
        email?: string | null;
        created_at?: Datetime | null;
        metadata?: string;
        connect_group_inviteCollection?: {
          edges: Array<{
            node: {
              status: string;
              created_at: string;
              connect_group: {
                id: string;
                name: string;
                satellite: {
                  id: string;
                  name: string;
                };
              };
            };
          }>;
        };
        user_connect_groupCollection: {
          edges: Array<{
            node: {
              pastoral_role: {
                id: string;
                name: string;
                weight: number;
              };
              connect_group: {
                id: string;
                name: string;
                satellite_id: string;
              };
            };
          }>;
        };
      };
    }>;
  };
}

export interface UpdateSinglePersonHookResponse {
  updateuserCollection: {
    affectedCount: number;
    records: Array<{
      id: string;
      name?: string | null;
      given_name?: string | null;
      family_name?: string | null;
      gender?: Gender | null;
      phone_number?: string | null;
      nickname?: string | null;
      ic_number?: string | null;
      date_of_birth?: Datetime | null;
    }>;
  };
}

export interface GetCGMembersHookResponse {
  user_connect_groupCollection: {
    edges: Array<{
      node: {
        user: {
          id: string;
          no: number;
          name?: string | null;
          given_name?: string | null;
          family_name?: string | null;
          phone_number?: string | null;
          nickname?: string | null;
          avatar_url?: string | null;
        };
      };
    }>;
  };
}

// Attendance Operations
export interface GetLatestCGAttendanceResponse {
  latest_attendance: {
    edges: Array<{
      node: {
        created_at: Datetime;
      };
    }>;
  };
}

export interface GetAllAttendanceResponse {
  attendanceCollection: {
    edges: Array<{
      node: {
        created_at: Datetime;
        session: {
          id: string;
          name: string;
          description: string;
          end_at: Datetime;
        };
        attended: boolean;
        description: string;
      };
    }>;
  };
}

// Specific types for component usage
export type CGMemberUser = Pick<
  GraphQLUser,
  "id" | "name" | "avatar_url" | "deleted" | "user_connect_groupCollection"
>;
