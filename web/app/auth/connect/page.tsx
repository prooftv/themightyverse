'use client';

import React, { useEffect, Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAddress } from '@thirdweb-dev/react';
import { useRBAC } from '../rbac-provider';
import EmailSignIn from '../../../components/GoogleSignIn';

function AuthConnectContent() {
  const address = useAddress();
  const { wallet, connectWallet } = useRBAC();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (address || wallet) {
      router.push(redirect);
    }
  }, [address, wallet, redirect, router]);

  const handleSuperAdminConnect = async () => {
    try {
      const superAdminWallet = process.env.NEXT_PUBLIC_SUPER_ADMIN_WALLET || '0x860Ec697167Ba865DdE1eC9e172004100613e970';
      await connectWallet(superAdminWallet);
      router.push(redirect);
    } catch (err) {
      setError('Failed to connect as Super Admin');
    }
  };

  return (
    <div className="mighty-verse-app min-h-screen flex items-center justify-center">
      <div className="mv-card mv-holographic p-12 max-w-md w-full text-center">
        <div className="text-6xl mb-6">◈</div>
        <h1 className="mv-heading-lg mb-4">Connect to The Mighty Verse</h1>
        <p className="mv-text-muted mb-8">
          Choose your connection method
        </p>

        {error && (
          <div className="mv-status-error mb-6 p-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Email Sign-In */}
        <EmailSignIn 
          className="mb-4"
          onSuccess={(address) => {
            console.log('Email sign-in successful:', address);
            router.push(redirect);
          }}
        />

        {/* Super Admin Access */}
        <button
          onClick={handleSuperAdminConnect}
          className="w-full mb-4 px-4 py-3 rounded-lg border border-white/20 hover:bg-white/10 transition-colors flex items-center justify-center space-x-2"
        >
          <span className="text-xl">⬟</span>
          <span className="text-sm">Super Admin Access</span>
        </button>

        <p className="mv-text-muted text-sm">
          Multiple wallet options available
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