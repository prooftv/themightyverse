'use client';

/**
 * Mint Queue Management
 * Admin interface for approving and processing NFT mints
 */

import React, { useState } from 'react';
import { useRBAC } from '../../auth/rbac-provider';
import Link from 'next/link';

interface MintRequest {
  id: string;
  assetId: string;
  title: string;
  animator: string;
  manifestCid: string;
  status: 'pending' | 'approved' | 'minting' | 'minted' | 'failed';
  priority: 'low' | 'medium' | 'high';
  requestedAt: string;
  approvedAt?: string;
  mintedAt?: string;
  txHash?: string;
  metadata: {
    confidence: number;
    qcScore: number;
    hasDepthMap: boolean;
    hasAdAnchors: boolean;
    isrcReserved: boolean;
  };
  blockchain: {
    network: 'testnet' | 'mainnet';
    estimatedGas: number;
    gasPrice: number;
  };
}

const mockMintRequests: MintRequest[] = [
  {
    id: 'mint_001',
    assetId: 'asset_001',
    title: 'Super Hero Ego - Verse 1',
    animator: '0x1234...5678',
    manifestCid: 'bafybeig...',
    status: 'pending',
    priority: 'high',
    requestedAt: '2025-01-27T10:30:00Z',
    metadata: {
      confidence: 0.92,
      qcScore: 0.88,
      hasDepthMap: true,
      hasAdAnchors: true,
      isrcReserved: true
    },
    blockchain: {
      network: 'testnet',
      estimatedGas: 150000,
      gasPrice: 20
    }
  },
  {
    id: 'mint_002',
    assetId: 'asset_002',
    title: 'Golden Era - Intro Scene',
    animator: '0x9876...5432',
    manifestCid: 'bafybeih...',
    status: 'approved',
    priority: 'medium',
    requestedAt: '2025-01-26T14:15:00Z',
    approvedAt: '2025-01-27T09:00:00Z',
    metadata: {
      confidence: 0.85,
      qcScore: 0.82,
      hasDepthMap: false,
      hasAdAnchors: true,
      isrcReserved: false
    },
    blockchain: {
      network: 'testnet',
      estimatedGas: 145000,
      gasPrice: 18
    }
  },
  {
    id: 'mint_003',
    assetId: 'asset_003',
    title: 'Mighty Verse - Outro',
    animator: '0xabcd...efgh',
    manifestCid: 'bafybeij...',
    status: 'minted',
    priority: 'low',
    requestedAt: '2025-01-25T16:45:00Z',
    approvedAt: '2025-01-26T10:30:00Z',
    mintedAt: '2025-01-26T11:15:00Z',
    txHash: '0x1234567890abcdef...',
    metadata: {
      confidence: 0.94,
      qcScore: 0.91,
      hasDepthMap: true,
      hasAdAnchors: false,
      isrcReserved: true
    },
    blockchain: {
      network: 'mainnet',
      estimatedGas: 152000,
      gasPrice: 25
    }
  }
];

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-blue-100 text-blue-800',
  minting: 'bg-purple-100 text-purple-800',
  minted: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800'
};

const priorityColors = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800'
};

