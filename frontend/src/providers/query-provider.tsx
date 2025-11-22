'use client';

import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () => new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 1000 * 60 * 5, // 5 minutes - data considered fresh
          gcTime: 1000 * 60 * 30, // 30 minutes - keep in cache (formerly cacheTime)
          refetchOnWindowFocus: false,
          refetchOnMount: false, // Don't refetch if data is fresh
          refetchOnReconnect: false,
          retry: 1, // Only retry failed requests once
          retryDelay: 1000, // 1 second delay between retries
        },
      },
    })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

// Export useQueryClient for easy access to the query client
export { useQueryClient };