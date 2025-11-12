import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.createMany({
    data: [
      { email: 'anna@example.com', name: 'Anna Hansen' },
      { email: 'peter@example.com', name: 'Peter Nielsen' },
      { email: 'sara@example.com', name: 'Sara Larsen' },
      { email: 'lars@example.com', name: 'Lars Andersen' },
      { email: 'marie@example.com', name: 'Marie Pedersen' },
    ],
  });
  
  console.log('Seeded 5 users successfully!');
}

main().finally(async () => {
  await prisma.$disconnect();
});