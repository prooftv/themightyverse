'use client';

import React, { useState } from 'react';
import { googleAuth, GoogleUser } from '../utils/auth/google-auth';
import { useRBAC } from '../app/auth/rbac-provider';

interface GoogleSignInProps {
  onSuccess?: (user: GoogleUser) => void;
  onError?: (error: string) => void;
  className?: string;
  children?: React.ReactNode;
}

export default function GoogleSignIn({ 
  onSuccess, 
  onError, 
  className = '',
  children 
}: GoogleSignInProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { connectWallet } = useRBAC();

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    
    try {
      const user = await googleAuth.signInWithGoogle();
      
      // Connect wallet in RBAC system
      await connectWallet(user.walletAddress);
      
      // Store user info
      if (typeof window !== 'undefined') {
        localStorage.setItem('google_user', JSON.stringify(user));
      }
      
      onSuccess?.(user);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign-in failed';
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      disabled={isLoading}
      className={`flex items-center justify-center space-x-3 ${className}`}
    >
      {isLoading ? (
        <>
          <div className="animate-spin text-xl">◈</div>
          <span>Connecting...</span>
        </>
      ) : (
        children || (
          <>
            <span className="text-xl">◆</span>
            <span>Continue with Google</span>
          </>
        )
      )}
    </button>
  );
}