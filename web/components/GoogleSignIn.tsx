'use client';

import React, { useState } from 'react';
import { createThirdwebClient } from 'thirdweb';
import { inAppWallet, preAuthenticate } from 'thirdweb/wallets/in-app';
import { ethereum } from 'thirdweb/chains';
import { useRBAC } from '../app/auth/rbac-provider';

const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
});

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

  const handleSendCode = async () => {
    if (!email) return;
    setIsLoading(true);
    setError('');
    
    try {
      await preAuthenticate({
        client,
        strategy: 'email',
        email,
      });
      setStep('verify');
    } catch (err) {
      setError('Failed to send verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!verificationCode) return;
    setIsLoading(true);
    setError('');
    
    try {
      const wallet = inAppWallet();
      const account = await wallet.connect({
        client,
        chain: ethereum,
        strategy: 'email',
        email,
        verificationCode,
      });
      
      const address = account.address;
      await connectWallet(address);
      onSuccess?.(address);
    } catch (err) {
      setError('Invalid verification code');
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 'verify') {
    return (
      <div className={`space-y-4 ${className}`}>
        <div>
          <label className="block text-sm font-medium mb-2">Verification Code</label>
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="Enter 6-digit code"
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50"
          />
        </div>
        {error && <div className="text-red-400 text-sm">{error}</div>}
        <button
          onClick={handleVerify}
          disabled={isLoading || !verificationCode}
          className="w-full mv-button"
        >
          {isLoading ? 'Verifying...' : 'Verify & Connect'}
        </button>
        <button
          onClick={() => setStep('email')}
          className="w-full text-sm text-white/60 hover:text-white"
        >
          Back to email
        </button>
      </div>
    );
  }

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
        onClick={handleSendCode}
        disabled={isLoading || !email}
        className="w-full mv-button"
      >
        {isLoading ? 'Sending...' : 'Send Verification Code'}
      </button>
    </div>
  );
}