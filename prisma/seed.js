import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create initial Points record
  const points = await prisma.points.create({
    data: {
      id: 1,
      man: 0,
      woman: 0,
    },
  });
  console.log('✅ Created Points:', points);

  // Create a test admin user
  const admin = await prisma.users.create({
    data: {
      phone: '1234567890',
      password: '$2b$10$YourHashedPasswordHere', // Replace with actual hashed password
      name: 'Admin',
      points: 0,
      cuesStatus: 0,
      rango: 'Administrador',
      rol: 'Administrador',
      totalPoints: 0,
      sexo: 'man',
    },
  });
  console.log('✅ Created Admin User:', admin);

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
