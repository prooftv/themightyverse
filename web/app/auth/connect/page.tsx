'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useRBAC } from '../rbac-provider';

function AuthConnectContent() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { connectWallet, wallet } = useRBAC();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const handleGoogleConnect = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      // Simulate Google OAuth + wallet creation
      const mockWallet = `0x${Math.random().toString(16).substr(2, 40)}`;
      await connectWallet(mockWallet);
      router.push(redirect);
    } catch (err) {
      setError('Connection failed. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    if (wallet) {
      router.push(redirect);
    }
  }, [wallet, redirect, router]);

  return (
    <div className="mighty-verse-app min-h-screen flex items-center justify-center">
      <div className="mv-card mv-holographic p-12 max-w-md w-full text-center">
        <div className="text-6xl mb-6">◈</div>
        <h1 className="mv-heading-lg mb-4">Connect to The Mighty Verse</h1>
        <p className="mv-text-muted mb-8">
          Sign in with Google to access your holographic dashboard
        </p>

        {error && (
          <div className="mv-status-error mb-6 p-3">
            {error}
          </div>
        )}

        <button
          onClick={handleGoogleConnect}
          disabled={isConnecting}
          className="mv-button w-full mb-4 flex items-center justify-center space-x-3"
        >
          {isConnecting ? (
            <>
              <div className="animate-spin text-xl">◈</div>
              <span>Connecting...</span>
            </>
          ) : (
            <>
              <span className="text-xl">◆</span>
              <span>Continue with Google</span>
            </>
          )}
        </button>

        <p className="mv-text-muted text-sm">
          A wallet will be created automatically for blockchain features
        </p>
      </div>
    </div>
  );
}

export default function AuthConnect() {
  return (
    <Suspense fallback={
      <div className="mighty-verse-app min-h-screen flex items-center justify-center">
        <div className="mv-card mv-holographic p-12 max-w-md w-full text-center">
          <div className="animate-spin text-6xl mb-6">◈</div>
          <h1 className="mv-heading-lg mb-4">Loading...</h1>
        </div>
      </div>
    }>
      <AuthConnectContent />
    </Suspense>
  );
}