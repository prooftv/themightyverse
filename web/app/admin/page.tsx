'use client';

/**
 * Admin Dashboard - Main Overview Page
 * Central hub for content management and platform administration
 */

import React from 'react';
import { useRBAC } from '../auth/rbac-provider';
import Link from 'next/link';

interface DashboardStat {
  name: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
  href: string;
}

const stats: DashboardStat[] = [
  { name: 'Pending Assets', value: '12', change: '+4', changeType: 'increase', href: '/admin/assets' },
  { name: 'Active Campaigns', value: '3', change: '+1', changeType: 'increase', href: '/admin/campaigns' },
  { name: 'Mint Queue', value: '8', change: '-2', changeType: 'decrease', href: '/admin/mint-queue' },
  { name: 'Total Users', value: '247', change: '+12', changeType: 'increase', href: '/admin/rbac' },
];

const quickActions = [
  { name: 'Review Assets', href: '/admin/assets', icon: '📋', description: 'Review pending asset submissions' },
  { name: 'Manage Roles', href: '/admin/rbac', icon: '👥', description: 'Assign and manage user roles' },
  { name: 'Campaign Setup', href: '/admin/campaigns', icon: '📢', description: 'Create new advertising campaigns' },
  { name: 'Mint Approval', href: '/admin/mint-queue', icon: '🎯', description: 'Approve pending mint requests' },
];

export default function AdminDashboard() {
  const { isAdmin, loading, wallet } = useRBAC();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">Admin privileges required</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mighty-verse-app min-h-screen">
      {/* Header */}
      <div className="mv-nav mx-4 mt-4">
        <div className="mv-nav-brand">
          <h1 className="mv-heading-lg">Admin Dashboard</h1>
          <p className="mv-text-muted text-sm">The Mighty Verse Platform Administration</p>
        </div>
        <div className="mv-text-muted text-sm">
          Admin: <code className="bg-white/10 px-2 py-1 rounded text-mv-text-accent">{wallet?.slice(0, 8)}...</code>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat) => (
            <Link key={stat.name} href={stat.href}>
              <div className="mv-card mv-holographic p-6 cursor-pointer">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-green-400 rounded-xl flex items-center justify-center">
                    <span className="text-black text-lg font-bold">{stat.value.charAt(0)}</span>
                  </div>
                  <div className="flex-1">
                    <div className="mv-text-muted text-sm mb-1">{stat.name}</div>
                    <div className="flex items-baseline space-x-2">
                      <div className="text-2xl font-bold text-white">{stat.value}</div>
                      <div className={`text-sm font-semibold ${
                        stat.changeType === 'increase' ? 'mv-text-energy' : 'text-red-400'
                      }`}>
                        {stat.change}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="mv-heading-md mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action) => (
              <Link key={action.name} href={action.href}>
                <div className="mv-card p-6 cursor-pointer group">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{action.icon}</div>
                  <h3 className="mv-heading-md mb-2">{action.name}</h3>
                  <p className="mv-text-muted text-sm">{action.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mv-card p-6">
          <h3 className="mv-heading-md mb-6">Recent Activity</h3>
          <div className="space-y-6">
            {[
              { action: 'Asset submitted', user: '0x1234...5678', time: '2 hours ago', type: 'asset' },
              { action: 'Role assigned', user: '0x9876...5432', time: '4 hours ago', type: 'role' },
              { action: 'Campaign created', user: '0xabcd...efgh', time: '6 hours ago', type: 'campaign' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-green-400 flex items-center justify-center flex-shrink-0">
                  <span className="text-black text-sm">
                    {item.type === 'asset' ? '📄' : item.type === 'role' ? '👤' : '📢'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white">
                    {item.action} by <code className="mv-text-accent bg-white/10 px-2 py-1 rounded">{item.user}</code>
                  </p>
                </div>
                <div className="mv-text-muted text-sm whitespace-nowrap">
                  {item.time}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}