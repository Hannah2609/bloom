'use client';

import { useSession } from '@/hooks/useSession';
import { Button } from '@/components/ui/button/button';
import { useAuth } from '@/hooks/useAuth';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Good morning';
  if (hour >= 12 && hour < 18) return 'Good afternoon';
  return 'Good evening';
};

const Page = () => {
  const { user } = useSession();
  const { logout, isLoading } = useAuth();

  return (
    <section className="px-24 pt-6 flex flex-col gap-10">
      <div className="space-y-6">
        <span className="text-xl font-medium text-muted-foreground">{getGreeting()}</span>
        <h1 className="text-3xl">{user?.firstName}</h1>
      </div>
      <Button className="w-30" onClick={logout} disabled={isLoading}>
        Logout
      </Button>
    </section>
  );
};

export default Page;
