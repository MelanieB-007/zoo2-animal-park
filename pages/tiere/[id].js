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
import AccordionCard from "../../components/TierDetails/AccordionCard";
import ContentWrapper from "../../components/page-structure/ContentWrapper";

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
        {/* Der Header steht meist über die volle Breite oder als Startpunkt */}
        <HeaderCard animal={animal} />

        <MainGrid>
          {/* Linke Spalte: Beschreibung & Varianten */}
          <PrimaryColumn>
            <Textarea
              label={t("common:description")}
              text={animal.beschreibung || t("common:no_description_available")}
            />

            <VariantArea animal={animal} />
          </PrimaryColumn>

          {/* Rechte Spalte: Sidebar mit Accordions */}
          <SecondaryColumn>
            <AccordionCard animal={animal} />
          </SecondaryColumn>
        </MainGrid>
      </ContentWrapper>
    </PageWrapper>
  );
}

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 25px;
  width: 100%;
  margin-top: 20px;

  @media (min-width: 1024px) {
    grid-template-columns: 1.8fr 1.2fr; 
    align-items: start;
  }
`;

const PrimaryColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const SecondaryColumn = styled.div`
  @media (min-width: 1024px) {
    position: sticky;
    top: 20px;
  }
`;

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

