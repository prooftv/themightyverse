'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function AnimatorUpload() {
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (files: FileList) => {
    setIsUploading(true);
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsUploading(false);
          setUploadProgress(0);
        }, 1000);
      }
    }, 200);
  };

  return (
    <div className="mighty-verse-app min-h-screen">
      <div className="mv-nav mx-4 mt-4">
        <div className="mv-nav-brand">
          <Link href="/animator" className="mv-heading-lg hover:text-yellow-400 transition-colors">
            ◈ Animator / Upload
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="mv-heading-xl mb-4">◈ Upload Asset ◈</h1>
          <p className="mv-text-muted text-lg">Submit your 2.5D holographic creation</p>
        </div>

        {/* Upload Area */}
        <div className="mv-card mv-holographic p-12 mb-8">
          <div
            className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
              dragActive ? 'border-yellow-400 bg-yellow-400/10' : 'border-white/20'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {isUploading ? (
              <div className="space-y-6">
                <div className="text-8xl animate-spin">◈</div>
                <div className="space-y-2">
                  <div className="mv-heading-md">Uploading...</div>
                  <div className="w-full bg-white/10 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-yellow-400 to-green-400 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <div className="mv-text-muted">{uploadProgress}% complete</div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-8xl mb-6">◈</div>
                <div className="space-y-2">
                  <div className="mv-heading-md">Drop your files here</div>
                  <div className="mv-text-muted">or click to browse</div>
                </div>
                <input
                  type="file"
                  multiple
                  accept=".mp4,.mov,.avi,.mp3,.wav,.glb,.fbx,.obj"
                  className="hidden"
                  onChange={(e) => e.target.files && handleFiles(e.target.files)}
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="mv-button cursor-pointer inline-block">
                  ◆ Select Files ◆
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Asset Details Form */}
        <div className="mv-card p-8 space-y-6">
          <h3 className="mv-heading-md mb-6">Asset Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mv-text-muted text-sm mb-2">Title</label>
              <input 
                type="text" 
                className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-yellow-400 focus:outline-none transition-colors"
                placeholder="Enter asset title"
              />
            </div>
            
            <div>
              <label className="block mv-text-muted text-sm mb-2">Type</label>
              <select className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-yellow-400 focus:outline-none transition-colors">
                <option value="">Select type</option>
                <option value="audio">◆ Audio</option>
                <option value="animation">◈ Animation</option>
                <option value="3d">◉ 3D Model</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block mv-text-muted text-sm mb-2">Description</label>
            <textarea 
              className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-yellow-400 focus:outline-none transition-colors h-32 resize-none"
              placeholder="Describe your asset..."
            />
          </div>

          <div>
            <label className="block mv-text-muted text-sm mb-2">Tags</label>
            <input 
              type="text" 
              className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-yellow-400 focus:outline-none transition-colors"
              placeholder="african, futuristic, holographic (comma separated)"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button className="mv-button flex-1">◆ Submit for Review ◆</button>
            <Link href="/animator">
              <button className="mv-button-secondary px-8">Cancel</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}