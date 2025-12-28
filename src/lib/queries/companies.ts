import { prisma } from "@/lib/prisma";

/**
 * GET
 */
/**
 * Get company by ID
 */
export async function getCompanyById(companyId: string) {
  return await prisma.company.findUnique({
    where: { id: companyId },
    select: { id: true },
  });
}

/**
 * Get company by domain
 */
export async function getCompanyByDomain(domain: string) {
  return await prisma.company.findUnique({
    where: { domain },
    select: { id: true, name: true, domain: true },
  });
}

/**
 * POST
 */
/**
 * Create a new company
 */
export async function createCompany(data: {
  name: string;
  domain: string;
  logo?: string;
}) {
  return await prisma.company.create({
    data: {
      name: data.name,
      domain: data.domain,
      logo: data.logo,
    },
  });
}
