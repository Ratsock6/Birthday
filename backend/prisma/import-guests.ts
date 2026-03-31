import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const guests = [
  { displayName: 'Antoine',  username: 'antoine',    password: '8812' },
  { displayName: 'Nathalie', username: 'nathalie',   password: '9203' },
  { displayName: 'Jeje',     username: 'jerome',     password: '5319' },
  { displayName: 'Banou',    username: 'aubane',     password: '3561' },
  { displayName: 'Maxou',    username: 'maximilien', password: '8066' },
  { displayName: 'Tonton',   username: 'frank',      password: '5968' },
  { displayName: 'Sophie',   username: 'sophie',     password: '8570' },
  { displayName: 'Léa Lou',  username: 'lealou',     password: '0382' },
  { displayName: 'Manou',    username: 'patricia',   password: '5721' },
  { displayName: 'Pape',     username: 'yaneck',     password: '1796' },
  { displayName: 'Manon',    username: 'manon',      password: '1937' },
  { displayName: 'Léo',      username: 'leo',        password: '3383' },
  { displayName: 'Tata',     username: 'laurence',   password: '6984' },
  { displayName: 'Olivier',  username: 'olivier',    password: '7727' },
  { displayName: 'Stéphie',  username: 'stephie',    password: '1189' },
  { displayName: 'Nils',     username: 'nils',       password: '0957' },
  { displayName: 'Thomas',   username: 'thomas',     password: '0006' },
  { displayName: 'Céline',   username: 'celine',     password: '4943' },
  { displayName: 'Alann',    username: 'alann',      password: '8047' },
  { displayName: 'Rosalie',  username: 'rosalie',    password: '1862' },
  { displayName: 'Camille',  username: 'camille',    password: '8055' },
  { displayName: 'Damien',   username: 'damien',     password: '4059' },
  { displayName: 'Lucas',    username: 'lucas',      password: '5340' },
  { displayName: 'Nathan',   username: 'nathan',     password: '0691' },
  { displayName: 'Noa',      username: 'noa',        password: '0986' },
  { displayName: 'Ana',      username: 'ana',        password: '2538' },
  { displayName: 'Tony',     username: 'tony',       password: '7442' },
  { displayName: 'Salma',    username: 'salma',      password: '2087' },
  { displayName: 'Arthur',   username: 'arthur',     password: '8638' },
];

async function main() {
  console.log(`📋 Import de ${guests.length} invités...`);
  let created = 0;
  let skipped = 0;

  for (const guest of guests) {
    const existing = await prisma.user.findUnique({
      where: { username: guest.username },
    });

    if (existing) {
      console.log(`⏭️  Ignoré (existe déjà) : ${guest.username}`);
      skipped++;
      continue;
    }

    const hash = await bcrypt.hash(guest.password, 10);
    await prisma.user.create({
      data: {
        username: guest.username,
        password: hash,
        displayName: guest.displayName,
        role: 'GUEST',
      },
    });

    console.log(`✅ Créé : ${guest.displayName} (@${guest.username})`);
    created++;
  }

  console.log(`\n🎉 Import terminé : ${created} créés, ${skipped} ignorés`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
