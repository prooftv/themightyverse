'use client';

import React from 'react';
import { ConnectWallet } from '@thirdweb-dev/react';

interface GoogleSignInProps {
  className?: string;
  children?: React.ReactNode;
}

export default function GoogleSignIn({ 
  className = '',
  children 
}: GoogleSignInProps) {
  return (
    <ConnectWallet
      theme="dark"
      btnTitle={children ? "Connect" : "Connect Wallet"}
      switchToActiveChain={true}
      className={className}
    />
  );
}