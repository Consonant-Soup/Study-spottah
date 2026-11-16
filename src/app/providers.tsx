'use client';

import { SessionProvider } from 'next-auth/react'; // v5 compatible
import { SpotsViewProvider } from '@/components/SpotsViewContext';

type Props = {
  children?: React.ReactNode;
};

const Providers = ({ children }: Props) => (
  <SpotsViewProvider>
    <SessionProvider>{children}</SessionProvider>
  </SpotsViewProvider>
);

export default Providers;
