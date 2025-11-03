'use client';

/**
 * Asset Hub - 2.5D Holographic Media Player & Asset Management
 * Central hub with holographic animations and depth effects
 */

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface Asset {
  id: string;
  title: string;
  artist: string;
  type: 'audio' | 'video' | 'animation' | '3d';
  duration?: string;
  size: string;
  status: 'approved' | 'pending' | 'rejected';
  thumbnail: string;
  url: string;
  metadata: {
    genre?: string;
    bpm?: number;
    key?: string;
    tags: string[];
  };
}

const mockAssets: Asset[] = [
  {
    id: '1',
    title: 'Afrofuturism Beat',
    artist: 'Digital Griot',
    type: 'audio',
    duration: '3:45',
    size: '8.2 MB',
    status: 'approved',
    thumbnail: '/api/placeholder/300/300',
    url: '/audio/sample1.mp3',
    metadata: { genre: 'Afrobeat', bpm: 120, key: 'C Major', tags: ['electronic', 'traditional', 'fusion'] }
  },
  {
    id: '2',
    title: 'Holographic Dance',
    artist: 'Verse Animator',
    type: 'animation',
    duration: '2:30',
    size: '45.1 MB',
    status: 'approved',
    thumbnail: '/api/placeholder/300/300',
    url: '/animations/dance.json',
    metadata: { tags: ['2.5d', 'holographic', 'cultural'] }
  },
  {
    id: '3',
    title: 'Ancient Future Mask',
    artist: 'Cultural Tech',
    type: '3d',
    size: '12.5 MB',
    status: 'pending',
    thumbnail: '/api/placeholder/300/300',
    url: '/models/mask.glb',
    metadata: { tags: ['cultural', 'artifact', 'wearable'] }
  }
];

