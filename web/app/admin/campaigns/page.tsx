'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface Campaign {
  id: string;
  name: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  startDate: string;
  endDate: string;
}

const mockCampaigns: Campaign[] = [
  { id: '1', name: 'Afrofuturism Launch', status: 'active', budget: 5000, spent: 1250, impressions: 45000, clicks: 890, startDate: '2025-01-20', endDate: '2025-02-20' },
  { id: '2', name: 'Cultural Heritage', status: 'paused', budget: 3000, spent: 800, impressions: 12000, clicks: 240, startDate: '2025-01-15', endDate: '2025-02-15' },
  { id: '3', name: 'Holographic Art', status: 'draft', budget: 7500, spent: 0, impressions: 0, clicks: 0, startDate: '2025-02-01', endDate: '2025-03-01' }
];

export default function AdminCampaigns() {
  const [campaigns] = useState<Campaign[]>(mockCampaigns);
  const [filter, setFilter] = useState<'all' | 'active' | 'paused' | 'draft'>('all');

  const filteredCampaigns = campaigns.filter(c => filter === 'all' || c.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'mv-status-success';
      case 'paused': return 'mv-status-pending';
      case 'draft': return 'bg-gray-400/10 text-gray-400 border border-gray-400/30 rounded-full px-3 py-1 text-sm';
      case 'completed': return 'bg-blue-400/10 text-blue-400 border border-blue-400/30 rounded-full px-3 py-1 text-sm';
      default: return 'mv-status-pending';
    }
  };

  return (
    <div className="mighty-verse-app min-h-screen">
      <div className="mv-nav mx-4 mt-4">
        <div className="mv-nav-brand">
          <Link href="/admin" className="mv-heading-lg hover:text-yellow-400 transition-colors">
            ◆ Admin / Campaigns
          </Link>
        </div>
        <div>
          <Link href="/admin/campaigns/new">
            <button className="mv-button">◆ New Campaign</button>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="mv-heading-xl mb-4">◈ Campaign Management ◈</h1>
        </div>

        {/* Campaign Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="mv-card mv-holographic p-6 text-center">
            <div className="text-4xl mb-2">◆</div>
            <div className="mv-heading-md">{campaigns.filter(c => c.status === 'active').length}</div>
            <div className="mv-text-muted text-sm">Active</div>
          </div>
          <div className="mv-card mv-holographic p-6 text-center">
            <div className="text-4xl mb-2">◈</div>
            <div className="mv-heading-md">${campaigns.reduce((sum, c) => sum + c.spent, 0).toLocaleString()}</div>
            <div className="mv-text-muted text-sm">Total Spent</div>
          </div>
          <div className="mv-card mv-holographic p-6 text-center">
            <div className="text-4xl mb-2">◉</div>
            <div className="mv-heading-md">{campaigns.reduce((sum, c) => sum + c.impressions, 0).toLocaleString()}</div>
            <div className="mv-text-muted text-sm">Impressions</div>
          </div>
          <div className="mv-card mv-holographic p-6 text-center">
            <div className="text-4xl mb-2">◇</div>
            <div className="mv-heading-md">{campaigns.reduce((sum, c) => sum + c.clicks, 0).toLocaleString()}</div>
            <div className="mv-text-muted text-sm">Clicks</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-8 justify-center">
          {['all', 'active', 'paused', 'draft'].map((status) => (
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

        {/* Campaigns List */}
        <div className="space-y-6">
          {filteredCampaigns.map((campaign) => (
            <div key={campaign.id} className="mv-card mv-holographic p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-green-400 rounded-xl flex items-center justify-center">
                    <span className="text-black text-lg font-bold">◈</span>
                  </div>
                  <div>
                    <h3 className="mv-heading-md">{campaign.name}</h3>
                    <div className="mv-text-muted text-sm">
                      {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className={getStatusColor(campaign.status)}>
                  {campaign.status}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                <div className="bg-white/5 p-3 rounded-xl">
                  <div className="mv-text-muted text-sm">Budget</div>
                  <div className="text-white font-semibold">${campaign.budget.toLocaleString()}</div>
                </div>
                <div className="bg-white/5 p-3 rounded-xl">
                  <div className="mv-text-muted text-sm">Spent</div>
                  <div className="text-white font-semibold">${campaign.spent.toLocaleString()}</div>
                </div>
                <div className="bg-white/5 p-3 rounded-xl">
                  <div className="mv-text-muted text-sm">Impressions</div>
                  <div className="text-white font-semibold">{campaign.impressions.toLocaleString()}</div>
                </div>
                <div className="bg-white/5 p-3 rounded-xl">
                  <div className="mv-text-muted text-sm">Clicks</div>
                  <div className="text-white font-semibold">{campaign.clicks.toLocaleString()}</div>
                </div>
                <div className="bg-white/5 p-3 rounded-xl">
                  <div className="mv-text-muted text-sm">CTR</div>
                  <div className="text-white font-semibold">
                    {campaign.impressions > 0 ? ((campaign.clicks / campaign.impressions) * 100).toFixed(2) : '0.00'}%
                  </div>
                </div>
              </div>

              {/* Budget Progress */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="mv-text-muted">Budget Usage</span>
                  <span className="text-white">{Math.round((campaign.spent / campaign.budget) * 100)}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-yellow-400 to-green-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((campaign.spent / campaign.budget) * 100, 100)}%` }}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button className="mv-button-secondary px-4 py-2 text-sm">◆ Edit</button>
                <button className="mv-button-secondary px-4 py-2 text-sm">◈ Analytics</button>
                {campaign.status === 'active' && (
                  <button className="mv-button-secondary px-4 py-2 text-sm">◇ Pause</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}