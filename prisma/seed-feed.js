import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Feed seed listo para uso real');
  console.log('📝 Las publicaciones ahora son creadas por usuarios reales en la plataforma');
}

main()
  .catch((e) => {
    console.error('❌ Feed seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
