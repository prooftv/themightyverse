'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import HolographicPlayer from '../../components/HolographicPlayer';
import Breadcrumb from '../../components/Breadcrumb';

const mockContent = [
  {
    id: '1',
    title: 'Super Hero Ego',
    type: 'animation',
    duration: 225,
    artist: 'Golden Shovel',
    description: 'Holographic animation experience'
  },
  {
    id: '2', 
    title: 'Golden Shovel Theme',
    type: 'audio',
    duration: 180,
    artist: 'Golden Shovel',
    description: 'Immersive audio experience'
  }
];

export default function Animations() {
  const [selectedContent, setSelectedContent] = useState(mockContent[0]);

  const handlePlay = (content) => {
    setSelectedContent(content);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Breadcrumb items={[
        { label: 'Animations', icon: '◈' }
      ]} />
        <div className="text-center mb-16 mv-fade-in">
          <h1 className="mv-heading-xl mb-6">◈ Animations ◈</h1>
          <p className="mv-text-muted text-xl mb-8">
            Gallery of 2.5D holographic cinematic pieces
          </p>
        </div>

        {/* 2.5D Holographic Player */}
        {selectedContent && (
          <div className="mb-8">
            <HolographicPlayer
              title={selectedContent.title}
              artist={selectedContent.artist}
              duration={selectedContent.duration}
              onPlay={() => console.log('Playing:', selectedContent.title)}
              onPause={() => console.log('Paused:', selectedContent.title)}
            />
          </div>
        )}

        {/* Content Grid */}
        <div className="mv-grid-responsive mb-8 sm:mb-16">
          {mockContent.map((content) => (
            <div 
              key={content.id}
              className={`mv-card mv-holographic p-8 cursor-pointer group transition-all duration-300 ${
                selectedContent?.id === content.id ? 'ring-2 ring-yellow-400 scale-105' : 'hover:scale-102'
              }`}
              onClick={() => handlePlay(content)}
            >
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-500">
                {content.type === 'audio' ? '◆' : '◈'}
              </div>
              <h3 className="mv-heading-md mb-2">{content.title}</h3>
              <p className="mv-text-accent mb-2">by {content.artist}</p>
              <p className="mv-text-muted text-sm mb-2">{Math.floor(content.duration / 60)}:{(content.duration % 60).toString().padStart(2, '0')} • {content.type}</p>
              <p className="mv-text-muted text-xs">{content.description}</p>
            </div>
          ))}
        </div>

        <div className="mv-card mv-holographic p-12 text-center">
          <div className="text-8xl mb-6 animate-pulse">◈</div>
          <h2 className="mv-heading-lg mb-4">2.5D Animation Gallery</h2>
          <p className="mv-text-muted text-lg mb-8">
            Immersive holographic experiences with cinematic depth and interactive controls
          </p>
        </div>
    </div>
  );
}