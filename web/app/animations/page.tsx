'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';

const mockContent = [
  {
    id: '1',
    title: 'Golden Shovel Theme',
    type: 'audio',
    duration: '3:45',
    artist: 'The Mighty Verse',
    url: '/audio/sample.mp3'
  },
  {
    id: '2', 
    title: 'Holographic Dance',
    type: 'animation',
    duration: '2:30',
    artist: 'Verse Animator'
  }
];

export default function Animations() {
  const [selectedContent, setSelectedContent] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const handlePlay = (content) => {
    setSelectedContent(content);
    if (content.type === 'audio') {
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

  return (
    <div className="mighty-verse-app min-h-screen">
      <div className="mv-nav mx-4 mt-4">
        <div className="mv-nav-brand">
          <Link href="/" className="mv-heading-lg hover:mv-text-accent transition-colors">
            ◆ The Mighty Verse
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16 mv-fade-in">
          <h1 className="mv-heading-xl mb-6">◈ Animations ◈</h1>
          <p className="mv-text-muted text-xl mb-8">
            Gallery of 2.5D holographic cinematic pieces
          </p>
        </div>

        {/* Audio/Animation Player */}
        {selectedContent && (
          <div className="mv-card mv-holographic p-8 mb-8">
            <div className="flex items-center space-x-6 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-green-400 flex items-center justify-center text-2xl font-bold">
                {selectedContent.type === 'audio' ? '◆' : '◈'}
              </div>
              <div className="flex-1">
                <h3 className="mv-heading-md mb-1">{selectedContent.title}</h3>
                <p className="mv-text-accent">by {selectedContent.artist}</p>
              </div>
            </div>

            {selectedContent.type === 'audio' && (
              <div className="mv-player-controls">
                <button 
                  onClick={togglePlayPause}
                  className="mv-player-button bg-gradient-to-br from-yellow-400 to-green-400 text-black text-xl font-bold"
                >
                  {isPlaying ? '◼' : '▶'}
                </button>
                <div className="mv-player-progress">
                  <div className="mv-player-progress-bar" style={{ width: '30%' }} />
                </div>
                <span className="mv-text-muted text-sm">{selectedContent.duration}</span>
              </div>
            )}
            
            {selectedContent.url && (
              <audio ref={audioRef} src={selectedContent.url} />
            )}
          </div>
        )}

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {mockContent.map((content) => (
            <div 
              key={content.id}
              className="mv-card mv-holographic p-8 cursor-pointer group"
              onClick={() => handlePlay(content)}
            >
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-500">
                {content.type === 'audio' ? '◆' : '◈'}
              </div>
              <h3 className="mv-heading-md mb-2">{content.title}</h3>
              <p className="mv-text-muted mb-2">by {content.artist}</p>
              <p className="mv-text-muted text-sm">{content.duration} • {content.type}</p>
            </div>
          ))}
        </div>

        <div className="mv-card mv-holographic p-12 text-center">
          <div className="text-8xl mb-6 animate-pulse">◈</div>
          <h2 className="mv-heading-lg mb-4">2.5D Animation Gallery</h2>
          <p className="mv-text-muted text-lg mb-8">
            Audio and visual content with holographic depth and cinematic effects
          </p>
        </div>
      </div>
    </div>
  );
}