"use client";

import { Heading } from "@/components/ui/heading/heading";
import { PageLayout } from "@/components/dashboard/layout/pageLayout";
import { UserWithCompany } from "@/types/user";
import { ProfileAvatar } from "@/components/dashboard/profile/ProfileAvatar";
import { ProfileInfo } from "@/components/dashboard/profile/ProfileInfo";
import { ProfileNameForm } from "@/components/dashboard/profile/ProfileNameForm";
import { ChangePasswordForm } from "@/components/dashboard/profile/ChangePasswordForm";

interface ProfileClientProps {
  user: UserWithCompany;
}

export default function ProfileClient({ user }: ProfileClientProps) {
  return (
    <PageLayout>
      {/* Header */}
      <div className="mb-8">
        <Heading level="h1">Profile</Heading>
        <p className="text-muted-foreground text-lg md:text-xl mt-1">
          Edit your profile information
        </p>
      </div>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-10">
        {/* Sidebar - Avatar & User Info */}
        <div className="bg-sidebar max-h-96 col-span-full rounded-md p-8 lg:col-span-4 xl:col-span-3">
          <div className="grid place-items-center gap-4">
            <ProfileAvatar
              avatar={user.avatar}
              firstName={user.firstName}
              userId={user.id}
            />
            <ProfileInfo
              firstName={user.firstName}
              lastName={user.lastName}
              role={user.role}
              companyName={user.company.name}
            />
          </div>
        </div>

        {/* Main - Forms */}
        <div className="bg-sidebar col-span-full rounded-md p-8 lg:col-span-6 xl:col-span-7">
          <div className="space-y-8">
            <ProfileNameForm
              userId={user.id}
              firstName={user.firstName}
              lastName={user.lastName}
              email={user.email}
            />
            <ChangePasswordForm userId={user.id} />
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
