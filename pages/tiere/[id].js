import { PrismaClient } from '@prisma/client';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import styled from "styled-components";
import { useTranslation } from "next-i18next";

import PageWrapper from "../../components/page-structure/PageWrapper";
import HeaderCard from "../../components/TierDetails/HeaderCard";
import { getAnimalById } from "../../services/AnimalService";
import TwoColumnGrid from "../../components/page-structure/Elements/TwoColumnGrid";
import Textarea from "../../components/page-structure/Elements/Textarea";
import VariantArea from "../../components/TierDetails/VariantArea";

const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

export default function TierDetail({ animal }) {
  const { t } = /** @type {any} */ (
    useTranslation(["animals", "common"])
  );

  if (!animal) return <div>Tier nicht gefunden...</div>;

  return (
    <PageWrapper>
      <ContentWrapper>
        <HeaderCard
          animal={animal}
        />

        <TwoColumnGrid>
          <section>
            <Textarea
              label={t("common:description")}
              text={animal.beschreibung}
            />
            <VariantArea
            animal={animal}
              />
          </section>
        </TwoColumnGrid>
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

const ContentWrapper = styled.div`
  max-width: 1000px;
  width: 100%;
  padding: 0 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;