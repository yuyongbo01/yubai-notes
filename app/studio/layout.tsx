import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { StudioShell } from '@/components/studio-shell';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function StudioLayout({ children }: { children: ReactNode }) {
  return <StudioShell>{children}</StudioShell>;
}
