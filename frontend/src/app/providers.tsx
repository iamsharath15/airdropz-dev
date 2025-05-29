'use client';

import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider as ReduxProvider } from 'react-redux';
import { store, persistor } from '@/store'; // persistor added
import { PersistGate } from 'redux-persist/integration/react';

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ReduxProvider store={store}>
      {/* PersistGate delays rendering until rehydration */}
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </PersistGate>
    </ReduxProvider>
  );
}
