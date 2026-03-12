import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getServerSideProps({ params, locale }) {
  const animal = await prisma.tiere.findUnique({
    where: { id: parseInt(params.id) },
    include: {
      variants: true,
      enclosures: true,
      stats: true,
      breeding: true,
      tierherkunft: {
        include: {
          herkunft: true,
        }
      }
    },
  });

  if (!animal) return {落地: { destination: '/404' } };

  return {
    props: {
      animal: JSON.parse(JSON.stringify(animal)), // Prisma-Daten für Next.js serialisieren
      // messages: (await import(`../../messages/${locale}.json`)).default, // Falls du next-intl nutzt
    },
  };
}