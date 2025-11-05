'use client';

import React, { useState } from 'react';
import { useRBAC } from '../app/auth/rbac-provider';
import { createUserFromEmail } from '../utils/auth/simple-auth';

interface EmailSignInProps {
  className?: string;
  onSuccess?: (address: string) => void;
}

export default function EmailSignIn({ 
  className = '',
  onSuccess
}: EmailSignInProps) {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState<'email' | 'verify'>('email');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { connectWallet } = useRBAC();

  const handleSignIn = async () => {
    if (!email) return;
    setIsLoading(true);
    setError('');
    
    try {
      const user = createUserFromEmail(email);
      await connectWallet(user.walletAddress);
      onSuccess?.(user.walletAddress);
    } catch (err) {
      setError('Sign-in failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <label className="block text-sm font-medium mb-2">Email Address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50"
        />
      </div>
      {error && <div className="text-red-400 text-sm">{error}</div>}
      <button
        onClick={handleSignIn}
        disabled={isLoading || !email}
        className="w-full mv-button"
      >
        {isLoading ? 'Signing In...' : 'Sign In with Email'}
      </button>
    </div>
  );
}