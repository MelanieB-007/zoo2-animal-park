import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;

// Wir erstellen die Instanz
const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Wichtig: Beides anbieten für maximale Kompatibilität
export { prisma };
export default prisma;