import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Company data
const company = {
  name: 'Dwarf A/S',
  domain: 'dwarf.dk',
  logo: '/dwarf-logo.webp',
};

// Seed data
const users = [
  {
    firstName: 'Hannah',
    lastName: 'Grenade',
    email: 'hannah@dwarf.dk',
    password: 'password123',
    role: 'ADMIN' as const,
  },
  {
    firstName: 'Katja',
    lastName: 'Krogh',
    email: 'katja@dwarf.dk',
    password: 'password123',
    role: 'ADMIN' as const,
  },
  {
    firstName: 'Karen',
    lastName: 'Hansen',
    email: 'karen@dwarf.dk',
    password: 'password123',
    role: 'MANAGER' as const,
  },
  {
    firstName: 'Mads',
    lastName: 'Andersen',
    email: 'mads@dwarf.dk',
    password: 'password123',
    role: 'EMPLOYEE' as const,
  },
];

async function seedCompany() {
  console.log('🏢 Seeding company...');

  const createdCompany = await prisma.company.upsert({
    where: { domain: company.domain },
    update: company,
    create: company,
  });

  console.log(`✅ Company: ${createdCompany.name}`);
  return createdCompany;
}

async function seedUsers(companyId: string) {
  console.log('👤 Seeding users...');

  for (const userData of users) {
    const hashedPassword = await bcrypt.hash(userData.password, 12);

    await prisma.user.upsert({
      where: { email: userData.email },
      update: {
        ...userData,
        password: hashedPassword,
        companyId,
      },
      create: {
        ...userData,
        password: hashedPassword,
        companyId,
      },
    });
  }

  console.log(`✅ Users: ${users.length}`);
}

async function main() {
  console.log('🌱 Starting seed...\n');

  try {
    const company = await seedCompany();
    await seedUsers(company.id);

    console.log('\n✨ Seed completed!');
  } catch (error) {
    console.error('\n❌ Seed error:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
