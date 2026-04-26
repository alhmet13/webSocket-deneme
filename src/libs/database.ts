import { PrismaClient } from '../generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg(process.env.DATABASE_URL!);

const prisma = new PrismaClient({
  adapter,
  log: ['info', 'error', 'query', 'warn'],
});

export { prisma };
