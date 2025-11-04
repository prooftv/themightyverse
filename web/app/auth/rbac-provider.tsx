'use client';

/**
 * RBAC Provider - React Context for Role Management
 * Provides role state and utilities throughout the application
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAddress, useConnectionStatus } from '@thirdweb-dev/react';
import { Role, RoleManifest, RoleCheckResult, hasRolePermission } from './roles';
import { getRoleManifest } from '../../utils/auth/role-manifest';

interface RBACContextType {
  // State
  roles: Role[];
  loading: boolean;
  error: string | null;
  wallet: string | null;
  manifest: RoleManifest | null;
  
  // Actions
  refreshRoles: () => Promise<void>;
  connectWallet: (walletAddress: string) => Promise<void>;
  disconnect: () => void;
  
  // Utilities
  hasRole: (role: Role) => boolean;
  hasAnyRole: (roles: Role[]) => boolean;
  canAccess: (requiredRole: Role) => boolean;
  isAdmin: boolean;
  isCurator: boolean;
  isAnimator: boolean;
  isSponsor: boolean;
}

const RBACContext = createContext<RBACContextType | undefined>(undefined);

interface RBACProviderProps {
  children: React.ReactNode;
}

export function RBACProvider({ children }: RBACProviderProps) {
  const address = useAddress();
  const connectionStatus = useConnectionStatus();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manifest, setManifest] = useState<RoleManifest | null>(null);
  
  // Use ThirdWeb address as wallet
  const wallet = address || null;

  /**
   * Load roles for connected wallet
   */
  const loadRoles = useCallback(async (walletAddress: string) => {
    if (!walletAddress) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const roleManifest = await getRoleManifest(walletAddress);
      
      if (roleManifest) {
        setRoles(roleManifest.roles);
        setManifest(roleManifest);
      } else {
        // No roles found - user is a viewer by default
        setRoles([Role.VIEWER]);
        setManifest(null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load roles';
      setError(errorMessage);
      console.error('Error loading roles:', err);
      
      // Fallback to viewer role on error
      setRoles([Role.VIEWER]);
      setManifest(null);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Connect wallet and load roles (ThirdWeb handles connection)
   */
  const connectWallet = useCallback(async (walletAddress?: string) => {
    const targetAddress = walletAddress || address;
    if (targetAddress) {
      await loadRoles(targetAddress);
    }
  }, [loadRoles, address]);

  /**
   * Refresh roles for current wallet
   */
  const refreshRoles = useCallback(async () => {
    if (wallet) {
      await loadRoles(wallet);
    }
  }, [wallet, loadRoles]);

  /**
   * Disconnect wallet and clear roles (ThirdWeb handles disconnection)
   */
  const disconnect = useCallback(() => {
    setRoles([]);
    setManifest(null);
    setError(null);
  }, []);

  /**
   * Check if user has specific role
   */
  const hasRole = useCallback((role: Role): boolean => {
    return roles.includes(role);
  }, [roles]);

  /**
   * Check if user has any of the specified roles
   */
  const hasAnyRole = useCallback((requiredRoles: Role[]): boolean => {
    return requiredRoles.some(role => roles.includes(role));
  }, [roles]);

  /**
   * Check if user can access functionality requiring specific role
   * Uses role hierarchy for permission inheritance
   */
  const canAccess = useCallback((requiredRole: Role): boolean => {
    return roles.some(userRole => hasRolePermission(userRole, requiredRole));
  }, [roles]);

  // Computed role flags
  const isAdmin = hasRole(Role.ADMIN);
  const isCurator = hasRole(Role.CURATOR);
  const isAnimator = hasRole(Role.ANIMATOR);
  const isSponsor = hasRole(Role.SPONSOR);

  // Auto-load roles when ThirdWeb address changes
  useEffect(() => {
    if (address && connectionStatus === 'connected') {
      loadRoles(address);
    } else if (!address) {
      setRoles([]);
      setManifest(null);
      setError(null);
    }
  }, [address, connectionStatus, loadRoles]);

  const contextValue: RBACContextType = {
    // State
    roles,
    loading,
    error,
    wallet,
    manifest,
    
    // Actions
    refreshRoles,
    connectWallet,
    disconnect,
    
    // Utilities
    hasRole,
    hasAnyRole,
    canAccess,
    isAdmin,
    isCurator,
    isAnimator,
    isSponsor
  };

  return (
    <RBACContext.Provider value={contextValue}>
      {children}
    </RBACContext.Provider>
  );
}

/**
 * Hook to use RBAC context
 */
export function useRBAC(): RBACContextType {
  const context = useContext(RBACContext);
  
  if (context === undefined) {
    throw new Error('useRBAC must be used within an RBACProvider');
  }
  
  return context;
}

/**
 * HOC to protect components with role requirements
 */
export function withRoleProtection<P extends object>(
  Component: React.ComponentType<P>,
  requiredRole: Role,
  fallback?: React.ComponentType
) {
  return function ProtectedComponent(props: P) {
    const { canAccess, loading } = useRBAC();
    
    if (loading) {
      return <div>Loading...</div>;
    }
    
    if (!canAccess(requiredRole)) {
      if (fallback) {
        const FallbackComponent = fallback;
        return <FallbackComponent />;
      }
      return <div>Access denied. Required role: {requiredRole}</div>;
    }
    
    return <Component {...props} />;
  };
}