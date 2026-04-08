import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting feed seed...');

  // Create users (non-admin)
  const users = [
    {
      phone: '3001234567',
      password: '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36Vy0.FgMjdT1p1j1Z3jK3u', // password123
      name: 'María García',
      points: 500,
      cuesStatus: 3,
      rango: 'Novato',
      rol: 'Usuario',
      totalPoints: 500,
      sexo: 'woman',
    },
    {
      phone: '3002345678',
      password: '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36Vy0.FgMjdT1p1j1Z3jK3u',
      name: 'Carlos López',
      points: 1200,
      cuesStatus: 5,
      rango: 'Receptor de Luz',
      rol: 'Usuario',
      totalPoints: 1200,
      sexo: 'man',
    },
    {
      phone: '3003456789',
      password: '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36Vy0.FgMjdT1p1j1Z3jK3u',
      name: 'Ana Martínez',
      points: 300,
      cuesStatus: 2,
      rango: 'Novato',
      rol: 'Usuario',
      totalPoints: 300,
      sexo: 'woman',
    },
    {
      phone: '3004567890',
      password: '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36Vy0.FgMjdT1p1j1Z3jK3u',
      name: 'Juan Rodríguez',
      points: 1500,
      cuesStatus: 5,
      rango: 'Receptor de Luz',
      rol: 'Usuario',
      totalPoints: 1500,
      sexo: 'man',
    },
    {
      phone: '3005678901',
      password: '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36Vy0.FgMjdT1p1j1Z3jK3u',
      name: 'Sofia Hernández',
      points: 800,
      cuesStatus: 4,
      rango: 'Novato',
      rol: 'Usuario',
      totalPoints: 800,
      sexo: 'woman',
    },
  ];

  // Create users
  const createdUsers = [];
  for (const userData of users) {
    const user = await prisma.users.upsert({
      where: { phone: userData.phone },
      update: {},
      create: userData,
    });
    createdUsers.push(user);
    console.log('✅ Created User:', user.name, '-', user.rango);
  }

  // Create posts for each user
  const postsData = [
    { userIndex: 0, description: '¡Hoy completé todas mis tareas! Me siento muy bien conmigo misma 💪' },
    { userIndex: 0, description: 'Alguien sabe dónde puedo encontrar más cuestionarios para practicar?' },
    { userIndex: 1, description: 'Llegué a Receptor de Luz! Muy feliz con mi progreso 🌟' },
    { userIndex: 1, description: 'Los minijuegos son adictivos pero muy divertida la experiencia!' },
    { userIndex: 2, description: 'Primer día en la plataforma, se ve muy interesante.' },
    { userIndex: 2, description: 'Necesito ayuda con las últimas tareas, alguien podría explicarme?' },
    { userIndex: 3, description: 'He mejorado mucho desde que empecé. Los puntos van subiendo!' },
    { userIndex: 3, description: '¿Alguien quiere compartir tips para los minijuegos?' },
    { userIndex: 3, description: 'La comunidad aquí es muy agradable. Gracias a todos!' },
    { userIndex: 4, description: 'Hoy gané 200 puntos con los cuestionarios. Vamos por más!' },
    { userIndex: 4, description: '¿Hay algún evento especial próximamente?' },
  ];

  for (const postData of postsData) {
    const user = createdUsers[postData.userIndex];
    const post = await prisma.feed.create({
      data: {
        authorId: user.id,
        description: postData.description,
      },
    });
    console.log('✅ Created Post by', user.name, ':', postData.description.substring(0, 30) + '...');
  }

  console.log('🎉 Feed seed completed successfully!');
  console.log('📊 Summary:', createdUsers.length, 'users and', postsData.length, 'posts created');
}

main()
  .catch((e) => {
    console.error('❌ Feed seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
