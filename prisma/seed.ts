import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Seed data
const users = [
  {
    firstName: 'Hannah',
    lastName: 'Nielsen',
    email: 'hannah@example.com',
    password: 'password123',
  },
  {
    firstName: 'Katja',
    lastName: 'Jensen',
    email: 'katja@example.com',
    password: 'password123',
  },
  {
    firstName: 'Karen',
    lastName: 'Hansen',
    email: 'karen@example.com',
    password: 'password123',
  },
  {
    firstName: 'Karen',
    lastName: 'Andersen',
    email: 'karen@example.dk',
    password: 'password123',
  },
];

async function seedUsers() {
  console.log('👤 Seeding users...');

  for (const userData of users) {
    const hashedPassword = await bcrypt.hash(userData.password, 12);

    await prisma.user.upsert({
      where: { email: userData.email },
      update: { ...userData, password: hashedPassword },
      create: { ...userData, password: hashedPassword },
    });
  }

  console.log(`✅ Seeded ${users.length} users`);
}

async function main() {
  console.log('🌱 Starting database seed...\n');

  try {
    await seedUsers();

    console.log('\n✨ Seeding completed successfully!');
  } catch (error) {
    console.error('\n❌ Error during seeding:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('\n🔌 Disconnected from database');
  });
