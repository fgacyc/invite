/**
 * Get the authentication token from localStorage
 * @returns The token string or null if not found
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem("token");
};

/**
 * Remove the authentication token from localStorage
 */
export const clearAuthToken = (): void => {
  localStorage.removeItem("token");
};

export const getLevelfromAttendanceDate = (attendanceDate: string) => {
  if (!attendanceDate) return "none";
  const date = new Date(attendanceDate);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays > 30) return "none";
  if (diffDays > 15) return "low";
  if (diffDays > 7) return "medium";
  return "high";
};

// Maximum weight for elevated permissions (lower weight = higher authority)
// Roles with weight <= this value can edit group name, see remarks, etc.
export const MAX_ELEVATED_ROLE_WEIGHT = 4;

/**
 * Check if a role has elevated permissions based on weight
 * Lower weights indicate higher authority (e.g., Pastor = 1, Team Leader = 2)
 * @param roleWeight - The weight of the pastoral role
 * @returns true if the role has elevated permissions
 */
export const hasElevatedPermissions = (roleWeight?: number): boolean => {
  if (roleWeight === undefined || roleWeight === null) return false;
  return roleWeight <= MAX_ELEVATED_ROLE_WEIGHT;
};
