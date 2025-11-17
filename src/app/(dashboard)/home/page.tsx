'use client';

import React from 'react';
import { useSession } from '@/hooks/useSession';

const Page = () => {
  const { user } = useSession();

  return <div>Hi, {user?.firstName}</div>;
};

export default Page;
