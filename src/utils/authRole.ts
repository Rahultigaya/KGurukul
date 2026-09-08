// src/utils/authRole.ts

export type RoleType = 0 | 1 | 2 | 3;
// 0: Admin
// 1: Parent
// 2: Student
// 3: Teacher

export const normalizeRole = (roleVal: any): RoleType => {
  if (roleVal === undefined || roleVal === null || roleVal === "") return 0; // Default: Admin

  if (roleVal === 0 || roleVal === "0") return 0;
  if (roleVal === 1 || roleVal === "1") return 1;
  if (roleVal === 2 || roleVal === "2") return 2;
  if (roleVal === 3 || roleVal === "3") return 3;

  const str = String(roleVal).trim().toLowerCase();
  if (str === "admin" || str === "administrator") return 0;
  if (str === "parent") return 1;
  if (str === "student") return 2;
  if (str === "teacher" || str === "faculty") return 3;

  return 0;
};

export const getRoleName = (role: any): string => {
  const norm = normalizeRole(role);
  switch (norm) {
    case 0:
      return "Admin";
    case 1:
      return "Parent";
    case 2:
      return "Student";
    case 3:
      return "Teacher";
    default:
      return "Admin";
  }
};

export const getCurrentUserRole = (): RoleType => {
  try {
    const stored = localStorage.getItem("userData");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        // Case where row is stored as array [id, name, email, phone, role, ...]
        if (parsed.length > 4 && parsed[4] !== undefined) {
          return normalizeRole(parsed[4]);
        }
      } else if (typeof parsed === "object" && parsed !== null) {
        const r =
          parsed.role_id ??
          parsed.role ??
          parsed.user_role ??
          parsed.roleId ??
          parsed.userRole ??
          parsed.role_type ??
          parsed.role_name ??
          parsed.type ??
          parsed.user?.role ??
          parsed.user?.role_id;
        if (r !== undefined && r !== null) {
          return normalizeRole(r);
        }
      }
    }

    // Check direct role keys in localStorage
    const directRole =
      localStorage.getItem("userRole") ||
      localStorage.getItem("role") ||
      localStorage.getItem("role_id");
    if (directRole !== null && directRole !== undefined) {
      return normalizeRole(directRole);
    }

    // Try decoding JWT token if role is present in payload
    const token =
      localStorage.getItem("access_token") || localStorage.getItem("authToken");
    if (token && token.includes(".")) {
      try {
        const parts = token.split(".");
        if (parts.length >= 2) {
          const payload = JSON.parse(atob(parts[1]));
          const jwtRole =
            payload.role_id ??
            payload.role ??
            payload.user_role ??
            payload.roleId ??
            payload.userRole;
          if (jwtRole !== undefined && jwtRole !== null) {
            return normalizeRole(jwtRole);
          }
        }
      } catch (jwtErr) {
        // Ignore JWT base64 decode error
      }
    }
  } catch (e) {
    console.error("Error reading current user role:", e);
  }
  return 0; // Default
};

export const getDefaultRouteForRole = (role: RoleType): string => {
  switch (role) {
    case 0:
      return "/adminDashboard";
    case 1:
      return "/grades";
    case 2:
      return "/grades";
    case 3:
      return "/attendance/mark";
    default:
      return "/adminDashboard";
  }
};
