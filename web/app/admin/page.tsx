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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">The Mighty Verse Platform Administration</p>
            </div>
            <div className="text-sm text-gray-500">
              Admin: <code className="bg-gray-100 px-2 py-1 rounded">{wallet?.slice(0, 8)}...</code>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat) => (
            <Link key={stat.name} href={stat.href}>
              <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                        <span className="text-white text-sm font-medium">{stat.value.charAt(0)}</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
                          <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                            stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {stat.change}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action) => (
              <Link key={action.name} href={action.href}>
                <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer">
                  <div className="text-3xl mb-3">{action.icon}</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{action.name}</h3>
                  <p className="text-sm text-gray-500">{action.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Recent Activity</h3>
            <div className="flow-root">
              <ul className="-mb-8">
                {[
                  { action: 'Asset submitted', user: '0x1234...5678', time: '2 hours ago', type: 'asset' },
                  { action: 'Role assigned', user: '0x9876...5432', time: '4 hours ago', type: 'role' },
                  { action: 'Campaign created', user: '0xabcd...efgh', time: '6 hours ago', type: 'campaign' },
                ].map((item, idx) => (
                  <li key={idx}>
                    <div className="relative pb-8">
                      {idx !== 2 && (
                        <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" />
                      )}
                      <div className="relative flex space-x-3">
                        <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                          <span className="text-white text-xs">
                            {item.type === 'asset' ? '📄' : item.type === 'role' ? '👤' : '📢'}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-500">
                              {item.action} by <code className="text-gray-900">{item.user}</code>
                            </p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500">
                            {item.time}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}