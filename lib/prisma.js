// lib/prisma.js
import { PrismaClient } from './generated/client'; // Wichtig: Relativer Pfad!

const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'], // Hilfreich zum Debuggen: Du siehst SQL im Terminal
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;