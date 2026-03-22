import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import useSWR from "swr";

import PageWrapper from "../../components/page-structure/PageWrapper";
import ContentWrapper from "../../components/page-structure/ContentWrapper";
import AnimalDetailContent from "../../components/AnimalDetails/AnimalDetailContent";
import { getAnimalById } from "../../services/AnimalService";


export default function TierDetail({ animal: fallbackData }) {
  const { data: animal } = useSWR(
    `/api/animals/${fallbackData.id}`,
    null,
    {
      fallbackData,// 1. Kein automatisches Update, wenn man das Fenster wieder anklickt
      revalidateOnFocus: false,

      // 2. Daten gelten für 5 Minuten als "frisch" (300.000 ms)
      // SWR fragt in dieser Zeit nicht erneut im Hintergrund nach
      dedupingInterval: 300000,

      // 3. Nur updaten, wenn man die Seite wirklich neu lädt
      revalidateOnMount: false,

      // 4. Bei einem Fehler nicht sofort 10x neu probieren
      errorRetryCount: 2
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
  const animal = await getAnimalById(id, locale);

  if (!animal) return { notFound: true };

  return {
    props: {
      animal: JSON.parse(JSON.stringify(animal)),
      ...(await serverSideTranslations(locale || 'de', ['common', 'animals'])),
    },
  };
}