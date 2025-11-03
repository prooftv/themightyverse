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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Animator Portal</h1>
              <p className="mt-1 text-sm text-gray-500">Upload and manage your animation submissions</p>
            </div>
            <div className="text-sm text-gray-500">
              Animator: <code className="bg-gray-100 px-2 py-1 rounded">{wallet?.slice(0, 8)}...</code>
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
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Submissions</dt>
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
                  <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm">⏳</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Pending Review</dt>
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
                  <div className="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm">❌</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Rejected</dt>
                    <dd className="text-2xl font-semibold text-gray-900">{stats.rejected}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Link href="/animator/upload">
              <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer border-2 border-dashed border-gray-300 hover:border-blue-500">
                <div className="text-center">
                  <div className="text-4xl mb-3">📤</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Upload New Asset</h3>
                  <p className="text-sm text-gray-500">Submit a new animation for review</p>
                </div>
              </div>
            </Link>

            <Link href="/animator/submissions">
              <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer">
                <div className="text-center">
                  <div className="text-4xl mb-3">📋</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">View Submissions</h3>
                  <p className="text-sm text-gray-500">Track status of your submissions</p>
                </div>
              </div>
            </Link>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-center">
                <div className="text-4xl mb-3">📚</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Guidelines</h3>
                <p className="text-sm text-gray-500">Review submission requirements</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Submissions */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Submissions</h3>
              <Link href="/animator/submissions" className="text-sm text-blue-600 hover:text-blue-500">
                View all
              </Link>
            </div>
            
            <div className="space-y-4">
              {submissions.slice(0, 3).map((submission) => (
                <div key={submission.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 bg-gray-300 rounded-lg flex items-center justify-center">
                        <span className="text-gray-600 text-sm">🎬</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">{submission.title}</p>
                      <div className="flex items-center mt-1 text-sm text-gray-500">
                        <span>{new Date(submission.submittedAt).toLocaleDateString()}</span>
                        {submission.confidence && (
                          <>
                            <span className="mx-2">•</span>
                            <span className={`font-medium ${submission.confidence >= 0.8 ? 'text-green-600' : 'text-yellow-600'}`}>
                              {Math.round(submission.confidence * 100)}% confidence
                            </span>
                          </>
                        )}
                      </div>
                      {submission.feedback && (
                        <p className="mt-1 text-sm text-gray-600">{submission.feedback}</p>
                      )}
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[submission.status]}`}>
                    {submission.status}
                  </span>
                </div>
              ))}
            </div>

            {submissions.length === 0 && (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🎨</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions yet</h3>
                <p className="text-sm text-gray-500 mb-4">Get started by uploading your first animation</p>
                <Link
                  href="/animator/upload"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Upload Asset
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}