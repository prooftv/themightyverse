'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface MintRequest {
  id: string;
  assetId: string;
  title: string;
  creator: string;
  type: 'audio' | 'animation' | '3d';
  status: 'pending' | 'approved' | 'minting' | 'completed' | 'failed';
  confidence: number;
  requestedAt: string;
  estimatedGas: number;
}

const mockRequests: MintRequest[] = [
  { id: '1', assetId: 'ast_001', title: 'Afrofuturism Beat', creator: '0x1234...5678', type: 'audio', status: 'pending', confidence: 0.95, requestedAt: '2025-01-27T10:30:00Z', estimatedGas: 0.025 },
  { id: '2', assetId: 'ast_002', title: 'Holographic Dance', creator: '0x9876...5432', type: 'animation', status: 'minting', confidence: 0.88, requestedAt: '2025-01-26T15:20:00Z', estimatedGas: 0.032 },
  { id: '3', assetId: 'ast_003', title: 'Ancient Mask', creator: '0xabcd...efgh', type: '3d', status: 'completed', confidence: 0.92, requestedAt: '2025-01-25T09:15:00Z', estimatedGas: 0.028 }
];

export default function AdminMintQueue() {
  const [requests, setRequests] = useState<MintRequest[]>(mockRequests);
  const [filter, setFilter] = useState<'all' | 'pending' | 'minting' | 'completed'>('all');

  const filteredRequests = requests.filter(r => filter === 'all' || r.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'mv-status-success';
      case 'pending': return 'mv-status-pending';
      case 'minting': return 'bg-blue-400/10 text-blue-400 border border-blue-400/30 rounded-full px-3 py-1 text-sm';
      case 'failed': return 'mv-status-error';
      default: return 'mv-status-pending';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'audio': return '◆';
      case 'animation': return '◈';
      case '3d': return '◉';
      default: return '◯';
    }
  };

  const approveMint = (id: string) => {
    setRequests(requests.map(r => 
      r.id === id ? { ...r, status: 'minting' as const } : r
    ));
  };

  return (
    <div className="mighty-verse-app min-h-screen">
      <div className="mv-nav mx-4 mt-4">
        <div className="mv-nav-brand">
          <Link href="/admin" className="mv-heading-lg hover:text-yellow-400 transition-colors">
            ◆ Admin / Mint Queue
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="mv-heading-xl mb-4">◈ Mint Approval Queue ◈</h1>
          <p className="mv-text-muted text-lg">Review and approve NFT minting requests</p>
        </div>

        {/* Queue Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="mv-card mv-holographic p-6 text-center">
            <div className="text-4xl mb-2">◆</div>
            <div className="mv-heading-md">{requests.filter(r => r.status === 'pending').length}</div>
            <div className="mv-text-muted text-sm">Pending</div>
          </div>
          <div className="mv-card mv-holographic p-6 text-center">
            <div className="text-4xl mb-2">◈</div>
            <div className="mv-heading-md">{requests.filter(r => r.status === 'minting').length}</div>
            <div className="mv-text-muted text-sm">Minting</div>
          </div>
          <div className="mv-card mv-holographic p-6 text-center">
            <div className="text-4xl mb-2">◉</div>
            <div className="mv-heading-md">{requests.filter(r => r.status === 'completed').length}</div>
            <div className="mv-text-muted text-sm">Completed</div>
          </div>
          <div className="mv-card mv-holographic p-6 text-center">
            <div className="text-4xl mb-2">◇</div>
            <div className="mv-heading-md">{requests.reduce((sum, r) => sum + r.estimatedGas, 0).toFixed(3)} ETH</div>
            <div className="mv-text-muted text-sm">Est. Gas</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-8 justify-center">
          {['all', 'pending', 'minting', 'completed'].map((status) => (
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

        {/* Mint Requests */}
        <div className="space-y-6">
          {filteredRequests.map((request) => (
            <div key={request.id} className="mv-card mv-holographic p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-green-400 rounded-2xl flex items-center justify-center">
                    <span className="text-black text-2xl font-bold">{getTypeIcon(request.type)}</span>
                  </div>
                  <div>
                    <h3 className="mv-heading-md">{request.title}</h3>
                    <div className="mv-text-muted text-sm">
                      by {request.creator} • {new Date(request.requestedAt).toLocaleDateString()}
                    </div>
                    <div className="mv-text-muted text-sm">Asset ID: {request.assetId}</div>
                  </div>
                </div>
                <div className={getStatusColor(request.status)}>
                  {request.status}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white/5 p-3 rounded-xl">
                  <div className="mv-text-muted text-sm">Type</div>
                  <div className="text-white font-semibold">{request.type}</div>
                </div>
                <div className="bg-white/5 p-3 rounded-xl">
                  <div className="mv-text-muted text-sm">Confidence</div>
                  <div className={`font-semibold ${request.confidence >= 0.8 ? 'text-green-400' : 'text-yellow-400'}`}>
                    {Math.round(request.confidence * 100)}%
                  </div>
                </div>
                <div className="bg-white/5 p-3 rounded-xl">
                  <div className="mv-text-muted text-sm">Est. Gas</div>
                  <div className="text-white font-semibold">{request.estimatedGas} ETH</div>
                </div>
                <div className="bg-white/5 p-3 rounded-xl">
                  <div className="mv-text-muted text-sm">Status</div>
                  <div className="text-white font-semibold">{request.status}</div>
                </div>
              </div>

              {/* Confidence Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="mv-text-muted">AI Confidence Score</span>
                  <span className="text-white">{Math.round(request.confidence * 100)}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      request.confidence >= 0.8 
                        ? 'bg-gradient-to-r from-green-400 to-blue-400' 
                        : 'bg-gradient-to-r from-yellow-400 to-orange-400'
                    }`}
                    style={{ width: `${request.confidence * 100}%` }}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                {request.status === 'pending' && (
                  <>
                    <button 
                      onClick={() => approveMint(request.id)}
                      className="mv-button px-4 py-2 text-sm"
                    >
                      ◆ Approve Mint
                    </button>
                    <button className="mv-button-secondary px-4 py-2 text-sm">◇ Reject</button>
                  </>
                )}
                <button className="mv-button-secondary px-4 py-2 text-sm">◈ View Asset</button>
                <button className="mv-button-secondary px-4 py-2 text-sm">◉ Details</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}