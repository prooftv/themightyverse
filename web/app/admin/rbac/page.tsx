'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface User {
  id: string;
  wallet: string;
  role: 'admin' | 'animator' | 'viewer';
  status: 'active' | 'pending' | 'suspended';
  joinedAt: string;
}

const mockUsers: User[] = [
  { id: '1', wallet: '0x1234...5678', role: 'admin', status: 'active', joinedAt: '2025-01-20T10:00:00Z' },
  { id: '2', wallet: '0x9876...5432', role: 'animator', status: 'active', joinedAt: '2025-01-22T14:30:00Z' },
  { id: '3', wallet: '0xabcd...efgh', role: 'viewer', status: 'pending', joinedAt: '2025-01-27T09:15:00Z' }
];

export default function AdminRBAC() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [filter, setFilter] = useState<'all' | 'admin' | 'animator' | 'viewer'>('all');

  const filteredUsers = users.filter(user => filter === 'all' || user.role === filter);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return '◆';
      case 'animator': return '◈';
      case 'viewer': return '◯';
      default: return '◇';
    }
  };

  const updateUserRole = (userId: string, newRole: 'admin' | 'animator' | 'viewer') => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ));
  };

  return (
    <div className="mighty-verse-app min-h-screen">
      <div className="mv-nav mx-4 mt-4">
        <div className="mv-nav-brand">
          <Link href="/admin" className="mv-heading-lg hover:text-yellow-400 transition-colors">
            ◆ Admin / RBAC
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="mv-heading-xl mb-4">◈ Role Management ◈</h1>
          <p className="mv-text-muted text-lg">Manage user roles and permissions</p>
        </div>

        {/* Role Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="mv-card mv-holographic p-6 text-center">
            <div className="text-4xl mb-2">◆</div>
            <div className="mv-heading-md">{users.filter(u => u.role === 'admin').length}</div>
            <div className="mv-text-muted text-sm">Admins</div>
          </div>
          <div className="mv-card mv-holographic p-6 text-center">
            <div className="text-4xl mb-2">◈</div>
            <div className="mv-heading-md">{users.filter(u => u.role === 'animator').length}</div>
            <div className="mv-text-muted text-sm">Animators</div>
          </div>
          <div className="mv-card mv-holographic p-6 text-center">
            <div className="text-4xl mb-2">◯</div>
            <div className="mv-heading-md">{users.filter(u => u.role === 'viewer').length}</div>
            <div className="mv-text-muted text-sm">Viewers</div>
          </div>
          <div className="mv-card mv-holographic p-6 text-center">
            <div className="text-4xl mb-2">◉</div>
            <div className="mv-heading-md">{users.length}</div>
            <div className="mv-text-muted text-sm">Total Users</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-8 justify-center">
          {['all', 'admin', 'animator', 'viewer'].map((role) => (
            <button
              key={role}
              onClick={() => setFilter(role as any)}
              className={`px-6 py-3 rounded-xl transition-all duration-300 flex items-center space-x-2 ${
                filter === role ? 'mv-button' : 'mv-button-secondary'
              }`}
            >
              <span>{role === 'all' ? '◉' : getRoleIcon(role)}</span>
              <span>{role.charAt(0).toUpperCase() + role.slice(1)}</span>
            </button>
          ))}
        </div>

        {/* Users List */}
        <div className="mv-card p-6">
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-green-400 rounded-xl flex items-center justify-center">
                    <span className="text-black text-lg font-bold">{getRoleIcon(user.role)}</span>
                  </div>
                  <div>
                    <div className="text-white font-medium">{user.wallet}</div>
                    <div className="flex items-center space-x-2 text-sm mv-text-muted">
                      <span>Joined {new Date(user.joinedAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span className={`${
                        user.status === 'active' ? 'text-green-400' :
                        user.status === 'pending' ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {user.status}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <select
                    value={user.role}
                    onChange={(e) => updateUserRole(user.id, e.target.value as any)}
                    className="bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:border-yellow-400 focus:outline-none"
                  >
                    <option value="admin">◆ Admin</option>
                    <option value="animator">◈ Animator</option>
                    <option value="viewer">◯ Viewer</option>
                  </select>
                  
                  <button className="mv-button-secondary px-4 py-2 text-sm">
                    Actions
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}