// app/landing/template.tsx
'use client';

import PageTransitionWrapper from '@/components/shared/PageTransitionWrapper';

export default function Template({ children }: { children: React.ReactNode }) {
  return <PageTransitionWrapper>{children}</PageTransitionWrapper>;
}
