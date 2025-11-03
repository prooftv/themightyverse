'use client';

/**
 * Admin Assets Management
 * Review and approve pending asset submissions
 */

import React, { useState, useEffect } from 'react';
import { useRBAC } from '../../auth/rbac-provider';
import Link from 'next/link';

interface PendingAsset {
  id: string;
  title: string;
  animator: string;
  submittedAt: string;
  status: 'pending' | 'reviewing' | 'approved' | 'rejected';
  confidence: number;
  issues: string[];
  previewUrl?: string;
}

const mockAssets: PendingAsset[] = [
  {
    id: 'asset_001',
    title: 'Super Hero Ego - Verse 1',
    animator: '0x1234...5678',
    submittedAt: '2025-01-27T10:30:00Z',
    status: 'pending',
    confidence: 0.92,
    issues: [],
    previewUrl: '/api/preview/asset_001'
  },
  {
    id: 'asset_002', 
    title: 'Golden Era - Intro Scene',
    animator: '0x9876...5432',
    submittedAt: '2025-01-27T08:15:00Z',
    status: 'reviewing',
    confidence: 0.76,
    issues: ['low_confidence', 'missing_depth_map'],
    previewUrl: '/api/preview/asset_002'
  },
  {
    id: 'asset_003',
    title: 'Mighty Verse - Outro',
    animator: '0xabcd...efgh', 
    submittedAt: '2025-01-26T16:45:00Z',
    status: 'pending',
    confidence: 0.88,
    issues: ['no_local_image'],
    previewUrl: '/api/preview/asset_003'
  }
];

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  reviewing: 'bg-blue-100 text-blue-800', 
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800'
};

export default function AssetsManagement() {
  const { isAdmin, isCurator } = useRBAC();
  const [assets, setAssets] = useState<PendingAsset[]>(mockAssets);
  const [filter, setFilter] = useState<'all' | 'pending' | 'reviewing'>('all');

  const canReview = isAdmin || isCurator;

  const filteredAssets = assets.filter(asset => {
    if (filter === 'all') return true;
    return asset.status === filter;
  });

  const handleStatusChange = (assetId: string, newStatus: PendingAsset['status']) => {
    setAssets(prev => prev.map(asset => 
      asset.id === assetId ? { ...asset, status: newStatus } : asset
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!canReview) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">Curator or Admin privileges required</p>
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
              <nav className="flex" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-4">
                  <li>
                    <Link href="/admin" className="text-gray-400 hover:text-gray-500">
                      Admin
                    </Link>
                  </li>
                  <li>
                    <span className="text-gray-400">/</span>
                  </li>
                  <li>
                    <span className="text-gray-900 font-medium">Assets</span>
                  </li>
                </ol>
              </nav>
              <h1 className="text-2xl font-bold text-gray-900 mt-2">Asset Management</h1>
              <p className="text-sm text-gray-500">Review and approve pending asset submissions</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-6">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <div className="flex space-x-4">
                {(['all', 'pending', 'reviewing'] as const).map((status) => (
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
                      {status === 'all' ? assets.length : assets.filter(a => a.status === status).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Assets List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredAssets.map((asset) => (
              <li key={asset.id}>
                <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 bg-gray-300 rounded-lg flex items-center justify-center">
                          <span className="text-gray-600 text-sm">🎬</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-gray-900">{asset.title}</p>
                          <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[asset.status]}`}>
                            {asset.status}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <span>By {asset.animator}</span>
                          <span className="mx-2">•</span>
                          <span>{formatDate(asset.submittedAt)}</span>
                          <span className="mx-2">•</span>
                          <span className={`font-medium ${asset.confidence >= 0.8 ? 'text-green-600' : 'text-yellow-600'}`}>
                            {Math.round(asset.confidence * 100)}% confidence
                          </span>
                        </div>
                        {asset.issues.length > 0 && (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {asset.issues.map((issue) => (
                              <span key={issue} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                {issue.replace(/_/g, ' ')}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/admin/assets/${asset.id}`}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Review
                      </Link>
                      {asset.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(asset.id, 'approved')}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatusChange(asset.id, 'rejected')}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {filteredAssets.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No assets found</h3>
            <p className="mt-1 text-sm text-gray-500">
              No assets match the current filter criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}