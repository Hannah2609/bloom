'use client';

import { LoadingSpinner } from '@/components/ui/loading/loadingSpinner';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { isLoading } = useProtectedRoute();

  if (isLoading) {
    return <LoadingSpinner />;
  }
  return <>{children}</>;
}
