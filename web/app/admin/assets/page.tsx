'use client';

import React, { useState } from 'react';
import { useRBAC } from '../../auth/rbac-provider';

interface Asset {
  id: string;
  name: string;
  type: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedBy: string;
  submittedAt: string;
}

export default function AssetsPage() {
  const { isAdmin } = useRBAC();
  const [assets, setAssets] = useState<Asset[]>([
    { id: '1', name: 'Holographic Hero Animation', type: 'animation', status: 'pending', submittedBy: '0x1234...5678', submittedAt: '2025-01-27' },
    { id: '2', name: 'African Warrior Model', type: '3d-model', status: 'pending', submittedBy: '0x9876...5432', submittedAt: '2025-01-27' },
    { id: '3', name: 'Golden Shovel Audio', type: 'audio', status: 'approved', submittedBy: '0xabcd...efgh', submittedAt: '2025-01-26' }
  ]);

  const handleApprove = (id: string) => {
    setAssets(prev => prev.map(asset => 
      asset.id === id ? { ...asset, status: 'approved' as const } : asset
    ));
  };

  const handleReject = (id: string) => {
    setAssets(prev => prev.map(asset => 
      asset.id === id ? { ...asset, status: 'rejected' as const } : asset
    ));
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="mv-card p-8 text-center">
          <h1 className="mv-heading-lg text-red-400 mb-4">Access Denied</h1>
          <p className="mv-text-muted">Admin privileges required</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="mv-heading-xl mb-4">📋 Asset Review</h1>
        <p className="mv-text-muted text-lg">Review and approve pending asset submissions</p>
      </div>

      <div className="mv-card p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
          <h2 className="mv-heading-md">Pending Assets ({assets.filter(a => a.status === 'pending').length})</h2>
          <div className="flex space-x-2">
            <button className="mv-button-sm">Filter</button>
            <button className="mv-button-sm">Sort</button>
          </div>
        </div>

        <div className="space-y-4">
          {assets.map((asset) => (
            <div key={asset.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-2">{asset.name}</h3>
                  <div className="flex flex-wrap gap-4 text-sm mv-text-muted">
                    <span>Type: {asset.type}</span>
                    <span>By: {asset.submittedBy}</span>
                    <span>Date: {asset.submittedAt}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    asset.status === 'approved' ? 'bg-green-400/20 text-green-400' :
                    asset.status === 'rejected' ? 'bg-red-400/20 text-red-400' :
                    'bg-yellow-400/20 text-yellow-400'
                  }`}>
                    {asset.status}
                  </span>
                  {asset.status === 'pending' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleApprove(asset.id)}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white text-sm"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(asset.id)}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white text-sm"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}