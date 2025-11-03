'use client';

/**
 * Deck Viewer Page
 * Interactive 2.5D deck viewing experience
 */

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { HeroCanvas } from './components/HeroCanvas';
import { DeckViewer } from './components/DeckViewer';
import { DeckCard } from './components/DeckCard';

interface DeckManifest {
  id: string;
  title: string;
  artist: string;
  description: string;
  totalCards: number;
  duration: number;
  animatorVersions: string[];
  defaultVersion: string;
  cards: CardData[];
  metadata: {
    genre: string;
    tags: string[];
    releaseDate: string;
    isrc?: string;
  };
}

interface CardData {
  id: string;
  title: string;
  startFrame: number;
  endFrame: number;
  duration: number;
  animatorVersion: string;
  manifestCid: string;
  layers: {
    background: string;
    midground: string;
    foreground: string;
    depthMapCid?: string;
  };
  adAnchors?: AdAnchor[];
  metadata: {
    confidence: number;
    qcScore: number;
    tags: string[];
  };
}

interface AdAnchor {
  id: string;
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
  confidence: number;
  enabled: boolean;
}

const mockDeckManifest: DeckManifest = {
  id: 'deck_001',
  title: 'Super Hero Ego',
  artist: 'Golden Shovel',
  description: 'A visual journey through the verses of Super Hero Ego',
  totalCards: 8,
  duration: 240,
  animatorVersions: ['futuristic', 'gritty', 'minimalist'],
  defaultVersion: 'futuristic',
  cards: [
    {
      id: 'card_001',
      title: 'Intro - Setting the Scene',
      startFrame: 0,
      endFrame: 480,
      duration: 30,
      animatorVersion: 'futuristic',
      manifestCid: 'bafybeig...',
      layers: {
        background: 'ipfs://bg1.jpg',
        midground: 'ipfs://mg1.jpg',
        foreground: 'ipfs://fg1.jpg',
        depthMapCid: 'ipfs://depth1.jpg'
      },
      adAnchors: [
        {
          id: 'anchor_001',
          x: 0.2,
          y: 0.3,
          z: 0.5,
          width: 0.15,
          height: 0.1,
          confidence: 0.92,
          enabled: true
        }
      ],
      metadata: {
        confidence: 0.94,
        qcScore: 0.91,
        tags: ['intro', 'urban', 'night']
      }
    },
    {
      id: 'card_002',
      title: 'Verse 1 - The Journey Begins',
      startFrame: 480,
      endFrame: 960,
      duration: 30,
      animatorVersion: 'futuristic',
      manifestCid: 'bafybeih...',
      layers: {
        background: 'ipfs://bg2.jpg',
        midground: 'ipfs://mg2.jpg',
        foreground: 'ipfs://fg2.jpg',
        depthMapCid: 'ipfs://depth2.jpg'
      },
      metadata: {
        confidence: 0.88,
        qcScore: 0.85,
        tags: ['verse', 'movement', 'energy']
      }
    }
  ],
  metadata: {
    genre: 'Hip Hop',
    tags: ['golden shovel', 'urban', 'storytelling'],
    releaseDate: '2025-01-27',
    isrc: 'ZAMV125001234'
  }
};