export default function MintQueueManagement() {
  const { isAdmin } = useRBAC();
  const [requests, setRequests] = useState<MintRequest[]>(mockMintRequests);
  const [filter, setFilter] = useState<'all' | MintRequest['status']>('all');
  const [processing, setProcessing] = useState<string | null>(null);

  const filteredRequests = requests.filter(request =>
    filter === 'all' || request.status === filter
  );

  const handleApprove = async (requestId: string) => {
    setProcessing(requestId);
    try {
      // Simulate approval process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setRequests(prev => prev.map(request =>
        request.id === requestId
          ? { ...request, status: 'approved', approvedAt: new Date().toISOString() }
          : request
      ));
    } catch (error) {
      console.error('Approval failed:', error);
    } finally {
      setProcessing(null);
    }
  };

  const handleMint = async (requestId: string, network: 'testnet' | 'mainnet') => {
    setProcessing(requestId);
    try {
      // Simulate minting process
      setRequests(prev => prev.map(request =>
        request.id === requestId ? { ...request, status: 'minting' } : request
      ));
      
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setRequests(prev => prev.map(request =>
        request.id === requestId
          ? {
              ...request,
              status: 'minted',
              mintedAt: new Date().toISOString(),
              txHash: `0x${Math.random().toString(16).substring(2, 18)}...`,
              blockchain: { ...request.blockchain, network }
            }
          : request
      ));
    } catch (error) {
      console.error('Minting failed:', error);
      setRequests(prev => prev.map(request =>
        request.id === requestId ? { ...request, status: 'failed' } : request
      ));
    } finally {
      setProcessing(null);
    }
  };

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

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    minted: requests.filter(r => r.status === 'minted').length
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
                  <li><span className="text-gray-900 font-medium">Mint Queue</span></li>
                </ol>
              </nav>
              <h1 className="text-2xl font-bold text-gray-900">Mint Queue Management</h1>
              <p className="text-sm text-gray-500">Review and approve NFT minting requests</p>
            </div>
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
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Requests</dt>
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
                  <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm">⏳</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Pending</dt>
                    <dd className="text-2xl font-semibold text-gray-900">{stats.pending}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm">✅</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Approved</dt>
                    <dd className="text-2xl font-semibold text-gray-900">{stats.approved}</dd>
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
                    <span className="text-white text-sm">🎯</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Minted</dt>
                    <dd className="text-2xl font-semibold text-gray-900">{stats.minted}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <div className="flex space-x-4">
            {(['all', 'pending', 'approved', 'minting', 'minted', 'failed'] as const).map((status) => (
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
                  {status === 'all' ? requests.length : requests.filter(r => r.status === status).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Mint Requests List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredRequests.map((request) => (
              <li key={request.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 bg-gray-300 rounded-lg flex items-center justify-center">
                          <span className="text-gray-600 text-sm">🎬</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-gray-900">{request.title}</p>
                          <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[request.status]}`}>
                            {request.status}
                          </span>
                          <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColors[request.priority]}`}>
                            {request.priority} priority
                          </span>
                        </div>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <span>By {request.animator}</span>
                          <span className="mx-2">•</span>
                          <span>QC: {Math.round(request.metadata.qcScore * 100)}%</span>
                          <span className="mx-2">•</span>
                          <span>{request.blockchain.network}</span>
                          {request.txHash && (
                            <>
                              <span className="mx-2">•</span>
                              <code className="bg-gray-100 px-1 rounded text-xs">{request.txHash.slice(0, 10)}...</code>
                            </>
                          )}
                        </div>
                        <div className="mt-1 flex items-center space-x-4 text-xs text-gray-500">
                          <span className={request.metadata.hasDepthMap ? 'text-green-600' : 'text-gray-400'}>
                            {request.metadata.hasDepthMap ? '✓' : '✗'} Depth Map
                          </span>
                          <span className={request.metadata.hasAdAnchors ? 'text-green-600' : 'text-gray-400'}>
                            {request.metadata.hasAdAnchors ? '✓' : '✗'} Ad Anchors
                          </span>
                          <span className={request.metadata.isrcReserved ? 'text-green-600' : 'text-gray-400'}>
                            {request.metadata.isrcReserved ? '✓' : '✗'} ISRC
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {request.status === 'pending' && (
                        <button
                          onClick={() => handleApprove(request.id)}
                          disabled={processing === request.id}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                        >
                          {processing === request.id ? 'Approving...' : 'Approve'}
                        </button>
                      )}
                      
                      {request.status === 'approved' && (
                        <>
                          <button
                            onClick={() => handleMint(request.id, 'testnet')}
                            disabled={processing === request.id}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                          >
                            {processing === request.id ? 'Minting...' : 'Mint Testnet'}
                          </button>
                          <button
                            onClick={() => handleMint(request.id, 'mainnet')}
                            disabled={processing === request.id}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                          >
                            {processing === request.id ? 'Minting...' : 'Mint Mainnet'}
                          </button>
                        </>
                      )}
                      
                      {request.status === 'minting' && (
                        <div className="flex items-center text-sm text-purple-600">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Minting...
                        </div>
                      )}
                      
                      {request.status === 'minted' && (
                        <span className="inline-flex items-center px-3 py-2 text-sm font-medium text-green-800">
                          ✓ Minted
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {filteredRequests.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No mint requests found</h3>
            <p className="mt-1 text-sm text-gray-500">
              No mint requests match the current filter criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}