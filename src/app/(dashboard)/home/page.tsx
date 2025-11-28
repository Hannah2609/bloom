'use client';

import { useSession } from '@/hooks/useSession';
import { Button } from '@/components/ui/button/button';
import { useAuth } from '@/hooks/useAuth';

const Page = () => {
  const { user } = useSession();
  const { logout, isLoading } = useAuth();

  return (
    <section className="p-5 flex flex-col gap-10">
      <h1 className='text-xl'>Hi, {user?.firstName}</h1>
      <Button className='w-30' onClick={logout} disabled={isLoading}>
        Logout
      </Button>
    </section>
  );
};

export default Page;
