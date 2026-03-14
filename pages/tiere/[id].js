import { PrismaClient } from '@prisma/client';
import TierDetails from '../../pages/tierdetails';

const prisma = new PrismaClient();
export async function getServerSideProps({ params, locale }) {
  const animal = await prisma.tiere.findUnique({
    where: { id: parseInt(params.id) },
    include: {
      variants: {
        include: {
          herkunft: true // Hiermit werden Name und Bild der Herkunft geladen
        }
      },
      gehege: true,
      xp: true,
      preisart: true,
      tierherkunft: {
        include: {
          herkunft: true,
        }
      },
      tier_gehege_kapazitaet: {
        orderBy: {
          anzahlTiere: 'asc'
        }
      }
    },
  });

  return { props: { animal: JSON.parse(JSON.stringify(animal)) } };
}

export default function TierPage({ animal }) {
  return <TierDetails animal={animal} />;
}