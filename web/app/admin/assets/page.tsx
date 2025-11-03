'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AgentService } from '../../../utils/agents';

interface Asset {
  id: string;
  title: string;
  artist: string;
  type: 'audio' | 'video' | 'animation' | '3d';
  status: 'pending' | 'approved' | 'rejected';
  confidence: number;
  submittedAt: string;
}

const mockAssets: Asset[] = [
  { id: '1', title: 'Afrofuturism Beat', artist: 'Digital Griot', type: 'audio', status: 'pending', confidence: 0.92, submittedAt: '2025-01-27T10:30:00Z' },
  { id: '2', title: 'Holographic Dance', artist: 'Verse Animator', type: 'animation', status: 'approved', confidence: 0.88, submittedAt: '2025-01-26T15:20:00Z' },
  { id: '3', title: 'Ancient Mask', artist: 'Cultural Tech', type: '3d', status: 'rejected', confidence: 0.45, submittedAt: '2025-01-25T09:15:00Z' }
];

export default function AdminAssets() {
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const filteredAssets = mockAssets.filter(asset => filter === 'all' || asset.status === filter);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'audio': return '◆';
      case 'animation': return '◈';
      case '3d': return '◉';
      default: return '◯';
    }
  };

  return (
    <div className="mighty-verse-app min-h-screen">
      <div className="mv-nav mx-4 mt-4">
        <div className="mv-nav-brand">
          <Link href="/admin" className="mv-heading-lg hover:text-yellow-400 transition-colors">
            ◆ Admin / Assets
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="mv-heading-xl mb-4">◈ Asset Review ◈</h1>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-8 justify-center">
          {['all', 'pending', 'approved', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as any)}
              className={`px-6 py-3 rounded-xl transition-all duration-300 ${
                filter === status ? 'mv-button' : 'mv-button-secondary'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Assets Grid */}
        <div className="mv-asset-grid">
          {filteredAssets.map((asset) => (
            <div key={asset.id} className="mv-card mv-holographic p-6 group">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-green-400 rounded-2xl flex items-center justify-center text-2xl font-bold">
                  <span className="text-black">{getTypeIcon(asset.type)}</span>
                </div>
                <div className="flex-1">
                  <h3 className="mv-heading-md">{asset.title}</h3>
                  <p className="mv-text-muted">by {asset.artist}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm ${
                  asset.status === 'approved' ? 'mv-status-success' :
                  asset.status === 'rejected' ? 'mv-status-error' : 'mv-status-pending'
                }`}>
                  {asset.status}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="mv-text-muted">Confidence:</span>
                  <span className={`font-semibold ${asset.confidence >= 0.8 ? 'text-green-400' : 'text-yellow-400'}`}>
                    {Math.round(asset.confidence * 100)}%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="mv-text-muted">Type:</span>
                  <span className="text-white">{asset.type}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="mv-text-muted">Submitted:</span>
                  <span className="text-white">{new Date(asset.submittedAt).toLocaleDateString()}</span>
                </div>
              </div>

              {asset.status === 'pending' && (
                <div className="flex gap-2 mt-4">
                  <button 
                    onClick={async () => {
                      const result = await AgentService.reviewAsset(asset.id, `/assets/${asset.id}`, asset.type);
                      console.log('Review result:', result);
                    }}
                    className="mv-button flex-1 text-sm py-2"
                  >
                    ◆ AI Review
                  </button>
                  <button className="mv-button-secondary flex-1 text-sm py-2">◇ Reject</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}