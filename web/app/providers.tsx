'use client';

import { ThirdwebProvider } from '@thirdweb-dev/react';
import { Ethereum, Polygon } from '@thirdweb-dev/chains';
import { RBACProvider } from './auth/rbac-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThirdwebProvider
      clientId={process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!}
      activeChain={Ethereum}
      supportedChains={[Ethereum, Polygon]}
      autoConnect={false}
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