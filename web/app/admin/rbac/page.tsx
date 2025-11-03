'use client';

/**
 * Admin RBAC Management Page
 * Interface for admins to manage user roles
 */

import React, { useState, useEffect } from 'react';
import { useRBAC } from '../../auth/rbac-provider';
import { Role } from '../../auth/roles';
import RoleAssigner from './components/RoleAssigner';
import RoleViewer from './components/RoleViewer';

interface RoleAssignment {
  wallet: string;
  roles: Role[];
  assignedAt: string;
  assignedBy: string;
}

export default function RBACManagementPage() {
  const { isAdmin, loading, wallet } = useRBAC();
  const [activeTab, setActiveTab] = useState<'assign' | 'view'>('view');
  const [assignments, setAssignments] = useState<RoleAssignment[]>([]);
  const [loadingAssignments, setLoadingAssignments] = useState(false);

  // Load existing role assignments
  useEffect(() => {
    if (isAdmin) {
      loadRoleAssignments();
    }
  }, [isAdmin]);

  const loadRoleAssignments = async () => {
    setLoadingAssignments(true);
    try {
      // In production, this would fetch from IPFS or your backend
      // For now, load from localStorage
      const stored = localStorage.getItem('role_assignments');
      if (stored) {
        setAssignments(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading role assignments:', error);
    } finally {
      setLoadingAssignments(false);
    }
  };

  const handleRoleAssigned = (assignment: RoleAssignment) => {
    const updatedAssignments = [
      ...assignments.filter(a => a.wallet !== assignment.wallet),
      assignment
    ];
    setAssignments(updatedAssignments);
    
    // Store in localStorage for development
    localStorage.setItem('role_assignments', JSON.stringify(updatedAssignments));
  };

  const handleRoleRevoked = (walletAddress: string) => {
    const updatedAssignments = assignments.filter(a => a.wallet !== walletAddress);
    setAssignments(updatedAssignments);
    
    // Store in localStorage for development
    localStorage.setItem('role_assignments', JSON.stringify(updatedAssignments));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">You need admin privileges to access this page.</p>
          <p className="text-sm text-gray-500 mt-2">Current wallet: {wallet}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Role Management</h1>
          <p className="mt-2 text-gray-600">
            Manage user roles and permissions for The Mighty Verse platform
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('view')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'view'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Current Roles
            </button>
            <button
              onClick={() => setActiveTab('assign')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'assign'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Assign Roles
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white shadow rounded-lg">
          {activeTab === 'view' && (
            <RoleViewer
              assignments={assignments}
              loading={loadingAssignments}
              onRoleRevoked={handleRoleRevoked}
              onRefresh={loadRoleAssignments}
            />
          )}
          
          {activeTab === 'assign' && (
            <RoleAssigner
              onRoleAssigned={handleRoleAssigned}
              existingAssignments={assignments}
            />
          )}
        </div>

        {/* Admin Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Admin Session</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>Logged in as: <code className="bg-blue-100 px-1 rounded">{wallet}</code></p>
                <p className="mt-1">All role assignments require your signature and are stored on IPFS.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}