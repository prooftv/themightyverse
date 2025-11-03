/**
 * RBAC Role Definitions for The Mighty Verse
 * Defines roles, interfaces, and type guards for role-based access control
 */

export enum Role {
  ADMIN = "ADMIN",
  CURATOR = "CURATOR",
  ANIMATOR = "ANIMATOR",
  SPONSOR = "SPONSOR",
  VIEWER = "VIEWER"
}

export interface RoleManifest {
  wallet: string;
  roles: Role[];
  issued_by: string;
  issued_at: string;
  expires_at: string | null;
  admin_sig: string;
  version: string;
}

export interface RoleRegistry {
  _metadata: {
    version: string;
    created: string;
    last_updated: string;
  };
  _admin_wallets: string[];
  registry: Record<string, string>; // wallet -> manifest CID
}

export interface RoleCheckResult {
  hasRole: boolean;
  roles: Role[];
  manifest?: RoleManifest;
  error?: string;
}

// Role hierarchy for permission inheritance
export const ROLE_HIERARCHY: Record<Role, Role[]> = {
  [Role.ADMIN]: [Role.ADMIN, Role.CURATOR, Role.ANIMATOR, Role.SPONSOR, Role.VIEWER],
  [Role.CURATOR]: [Role.CURATOR, Role.VIEWER],
  [Role.ANIMATOR]: [Role.ANIMATOR, Role.VIEWER],
  [Role.SPONSOR]: [Role.SPONSOR, Role.VIEWER],
  [Role.VIEWER]: [Role.VIEWER]
};

// Route permissions mapping
export const ROUTE_PERMISSIONS: Record<string, Role[]> = {
  '/admin': [Role.ADMIN],
  '/admin/rbac': [Role.ADMIN],
  '/admin/assets': [Role.ADMIN, Role.CURATOR],
  '/admin/campaigns': [Role.ADMIN, Role.CURATOR],
  '/animator': [Role.ADMIN, Role.ANIMATOR],
  '/sponsor': [Role.ADMIN, Role.SPONSOR]
};

/**
 * Check if a role has permission for another role
 */
export function hasRolePermission(userRole: Role, requiredRole: Role): boolean {
  return ROLE_HIERARCHY[userRole]?.includes(requiredRole) ?? false;
}

/**
 * Check if user roles satisfy route requirements
 */
export function canAccessRoute(userRoles: Role[], routePath: string): boolean {
  const requiredRoles = ROUTE_PERMISSIONS[routePath];
  if (!requiredRoles) return true; // Public route
  
  return userRoles.some(userRole => 
    requiredRoles.some(requiredRole => hasRolePermission(userRole, requiredRole))
  );
}

/**
 * Type guard for RoleManifest
 */
export function isValidRoleManifest(obj: any): obj is RoleManifest {
  return (
    typeof obj === 'object' &&
    typeof obj.wallet === 'string' &&
    Array.isArray(obj.roles) &&
    obj.roles.every((role: any) => Object.values(Role).includes(role)) &&
    typeof obj.issued_by === 'string' &&
    typeof obj.issued_at === 'string' &&
    typeof obj.admin_sig === 'string' &&
    typeof obj.version === 'string'
  );
}