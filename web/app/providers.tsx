'use client';

import { RBACProvider } from './auth/rbac-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <RBACProvider>
      {children}
    </RBACProvider>
  );
}