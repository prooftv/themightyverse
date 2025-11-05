'use client';

/**
 * Simple authentication without ThirdWeb v5 complexity
 * Direct wallet address assignment for testing
 */

export interface SimpleUser {
  email: string;
  walletAddress: string;
}

// Generate deterministic wallet address from email
export function generateWalletFromEmail(email: string): string {
  // Simple hash function to create consistent address
  let hash = 0;
  for (let i = 0; i < email.length; i++) {
    const char = email.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Convert to hex and pad to create wallet-like address
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return `0x${hex}${'0'.repeat(32)}`;
}

export function createUserFromEmail(email: string): SimpleUser {
  return {
    email,
    walletAddress: generateWalletFromEmail(email),
  };
}