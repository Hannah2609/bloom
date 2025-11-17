'use client';

import React from 'react';
import { useSession } from '@/hooks/useSession';
import { Button } from '@/components/ui/button/button';
import { useAuth } from '@/hooks/useAuth';

const Page = () => {
  const { user } = useSession();
  const { logout, isLoading } = useAuth();

  return (
    <section>
      <h1>Hi, {user?.firstName}</h1>
      <Button onClick={logout} disabled={isLoading}>
        Logout
      </Button>
    </section>
  );
};

export default Page;
