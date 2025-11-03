'use client';

/**
 * Campaign Management Page
 * Manage sponsor advertising campaigns and ad placements
 */

import React, { useState } from 'react';
import { useRBAC } from '../../auth/rbac-provider';
import Link from 'next/link';

interface Campaign {
  id: string;
  name: string;
  sponsor: {
    name: string;
    wallet: string;
    contact: string;
  };
  status: 'draft' | 'active' | 'paused' | 'completed';
  budget: {
    total: number;
    spent: number;
    currency: string;
  };
  anchors: {
    reserved: number;
    active: number;
  };
  metrics: {
    impressions: number;
    clicks: number;
    ctr: number;
  };
  startDate: string;
  endDate: string;
  createdAt: string;
}

const mockCampaigns: Campaign[] = [
  {
    id: 'camp_001',
    name: 'Nike Air Max Campaign',
    sponsor: {
      name: 'Nike',
      wallet: '0xabcd...1234',
      contact: 'campaigns@nike.com'
    },
    status: 'active',
    budget: {
      total: 5000,
      spent: 1250,
      currency: 'USD'
    },
    anchors: {
      reserved: 8,
      active: 6
    },
    metrics: {
      impressions: 12500,
      clicks: 375,
      ctr: 3.0
    },
    startDate: '2025-01-20T00:00:00Z',
    endDate: '2025-02-20T00:00:00Z',
    createdAt: '2025-01-15T10:30:00Z'
  },
  {
    id: 'camp_002',
    name: 'Spotify Premium Promo',
    sponsor: {
      name: 'Spotify',
      wallet: '0xefgh...5678',
      contact: 'ads@spotify.com'
    },
    status: 'draft',
    budget: {
      total: 3000,
      spent: 0,
      currency: 'USD'
    },
    anchors: {
      reserved: 4,
      active: 0
    },
    metrics: {
      impressions: 0,
      clicks: 0,
      ctr: 0
    },
    startDate: '2025-02-01T00:00:00Z',
    endDate: '2025-02-28T00:00:00Z',
    createdAt: '2025-01-25T14:15:00Z'
  }
];

const statusColors = {
  draft: 'bg-gray-100 text-gray-800',
  active: 'bg-green-100 text-green-800',
  paused: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-blue-100 text-blue-800'
};

export default function CampaignManagement() {
  const { isAdmin, isCurator } = useRBAC();
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);
  const [filter, setFilter] = useState<'all' | Campaign['status']>('all');

  const canManage = isAdmin || isCurator;

  const filteredCampaigns = campaigns.filter(campaign => 
    filter === 'all' || campaign.status === filter
  );

  const handleStatusChange = (campaignId: string, newStatus: Campaign['status']) => {
    setCampaigns(prev => prev.map(campaign =>
      campaign.id === campaignId ? { ...campaign, status: newStatus } : campaign
    ));
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (!canManage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">Admin or Curator privileges required</p>
        </div>
      </div>
    );
  }

  const stats = {
    total: campaigns.length,
    active: campaigns.filter(c => c.status === 'active').length,
    totalBudget: campaigns.reduce((sum, c) => sum + c.budget.total, 0),
    totalSpent: campaigns.reduce((sum, c) => sum + c.budget.spent, 0)
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <nav className="flex mb-2" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-4">
                  <li>
                    <Link href="/admin" className="text-gray-400 hover:text-gray-500">
                      Admin
                    </Link>
                  </li>
                  <li><span className="text-gray-400">/</span></li>
                  <li><span className="text-gray-900 font-medium">Campaigns</span></li>
                </ol>
              </nav>
              <h1 className="text-2xl font-bold text-gray-900">Campaign Management</h1>
              <p className="text-sm text-gray-500">Manage sponsor advertising campaigns and placements</p>
            </div>
            <Link
              href="/admin/campaigns/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              New Campaign
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-4 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm">📊</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Campaigns</dt>
                    <dd className="text-2xl font-semibold text-gray-900">{stats.total}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm">🟢</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Active</dt>
                    <dd className="text-2xl font-semibold text-gray-900">{stats.active}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm">💰</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Budget</dt>
                    <dd className="text-2xl font-semibold text-gray-900">
                      {formatCurrency(stats.totalBudget, 'USD')}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm">📈</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Spent</dt>
                    <dd className="text-2xl font-semibold text-gray-900">
                      {formatCurrency(stats.totalSpent, 'USD')}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <div className="flex space-x-4">
            {(['all', 'draft', 'active', 'paused', 'completed'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  filter === status
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
                <span className="ml-2 bg-gray-200 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                  {status === 'all' ? campaigns.length : campaigns.filter(c => c.status === status).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Campaigns List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredCampaigns.map((campaign) => (
              <li key={campaign.id}>
                <Link href={`/admin/campaigns/${campaign.id}`}>
                  <div className="px-4 py-4 sm:px-6 hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                            <span className="text-white text-sm font-medium">
                              {campaign.sponsor.name.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center">
                            <p className="text-sm font-medium text-gray-900">{campaign.name}</p>
                            <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[campaign.status]}`}>
                              {campaign.status}
                            </span>
                          </div>
                          <div className="mt-1 flex items-center text-sm text-gray-500">
                            <span>{campaign.sponsor.name}</span>
                            <span className="mx-2">•</span>
                            <span>{campaign.anchors.active}/{campaign.anchors.reserved} anchors active</span>
                            <span className="mx-2">•</span>
                            <span>{formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {formatCurrency(campaign.budget.spent, campaign.budget.currency)} / {formatCurrency(campaign.budget.total, campaign.budget.currency)}
                          </p>
                          <div className="mt-1 w-24 bg-gray-200 rounded-full h-1.5">
                            <div 
                              className="bg-blue-500 h-1.5 rounded-full"
                              style={{ width: `${(campaign.budget.spent / campaign.budget.total) * 100}%` }}
                            />
                          </div>
                        </div>
                        {campaign.status === 'active' && (
                          <div className="text-right">
                            <p className="text-sm text-gray-500">CTR</p>
                            <p className="text-sm font-medium text-gray-900">{campaign.metrics.ctr}%</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {filteredCampaigns.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No campaigns found</h3>
            <p className="mt-1 text-sm text-gray-500">
              No campaigns match the current filter criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}