export default function AssetHub() {
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [filter, setFilter] = useState<'all' | 'audio' | 'video' | 'animation' | '3d'>('all');
  const [visualizerData, setVisualizerData] = useState<number[]>(Array(32).fill(0));
  const audioRef = useRef<HTMLAudioElement>(null);

  const filteredAssets = mockAssets.filter(asset => 
    filter === 'all' || asset.type === filter
  );

  // Simulate audio visualizer data
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setVisualizerData(prev => 
          prev.map(() => Math.random() * 100)
        );
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  const handlePlay = (asset: Asset) => {
    setSelectedAsset(asset);
    if (asset.type === 'audio') {
      setIsPlaying(true);
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'mv-status-success';
      case 'pending': return 'mv-status-pending';
      case 'rejected': return 'mv-status-error';
      default: return 'mv-status-pending';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'audio': return '◆';
      case 'video': return '◇';
      case 'animation': return '◈';
      case '3d': return '◉';
      default: return '◯';
    }
  };

  return (
    <div className="mighty-verse-app min-h-screen">
      {/* Navigation */}
      <div className="mv-nav mx-4 mt-4">
        <div className="mv-nav-brand">
          <Link href="/" className="mv-heading-lg hover:mv-text-accent transition-colors">
            ◆ The Mighty Verse
          </Link>
        </div>
        <div className="mv-nav-links">
          <Link href="/admin" className="mv-nav-link">Admin</Link>
          <Link href="/animator" className="mv-nav-link">Animator</Link>
          <Link href="/deck" className="mv-nav-link">Deck Viewer</Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12 mv-fade-in">
          <h1 className="mv-heading-xl mb-4">◈ Asset Hub ◈</h1>
          <p className="mv-text-muted text-lg">2.5D Holographic Media Experience</p>
        </div>

        {/* 2.5D Holographic Media Player */}
        {selectedAsset && (
          <div className="mv-player mv-holographic mb-8 mv-fade-in relative overflow-hidden">
            {/* Holographic Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="grid grid-cols-8 gap-1 h-full">
                {Array.from({length: 64}).map((_, i) => (
                  <div 
                    key={i}
                    className="bg-gradient-to-t from-yellow-400 to-green-400 rounded-sm"
                    style={{
                      height: `${Math.sin(Date.now() * 0.001 + i * 0.1) * 20 + 30}%`,
                      animation: `pulse ${2 + (i % 3)}s ease-in-out infinite`
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Player Content */}
            <div className="relative z-10">
              <div className="flex items-center space-x-6 mb-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-400 via-green-400 to-blue-400 flex items-center justify-center text-3xl font-bold shadow-2xl transform hover:scale-110 transition-all duration-500">
                  <span className="text-black animate-pulse">{getTypeIcon(selectedAsset.type)}</span>
                </div>
                <div className="flex-1">
                  <h3 className="mv-heading-md mb-1">{selectedAsset.title}</h3>
                  <p className="mv-text-accent">by {selectedAsset.artist}</p>
                </div>
                <div className={`${getStatusColor(selectedAsset.status)} shadow-lg`}>
                  {selectedAsset.status}
                </div>
              </div>

              {/* Audio Visualizer & Controls */}
              {selectedAsset.type === 'audio' && (
                <>
                  {/* 2.5D Audio Visualizer */}
                  <div className="mb-6 p-6 bg-black/20 rounded-2xl backdrop-blur-sm">
                    <div className="flex items-end justify-center space-x-1 h-32 mb-4">
                      {visualizerData.map((height, i) => (
                        <div
                          key={i}
                          className="bg-gradient-to-t from-yellow-400 via-green-400 to-blue-400 rounded-t-lg transition-all duration-100 shadow-lg"
                          style={{
                            width: '8px',
                            height: `${height}%`,
                            transform: `perspective(100px) rotateX(${height * 0.2}deg)`,
                            boxShadow: `0 ${height * 0.1}px ${height * 0.2}px rgba(212, 175, 55, 0.3)`
                          }}
                        />
                      ))}
                    </div>
                    
                    {/* Holographic Controls */}
                    <div className="mv-player-controls">
                      <button 
                        onClick={togglePlayPause}
                        className="mv-player-button bg-gradient-to-br from-yellow-400 to-green-400 text-black text-xl font-bold shadow-2xl transform hover:scale-125 transition-all duration-300"
                        style={{
                          boxShadow: '0 8px 32px rgba(212, 175, 55, 0.4), inset 0 2px 0 rgba(255, 255, 255, 0.3)'
                        }}
                      >
                        {isPlaying ? '◼' : '▶'}
                      </button>
                      <div className="mv-player-progress bg-white/5 border border-white/10">
                        <div 
                          className="h-full bg-gradient-to-r from-yellow-400 via-green-400 to-blue-400 transition-all duration-300 shadow-lg"
                          style={{ 
                            width: `${duration ? (currentTime / duration) * 100 : 0}%`,
                            boxShadow: '0 0 20px rgba(212, 175, 55, 0.5)'
                          }}
                        />
                      </div>
                      <span className="mv-text-muted text-sm font-mono">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    </div>
                  </div>
                  <audio ref={audioRef} src={selectedAsset.url} />
                </>
              )}

              {/* 2.5D Animation Player */}
              {selectedAsset.type === 'animation' && (
                <div className="mb-6 p-8 bg-black/20 rounded-2xl backdrop-blur-sm relative overflow-hidden">
                  <div className="aspect-video bg-gradient-to-br from-black/40 to-black/20 rounded-xl flex items-center justify-center relative">
                    {/* Holographic Animation Placeholder */}
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-yellow-400 via-green-400 to-blue-400 animate-spin shadow-2xl">
                        <div className="absolute inset-4 rounded-full bg-black/50 flex items-center justify-center">
                          <span className="text-white text-2xl font-bold">◈</span>
                        </div>
                      </div>
                      <div className="absolute -inset-8 rounded-full border-2 border-yellow-400/30 animate-pulse"></div>
                      <div className="absolute -inset-12 rounded-full border border-green-400/20 animate-ping"></div>
                    </div>
                  </div>
                  <div className="text-center mt-4">
                    <span className="mv-text-muted">2.5D Holographic Animation Player</span>
                  </div>
                </div>
              )}

              {/* 3D Model Viewer */}
              {selectedAsset.type === '3d' && (
                <div className="mb-6 p-8 bg-black/20 rounded-2xl backdrop-blur-sm">
                  <div className="aspect-square bg-gradient-to-br from-black/40 to-black/20 rounded-xl flex items-center justify-center relative overflow-hidden">
                    <div className="relative transform-gpu">
                      <div 
                        className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-green-400 rounded-2xl shadow-2xl"
                        style={{
                          transform: 'perspective(200px) rotateX(15deg) rotateY(15deg)',
                          animation: 'float 4s ease-in-out infinite'
                        }}
                      >
                        <div className="absolute inset-2 bg-black/30 rounded-xl flex items-center justify-center">
                          <span className="text-white text-xl font-bold">◉</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-center mt-4">
                    <span className="mv-text-muted">3D Holographic Model Viewer</span>
                  </div>
                </div>
              )}

              {/* Enhanced Metadata Display */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                  <span className="mv-text-muted">Type:</span>
                  <span className="ml-2 text-white font-semibold">{selectedAsset.type}</span>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                  <span className="mv-text-muted">Size:</span>
                  <span className="ml-2 text-white font-semibold">{selectedAsset.size}</span>
                </div>
                {selectedAsset.duration && (
                  <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                    <span className="mv-text-muted">Duration:</span>
                    <span className="ml-2 text-white font-semibold">{selectedAsset.duration}</span>
                  </div>
                )}
              </div>

              {/* Holographic Tags */}
              <div className="flex flex-wrap gap-2">
                {selectedAsset.metadata.tags.map((tag, idx) => (
                  <span 
                    key={idx} 
                    className="bg-gradient-to-r from-white/10 to-white/5 border border-white/20 px-4 py-2 rounded-full text-sm mv-text-muted hover:from-yellow-400/20 hover:to-green-400/20 transition-all duration-300 cursor-pointer"
                  >
                    ◆ {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Filters */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          {[
            { key: 'all', label: 'All Assets', icon: '◯' },
            { key: 'audio', label: 'Audio', icon: '◆' },
            { key: 'animation', label: 'Animations', icon: '◈' },
            { key: '3d', label: '3D Models', icon: '◉' }
          ].map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setFilter(key as any)}
              className={`px-6 py-3 rounded-xl transition-all duration-500 flex items-center space-x-2 ${
                filter === key 
                  ? 'mv-button shadow-2xl transform scale-105' 
                  : 'mv-button-secondary hover:scale-105'
              }`}
            >
              <span className="text-lg">{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* 2.5D Asset Grid */}
        <div className="mv-asset-grid">
          {filteredAssets.map((asset, index) => (
            <div 
              key={asset.id} 
              className="mv-asset-card mv-holographic group cursor-pointer transform-gpu"
              onClick={() => handlePlay(asset)}
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              <div className="mv-asset-preview relative overflow-hidden">
                {/* 2.5D Background Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-green-400/10 to-blue-400/10"></div>
                
                {/* Floating Icon */}
                <div 
                  className="text-8xl opacity-30 group-hover:opacity-60 transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-12"
                  style={{
                    transform: 'perspective(100px) rotateX(10deg)',
                    textShadow: '0 10px 20px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  {getTypeIcon(asset.type)}
                </div>
                
                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <span className={`${getStatusColor(asset.status)} text-xs shadow-lg`}>
                    {asset.status}
                  </span>
                </div>
                
                {/* Duration Badge */}
                {asset.duration && (
                  <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-white border border-white/20">
                    {asset.duration}
                  </div>
                )}
              </div>
              
              <div className="mv-asset-info">
                <h3 className="mv-asset-title group-hover:text-yellow-400 transition-colors duration-300">{asset.title}</h3>
                <div className="mv-asset-meta">
                  <span>by {asset.artist}</span>
                  <span className="font-mono">{asset.size}</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-3">
                  {asset.metadata.tags.slice(0, 2).map((tag, idx) => (
                    <span key={idx} className="bg-white/10 border border-white/20 px-2 py-1 rounded-full text-xs mv-text-muted">
                      ◆ {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Upload Section */}
        <div className="mv-card mv-holographic p-12 text-center mt-16 relative overflow-hidden">
          <div className="relative z-10">
            <div className="text-8xl mb-6 animate-bounce">◈</div>
            <h3 className="mv-heading-md mb-4">Upload New Asset</h3>
            <p className="mv-text-muted mb-8 text-lg">Share your 2.5D holographic creations with the Mighty Verse</p>
            <Link href="/animator/upload">
              <button className="mv-button text-lg px-8 py-4 shadow-2xl transform hover:scale-110 transition-all duration-500">
                ◆ Start Upload ◆
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}