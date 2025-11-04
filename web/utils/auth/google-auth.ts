'use client';

/**
 * Google Sign-In with Wallet Creation
 * Creates embedded wallets for users automatically
 */

import { EmbeddedWallet } from '@thirdweb-dev/wallets';
import { Ethereum } from '@thirdweb-dev/chains';

interface GoogleUser {
  email: string;
  name: string;
  picture: string;
  walletAddress: string;
}

class GoogleAuthService {
  private embeddedWallet: EmbeddedWallet | null = null;

  async signInWithGoogle(): Promise<GoogleUser> {
    try {
      // Initialize embedded wallet
      this.embeddedWallet = new EmbeddedWallet({
        chain: Ethereum,
        clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || '',
      });

      // Connect with Google
      await this.embeddedWallet.connect();

      // Get wallet address
      const address = await this.embeddedWallet.getAddress();
      
      // Generate user info from address
      const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;
      
      return {
        email: `user-${shortAddress}@themightyverse.app`,
        name: `User ${shortAddress}`,
        picture: '',
        walletAddress: address,
      };
    } catch (error) {
      console.error('Google sign-in failed:', error);
      throw new Error('Failed to sign in with Google');
    }
  }

  async signOut(): Promise<void> {
    if (this.embeddedWallet) {
      await this.embeddedWallet.disconnect();
      this.embeddedWallet = null;
    }
  }

  getWallet(): EmbeddedWallet | null {
    return this.embeddedWallet;
  }
}

export const googleAuth = new GoogleAuthService();
export type { GoogleUser };