'use client';

import React, { useState } from 'react';

interface MediaRendererProps {
  fileCid?: string;
  thumbnailCid?: string;
  mimeType?: string;
  fileName?: string;
  className?: string;
}

export default function MediaRenderer({ 
  fileCid, 
  thumbnailCid, 
  mimeType, 
  fileName,
  className = "w-full h-48 object-cover rounded-lg"
}: MediaRendererProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  const gateway = process.env.NEXT_PUBLIC_IPFS_GATEWAY || 'https://gateway.pinata.cloud/ipfs/';
  
  if (!fileCid) {
    return (
      <div className={`${className} bg-white/5 border border-white/10 rounded-lg flex items-center justify-center`}>
        <div className="text-center">
          <div className="text-4xl mb-2">📄</div>
          <div className="text-sm mv-text-muted">No preview available</div>
        </div>
      </div>
    );
  }

  const fileUrl = `${gateway}${fileCid}`;
  const thumbnailUrl = thumbnailCid ? `${gateway}${thumbnailCid}` : null;

  if (error) {
    return (
      <div className={`${className} bg-white/5 border border-white/10 rounded-lg flex items-center justify-center`}>
        <div className="text-center">
          <div className="text-4xl mb-2">⚠️</div>
          <div className="text-sm mv-text-muted">Failed to load media</div>
          <div className="text-xs mv-text-muted mt-1">{fileName}</div>
        </div>
      </div>
    );
  }

  // Image rendering
  if (mimeType?.startsWith('image/')) {
    return (
      <div className="relative">
        <img
          src={thumbnailUrl || fileUrl}
          alt={fileName || 'Media asset'}
          className={className}
          onLoad={() => setLoading(false)}
          onError={() => setError(true)}
        />
        {loading && (
          <div className={`${className} absolute inset-0 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center`}>
            <div className="animate-spin text-2xl">◈</div>
          </div>
        )}
      </div>
    );
  }

  // Audio rendering
  if (mimeType?.startsWith('audio/')) {
    return (
      <div className={`${className} bg-white/5 border border-white/10 rounded-lg p-4`}>
        <div className="flex items-center space-x-4 h-full">
          <div className="text-4xl">🎵</div>
          <div className="flex-1">
            <div className="text-white font-medium mb-2">{fileName}</div>
            <audio 
              controls 
              className="w-full"
              onLoadStart={() => setLoading(false)}
              onError={() => setError(true)}
            >
              <source src={fileUrl} type={mimeType} />
              Your browser does not support audio playback.
            </audio>
          </div>
        </div>
      </div>
    );
  }

  // Video and Animation rendering
  if (mimeType?.startsWith('video/') || fileName?.match(/\.(mp4|mov|webm|gif)$/i)) {
    return (
      <div className="relative">
        <video
          controls
          autoPlay={fileName?.includes('.gif')}
          loop={fileName?.includes('.gif')}
          muted={fileName?.includes('.gif')}
          className={className}
          poster={thumbnailUrl}
          onLoadStart={() => setLoading(false)}
          onError={() => setError(true)}
        >
          <source src={fileUrl} type={mimeType || 'video/mp4'} />
          Your browser does not support video playback.
        </video>
        {loading && (
          <div className={`${className} absolute inset-0 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center`}>
            <div className="animate-spin text-2xl">◈</div>
          </div>
        )}
      </div>
    );
  }

  // 3D Model placeholder
  if (mimeType?.includes('model') || fileName?.match(/\.(fbx|obj|glb|gltf)$/i)) {
    return (
      <div className={`${className} bg-white/5 border border-white/10 rounded-lg flex items-center justify-center`}>
        <div className="text-center">
          <div className="text-4xl mb-2">🎲</div>
          <div className="text-sm text-white mb-1">3D Model</div>
          <div className="text-xs mv-text-muted">{fileName}</div>
          <a 
            href={fileUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-yellow-400 hover:text-yellow-300 mt-2 inline-block"
          >
            Download to view
          </a>
        </div>
      </div>
    );
  }

  // Generic file
  return (
    <div className={`${className} bg-white/5 border border-white/10 rounded-lg flex items-center justify-center`}>
      <div className="text-center">
        <div className="text-4xl mb-2">📄</div>
        <div className="text-sm text-white mb-1">{fileName}</div>
        <div className="text-xs mv-text-muted mb-2">{mimeType}</div>
        <a 
          href={fileUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs text-yellow-400 hover:text-yellow-300"
        >
          Download
        </a>
      </div>
    </div>
  );
}