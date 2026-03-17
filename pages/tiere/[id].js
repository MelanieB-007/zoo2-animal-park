import { PrismaClient } from '@prisma/client';
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
// Stelle sicher, dass dieser Pfad zu deiner TierDetails-Komponente absolut stimmt!
import TierDetails from '../../pages/tierdetails';

const prisma = new PrismaClient();

export async function getServerSideProps({ params, locale }) {
  const animal = await prisma.tiere.findUnique({
    where: { id: parseInt(params.id) },
    include: {
      variants: { include: { herkunft: true } },
      gehege: true,
      xp: true,
      preisart: true,
      tierherkunft: { include: { herkunft: true } },
      tier_gehege_kapazitaet: { orderBy: { anzahlTiere: 'asc' } }
    },
  });

  if (!animal) {
    return { notFound: true };
  }

  return {
    props: {
      // WICHTIG: Hier werden die Übersetzungen geladen
      ...(await serverSideTranslations(locale, ['common', 'animal', 'navbar'])),
      animal: JSON.parse(JSON.stringify(animal)),
    },
  };
}

// DAS MUSS EIN DEFAULT EXPORT SEIN
export default function TierPage({ animal }) {
  return <TierDetails animal={animal} />;
}