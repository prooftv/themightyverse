'use client';

/**
 * Animator Dashboard - Main Overview
 * Portal for animators to manage submissions and track progress
 */

import React, { useState, useEffect } from 'react';
import { useRBAC } from '../auth/rbac-provider';
import Link from 'next/link';

interface Submission {
  id: string;
  title: string;
  status: 'uploading' | 'pending' | 'reviewing' | 'approved' | 'rejected';
  submittedAt: string;
  confidence?: number;
  feedback?: string;
}

const mockSubmissions: Submission[] = [
  {
    id: 'sub_001',
    title: 'Super Hero Ego - Verse 1',
    status: 'approved',
    submittedAt: '2025-01-25T14:30:00Z',
    confidence: 0.92
  },
  {
    id: 'sub_002',
    title: 'Golden Era - Intro Scene', 
    status: 'reviewing',
    submittedAt: '2025-01-26T10:15:00Z',
    confidence: 0.76,
    feedback: 'Depth map quality needs improvement'
  },
  {
    id: 'sub_003',
    title: 'Mighty Verse - Outro',
    status: 'pending',
    submittedAt: '2025-01-27T08:45:00Z'
  }
];

const statusColors = {
  uploading: 'bg-gray-100 text-gray-800',
  pending: 'bg-yellow-100 text-yellow-800',
  reviewing: 'bg-blue-100 text-blue-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800'
};

export default function AnimatorDashboard() {
  const { isAnimator, isAdmin, wallet, loading } = useRBAC();
  const [submissions, setSubmissions] = useState<Submission[]>(mockSubmissions);

  const canAccess = isAnimator || isAdmin;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!canAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">Animator privileges required</p>
          <p className="text-sm text-gray-500 mt-2">Current wallet: {wallet}</p>
        </div>
      </div>
    );
  }

  const stats = {
    total: submissions.length,
    approved: submissions.filter(s => s.status === 'approved').length,
    pending: submissions.filter(s => s.status === 'pending' || s.status === 'reviewing').length,
    rejected: submissions.filter(s => s.status === 'rejected').length
  };

  return (
    <div className="mighty-verse-app min-h-screen">
      {/* Header */}
      <div className="mv-nav mx-4 mt-4">
        <div className="mv-nav-brand">
          <h1 className="mv-heading-lg">◈ Animator Portal</h1>
          <p className="mv-text-muted text-sm">Upload and manage your 2.5D holographic animations</p>
        </div>
        <div className="mv-text-muted text-sm">
          Animator: <code className="bg-white/10 px-2 py-1 rounded text-yellow-400">{wallet?.slice(0, 8)}...</code>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-4 mb-8">
          <div className="mv-card mv-holographic p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-green-400 rounded-xl flex items-center justify-center">
                <span className="text-black text-lg font-bold">◯</span>
              </div>
              <div className="flex-1">
                <div className="mv-text-muted text-sm mb-1">Total Submissions</div>
                <div className="text-2xl font-bold text-white">{stats.total}</div>
              </div>
            </div>
          </div>

          <div className="mv-card mv-holographic p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-400 rounded-xl flex items-center justify-center">
                <span className="text-black text-lg font-bold">◆</span>
              </div>
              <div className="flex-1">
                <div className="mv-text-muted text-sm mb-1">Approved</div>
                <div className="text-2xl font-bold text-white">{stats.approved}</div>
              </div>
            </div>
          </div>

          <div className="mv-card mv-holographic p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-xl flex items-center justify-center">
                <span className="text-black text-lg font-bold">◈</span>
              </div>
              <div className="flex-1">
                <div className="mv-text-muted text-sm mb-1">Pending Review</div>
                <div className="text-2xl font-bold text-white">{stats.pending}</div>
              </div>
            </div>
          </div>

          <div className="mv-card mv-holographic p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-pink-400 rounded-xl flex items-center justify-center">
                <span className="text-black text-lg font-bold">◇</span>
              </div>
              <div className="flex-1">
                <div className="mv-text-muted text-sm mb-1">Rejected</div>
                <div className="text-2xl font-bold text-white">{stats.rejected}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="mv-heading-md mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <Link href="/animator/upload">
              <div className="mv-card mv-holographic p-8 cursor-pointer group text-center border-2 border-dashed border-white/20 hover:border-yellow-400/50">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-500">◈</div>
                <h3 className="mv-heading-md mb-2">Upload New Asset</h3>
                <p className="mv-text-muted text-sm">Submit a new 2.5D holographic animation</p>
              </div>
            </Link>

            <Link href="/animator/submissions">
              <div className="mv-card p-8 cursor-pointer group text-center">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-500">◆</div>
                <h3 className="mv-heading-md mb-2">View Submissions</h3>
                <p className="mv-text-muted text-sm">Track status of your submissions</p>
              </div>
            </Link>

            <div className="mv-card p-8 text-center group">
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-500">◉</div>
              <h3 className="mv-heading-md mb-2">Guidelines</h3>
              <p className="mv-text-muted text-sm">Review submission requirements</p>
            </div>
          </div>
        </div>

        {/* Recent Submissions */}
        <div className="mv-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="mv-heading-md">Recent Submissions</h3>
            <Link href="/animator/submissions" className="text-sm text-yellow-400 hover:text-yellow-300 transition-colors">
              View all
            </Link>
          </div>
            
          <div className="space-y-6">
            {submissions.slice(0, 3).map((submission) => (
              <div key={submission.id} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-400 rounded-xl flex items-center justify-center">
                    <span className="text-black text-lg font-bold">◈</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">{submission.title}</p>
                    <div className="flex items-center mt-1 text-sm mv-text-muted">
                      <span>{new Date(submission.submittedAt).toLocaleDateString()}</span>
                      {submission.confidence && (
                        <>
                          <span className="mx-2">•</span>
                          <span className={`font-medium ${submission.confidence >= 0.8 ? 'text-green-400' : 'text-yellow-400'}`}>
                            {Math.round(submission.confidence * 100)}% confidence
                          </span>
                        </>
                      )}
                    </div>
                    {submission.feedback && (
                      <p className="mt-1 text-sm mv-text-muted">{submission.feedback}</p>
                    )}
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  submission.status === 'approved' ? 'mv-status-success' :
                  submission.status === 'rejected' ? 'mv-status-error' :
                  'mv-status-pending'
                }`}>
                  {submission.status}
                </span>
              </div>
            ))}
          </div>

          {submissions.length === 0 && (
            <div className="text-center py-12">
              <div className="text-8xl mb-6">◈</div>
              <h3 className="mv-heading-md mb-2">No submissions yet</h3>
              <p className="mv-text-muted mb-6">Get started by uploading your first 2.5D holographic animation</p>
              <Link href="/animator/upload">
                <button className="mv-button">
                  ◆ Upload Asset ◆
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}