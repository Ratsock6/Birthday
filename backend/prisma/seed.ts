import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const hash = await bcrypt.hash('admin1234', 10);

  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hash,
      displayName: 'Antoine',
      role: 'ADMIN',
    },
  });

  console.log('✅ Compte admin créé : admin / admin1234');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());