export default function DeckViewerPage() {
  const params = useParams();
  const deckId = params.deckId as string;
  
  const [deckManifest, setDeckManifest] = useState<DeckManifest | null>(null);
  const [currentCard, setCurrentCard] = useState<CardData | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<string>('futuristic');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load deck manifest
    const loadDeckManifest = async () => {
      try {
        // In production, fetch from IPFS/API
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate loading
        setDeckManifest(mockDeckManifest);
        setCurrentCard(mockDeckManifest.cards[0]);
        setSelectedVersion(mockDeckManifest.defaultVersion);
      } catch (error) {
        console.error('Failed to load deck manifest:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDeckManifest();
  }, [deckId]);

  const handleCardSelect = (card: CardData) => {
    setCurrentCard(card);
    setCurrentTime(card.startFrame / 16); // Assuming 16 FPS
  };

  const handleVersionChange = (version: string) => {
    setSelectedVersion(version);
    // Filter cards by version and update current card
    const versionCards = deckManifest?.cards.filter(card => card.animatorVersion === version) || [];
    if (versionCards.length > 0) {
      setCurrentCard(versionCards[0]);
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = (time: number) => {
    setCurrentTime(time);
    
    // Auto-select card based on current time
    if (deckManifest) {
      const frameTime = time * 16; // Convert to frames
      const activeCard = deckManifest.cards.find(card => 
        frameTime >= card.startFrame && frameTime <= card.endFrame
      );
      if (activeCard && activeCard.id !== currentCard?.id) {
        setCurrentCard(activeCard);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Loading deck...</p>
        </div>
      </div>
    );
  }

  if (!deckManifest || !currentCard) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Deck Not Found</h1>
          <p className="text-gray-400">The requested deck could not be loaded.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Canvas - 2.5D Visualization */}
      <div className="relative h-screen">
        <HeroCanvas
          card={currentCard}
          isPlaying={isPlaying}
          currentTime={currentTime}
          onTimeUpdate={handleTimeUpdate}
          animatorVersion={selectedVersion}
        />
        
        {/* Overlay Controls */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/50 to-transparent p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">{deckManifest.title}</h1>
              <p className="text-xl text-gray-300 mb-1">{deckManifest.artist}</p>
              <p className="text-sm text-gray-400">{deckManifest.description}</p>
            </div>
            
            {/* Version Selector */}
            <div className="bg-black/70 rounded-lg p-4">
              <label className="block text-sm font-medium mb-2">Animator Version</label>
              <select
                value={selectedVersion}
                onChange={(e) => handleVersionChange(e.target.value)}
                className="bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
              >
                {deckManifest.animatorVersions.map(version => (
                  <option key={version} value={version}>
                    {version.charAt(0).toUpperCase() + version.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/70 to-transparent p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={handlePlayPause}
                className="bg-blue-600 hover:bg-blue-700 rounded-full p-3 transition-colors"
              >
                {isPlaying ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                )}
              </button>
              
              <div className="text-sm">
                <span className="text-white">{Math.floor(currentTime / 60)}:{(currentTime % 60).toFixed(0).padStart(2, '0')}</span>
                <span className="text-gray-400"> / {Math.floor(deckManifest.duration / 60)}:{(deckManifest.duration % 60).toString().padStart(2, '0')}</span>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm text-gray-400">Current Card</p>
              <p className="font-medium">{currentCard.title}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentTime / deckManifest.duration) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Deck Viewer - Card Grid */}
      <div className="container mx-auto px-6 py-12">
        <DeckViewer
          cards={deckManifest.cards.filter(card => card.animatorVersion === selectedVersion)}
          currentCard={currentCard}
          onCardSelect={handleCardSelect}
          animatorVersion={selectedVersion}
        />
      </div>

      {/* Deck Metadata */}
      <div className="container mx-auto px-6 pb-12">
        <div className="bg-gray-900 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Deck Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-gray-300 mb-2">Details</h4>
              <p className="text-sm text-gray-400">Genre: {deckManifest.metadata.genre}</p>
              <p className="text-sm text-gray-400">Cards: {deckManifest.totalCards}</p>
              <p className="text-sm text-gray-400">Duration: {Math.floor(deckManifest.duration / 60)}:{(deckManifest.duration % 60).toString().padStart(2, '0')}</p>
              {deckManifest.metadata.isrc && (
                <p className="text-sm text-gray-400">ISRC: {deckManifest.metadata.isrc}</p>
              )}
            </div>
            
            <div>
              <h4 className="font-medium text-gray-300 mb-2">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {deckManifest.metadata.tags.map(tag => (
                  <span
                    key={tag}
                    className="bg-gray-800 text-gray-300 px-2 py-1 rounded text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-300 mb-2">Versions</h4>
              <div className="space-y-1">
                {deckManifest.animatorVersions.map(version => (
                  <p key={version} className="text-sm text-gray-400">
                    {version.charAt(0).toUpperCase() + version.slice(1)}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}