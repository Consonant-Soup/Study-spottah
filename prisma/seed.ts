import { PrismaClient, Role, Condition, Standing } from '@prisma/client';
import { hash } from 'bcrypt';
import * as config from '../config/settings.development.json';
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import 'dotenv/config'
import { seedFirstFloorSpot } from '../src/lib/seedFirstFloorSpot'

// Initialize the database pool
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })

// Instantiate the driver adapter
const adapter = new PrismaPg(pool)

// Pass the adapter directly to Prisma Client
export const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Seeding the database');
  const password = await hash('changeme', 10);
  config.defaultAccounts.forEach(async (account) => {
    const role = account.role as Role || Role.USER;
    console.log(`  Creating user: ${account.email} with role: ${role}`);
    await prisma.user.upsert({
      where: { email: account.email },
      update: {
        password,
      },
      create: {
        email: account.email,
        password,
        role,
      },
    });
    // console.log(`  Created user: ${user.email} with role: ${user.role}`);
  });
  for (const data of config.defaultData) {
    const condition = data.condition as Condition || Condition.good;
    console.log(`  Adding stuff: ${JSON.stringify(data)}`);
    await prisma.stuff.upsert({
      where: { id: config.defaultData.indexOf(data) + 1 },
      update: {},
      create: {
        name: data.name,
        quantity: data.quantity,
        owner: data.owner,
        condition,
      },
    });
  }
  for (const profile of config.defaultProfile) {
    const standing = (profile.standing as Standing) || Standing.freshman;
    console.log(`  Creating profile: ${profile.uhemail}`);
    await prisma.profile.upsert({
      where: { uhemail: profile.uhemail },
      update: {
        profilepic: profile.profilepic,
        uhemail: profile.uhemail,
        username: profile.username,
        firstName: profile.firstName,
        lastName: profile.lastName,
        major: profile.major,
        standing,
      },
      create: {
        profilepic: profile.profilepic,
        uhemail: profile.uhemail,
        username: profile.username,
        firstName: profile.firstName,
        lastName: profile.lastName,
        major: profile.major,
        standing,
      },
    });
  }
  await seedFirstFloorSpot(prisma);
}
main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
