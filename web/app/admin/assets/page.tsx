'use client';

import React, { useState, useEffect } from 'react';
import { useRBAC } from '../../auth/rbac-provider';
import { dataManager } from '../../../utils/storage/data-store';

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
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = async () => {
    try {
      const data = await dataManager.getData('assets');
      setAssets(data);
    } catch (error) {
      console.error('Failed to load assets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await dataManager.updateItem('assets', id, { status: 'approved' });
      await loadAssets();
    } catch (error) {
      console.error('Failed to approve asset:', error);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await dataManager.updateItem('assets', id, { status: 'rejected' });
      await loadAssets();
    } catch (error) {
      console.error('Failed to reject asset:', error);
    }
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin text-6xl">◈</div>
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
          {assets.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="mv-heading-md mb-2">No Assets Submitted Yet</h3>
              <p className="mv-text-muted">This is a new platform - assets will appear here when submitted</p>
            </div>
          ) : (
            assets.map((asset) => (
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
            ))
          )}
        </div>
      </div>
    </div>
  );
}