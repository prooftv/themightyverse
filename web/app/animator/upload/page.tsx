'use client';

/**
 * Animator Upload Page
 * Form for submitting new animation assets
 */

import React, { useState } from 'react';
import { useRBAC } from '../../auth/rbac-provider';
import Link from 'next/link';

interface UploadForm {
  title: string;
  description: string;
  bgLayer: File | null;
  mgLayer: File | null;
  fgLayer: File | null;
  audioFile: File | null;
  depthMap: File | null;
  contributors: string[];
}

const initialForm: UploadForm = {
  title: '',
  description: '',
  bgLayer: null,
  mgLayer: null,
  fgLayer: null,
  audioFile: null,
  depthMap: null,
  contributors: []
};

export default function AnimatorUpload() {
  const { isAnimator, isAdmin, wallet } = useRBAC();
  const [form, setForm] = useState<UploadForm>(initialForm);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState<string | null>(null);

  const canAccess = isAnimator || isAdmin;

  if (!canAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">Animator privileges required</p>
        </div>
      </div>
    );
  }

  const handleFileUpload = (field: keyof UploadForm, file: File) => {
    setForm(prev => ({ ...prev, [field]: file }));
  };

  const handleDrop = (e: React.DragEvent, field: keyof UploadForm) => {
    e.preventDefault();
    setDragOver(null);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(field, files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.title || !form.bgLayer) {
      alert('Please provide at least a title and background layer');
      return;
    }

    setUploading(true);
    
    try {
      // Simulate upload process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Reset form
      setForm(initialForm);
      alert('Asset uploaded successfully! It will be reviewed by our team.');
      
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const FileUploadArea = ({ 
    field, 
    label, 
    accept, 
    required = false 
  }: { 
    field: keyof UploadForm; 
    label: string; 
    accept: string; 
    required?: boolean;
  }) => {
    const file = form[field] as File | null;
    
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragOver === field
              ? 'border-blue-500 bg-blue-50'
              : file
              ? 'border-green-500 bg-green-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(field);
          }}
          onDragLeave={() => setDragOver(null)}
          onDrop={(e) => handleDrop(e, field)}
        >
          {file ? (
            <div>
              <div className="text-green-600 text-2xl mb-2">✅</div>
              <p className="text-sm font-medium text-gray-900">{file.name}</p>
              <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              <button
                type="button"
                onClick={() => setForm(prev => ({ ...prev, [field]: null }))}
                className="mt-2 text-sm text-red-600 hover:text-red-500"
              >
                Remove
              </button>
            </div>
          ) : (
            <div>
              <div className="text-gray-400 text-2xl mb-2">📁</div>
              <p className="text-sm text-gray-600">
                Drag and drop your file here, or{' '}
                <label className="text-blue-600 hover:text-blue-500 cursor-pointer">
                  browse
                  <input
                    type="file"
                    accept={accept}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(field, file);
                    }}
                    className="hidden"
                  />
                </label>
              </p>
              <p className="text-xs text-gray-500 mt-1">Accepts: {accept}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <nav className="flex" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-4">
                  <li>
                    <Link href="/animator" className="text-gray-400 hover:text-gray-500">
                      Animator
                    </Link>
                  </li>
                  <li>
                    <span className="text-gray-400">/</span>
                  </li>
                  <li>
                    <span className="text-gray-900 font-medium">Upload</span>
                  </li>
                </ol>
              </nav>
              <h1 className="text-2xl font-bold text-gray-900 mt-2">Upload Asset</h1>
              <p className="text-sm text-gray-500">Submit your animation for review</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Super Hero Ego - Verse 1"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe your animation..."
                />
              </div>
            </div>
          </div>

          {/* File Uploads */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Asset Files</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FileUploadArea
                field="bgLayer"
                label="Background Layer"
                accept=".png,.jpg,.jpeg"
                required
              />
              
              <FileUploadArea
                field="mgLayer"
                label="Middle Ground Layer"
                accept=".png,.jpg,.jpeg"
              />
              
              <FileUploadArea
                field="fgLayer"
                label="Foreground Layer"
                accept=".png,.jpg,.jpeg"
              />
              
              <FileUploadArea
                field="audioFile"
                label="Audio Track"
                accept=".mp3,.wav,.m4a"
              />
              
              <FileUploadArea
                field="depthMap"
                label="Depth Map (Optional)"
                accept=".png,.jpg,.jpeg"
              />
            </div>
          </div>

          {/* Requirements Checklist */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-blue-900 mb-4">📋 Submission Requirements</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-center">
                <span className="mr-2">✅</span>
                Background layer is required (PNG/JPG, max 10MB)
              </li>
              <li className="flex items-center">
                <span className="mr-2">✅</span>
                All layers should be same dimensions (recommended: 1920x1080)
              </li>
              <li className="flex items-center">
                <span className="mr-2">✅</span>
                Audio should be high quality (WAV preferred, max 50MB)
              </li>
              <li className="flex items-center">
                <span className="mr-2">✅</span>
                Depth maps improve 3D effect quality (optional but recommended)
              </li>
              <li className="flex items-center">
                <span className="mr-2">✅</span>
                Content must be original or properly licensed
              </li>
            </ul>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Link
              href="/animator"
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={uploading || !form.title || !form.bgLayer}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </>
              ) : (
                'Submit for Review'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}