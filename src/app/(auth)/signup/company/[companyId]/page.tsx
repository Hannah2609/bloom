import SignupForm from "@/components/auth/signup/SignupForm";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session/session";
import { redirect, notFound } from "next/navigation";

interface SignupCompanyPageProps {
  params: Promise<{
    companyId: string;
  }>;
}

export default async function SignupCompanyPage({
  params,
}: SignupCompanyPageProps) {
  const { companyId } = await params;
  const session = await getSession();
  const pendingCompany = session.pendingCompany;

  console.log("SignupCompanyPage - pendingCompany:", pendingCompany);

  if (!pendingCompany || pendingCompany.companyId !== companyId) {
    redirect("/signup");
  }

  const company = await prisma.company.findUnique({
    where: { id: companyId },
    select: { id: true, name: true, domain: true },
  });

  if (!company) {
    notFound();
  }

  return (
    <div className="flex flex-row items-center pt-20 justify-center gap-20">
      <SignupForm
        pendingCompany={{
          id: company.id,
          name: company.name,
          domain: company.domain,
          role: pendingCompany.role,
          email: pendingCompany.email,
        }}
      />
    </div>
  );
}
