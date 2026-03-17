import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import TierDetails from "../../components/TierDetails/TierDetails";
import { getAnimalById } from "../../services/AnimalService";

export async function getServerSideProps({ params, locale }) {
  const animal = await getAnimalById(params.id);

  if (!animal) {
    return { notFound: true };
  }

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'animal', 'login', 'navbar'])),
      animal: JSON.parse(JSON.stringify(animal)),
    },
  };
}

export default function TierPage({ animal }) {
  return <TierDetails animal={animal} />;
}