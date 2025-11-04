'use client';

import React, { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ConnectWallet, useAddress } from '@thirdweb-dev/react';
import { useRBAC } from '../rbac-provider';

function AuthConnectContent() {
  const address = useAddress();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  useEffect(() => {
    if (address) {
      router.push(redirect);
    }
  }, [address, redirect, router]);

  return (
    <div className="mighty-verse-app min-h-screen flex items-center justify-center">
      <div className="mv-card mv-holographic p-12 max-w-md w-full text-center">
        <div className="text-6xl mb-6">◈</div>
        <h1 className="mv-heading-lg mb-4">Connect to The Mighty Verse</h1>
        <p className="mv-text-muted mb-8">
          Choose your preferred connection method
        </p>

        <ConnectWallet
          theme="dark"
          btnTitle="Connect Wallet"
          className="!w-full !bg-gradient-to-r !from-purple-600 !to-blue-600 !border-0 !rounded-lg !py-3 !px-6 !text-white !font-semibold"
        />

        <p className="mv-text-muted text-sm mt-4">
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