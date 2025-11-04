'use client';

import { ThirdwebProvider } from '@thirdweb-dev/react';
import { Ethereum, Polygon, Solana } from '@thirdweb-dev/chains';
import { GoogleWallet, EmbeddedWallet } from '@thirdweb-dev/wallets';
import { RBACProvider } from './auth/rbac-provider';

const supportedWallets = [
  new GoogleWallet({
    clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
  }),
  new EmbeddedWallet({
    auth: {
      options: ['google', 'email'],
    },
  }),
];

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThirdwebProvider
      clientId={process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!}
      activeChain={Ethereum}
      supportedChains={[Ethereum, Polygon, Solana]}
      supportedWallets={supportedWallets}
      dAppMeta={{
        name: 'The Mighty Verse',
        description: 'Decentralized Creative Platform',
        logoUrl: 'https://themightyverse.vercel.app/logo.png',
        url: 'https://themightyverse.vercel.app',
      }}
    >
      <RBACProvider>
        {children}
      </RBACProvider>
    </ThirdwebProvider>
  );
}