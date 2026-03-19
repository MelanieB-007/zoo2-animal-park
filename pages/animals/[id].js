import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import useSWR from "swr";

import PageWrapper from "../../components/page-structure/PageWrapper";
import { getAnimalById } from "../../services/AnimalService";
import ContentWrapper from "../../components/page-structure/ContentWrapper";
import AnimalDetailContent from "../../components/AnimalDetails/AnimalDetailContent";


export default function TierDetail({ animal: fallbackData }) {
  const { data: animal } = useSWR(
    `/api/animals/${fallbackData.id}`,
    null,
    {
      fallbackData,
      revalidateOnFocus: true // Aktualisiert Daten, wenn man den Tab wechselt
    }
  );

  return (
    <PageWrapper>
      <ContentWrapper>
        <AnimalDetailContent animal={animal} />
      </ContentWrapper>
    </PageWrapper>
  );
}
export async function getServerSideProps({ params, locale }) { // 2. locale hinzufügen
  const { id } = params;
  const animal = await getAnimalById(id);

  if (!animal) return { notFound: true };

  return {
    props: {
      animal: JSON.parse(JSON.stringify(animal)),
      ...(await serverSideTranslations(locale || 'de', ['common', 'animals'])),
    },
  };
}