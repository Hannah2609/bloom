import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client';

const prisma = new PrismaClient();

// Seed data
const users = [
  {
    name: 'Hannah',
    email: 'hannah@example.com',
    password: 'hashed_password_123', 
  },
  {
    name: 'Katja',
    email: 'katja@example.com',
    password: 'hashed_password_456',
    age: 25, 
  },
   {
    name: 'Karen',
    email: 'karen@example.com',
    password: 'hashed_password_789', 
  },
   {
    name: 'Karen-test',
    email: 'karen@example.dk',
    password: 'hashed_password_541', 
  },
];

async function seedUsers() {
  console.log('👤 Seeding users...');
  
  for (const userData of users) {
    await prisma.user.upsert({
      where: { email: userData.email },
      update: userData,
      create: userData,
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