import { PrismaClient } from '@prisma/client';
import PageWrapper from "../../components/page-structure/PageWrapper";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import HeaderCard from "../../components/TierDetails/HeaderCard";
import styled from "styled-components";
import { getAnimalById } from "../../services/AnimalService";
import { useTranslation } from "next-i18next";

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
            <DetailBox>
              <LabelDescription>
                {t("common:description")}
              </LabelDescription>
              <p>{animal.beschreibung}</p>
            </DetailBox>
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

const TwoColumnGrid = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 20px;
  margin-top: 20px;
  width: 100%; 

  @media (max-width: 768px) {
    display: flex; 
    flex-direction: column-reverse; 
    align-items: center;
    gap: 15px;
  }
`;

const DetailBox = styled.div`
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  
  height: auto;          
  min-height: 203px;    

  p {
    line-height: 1.6;    
    margin: 0;          
    color: #333;
  }

  h3 {
    display: flex;
    align-items: center;
    margin-top: 0;
    margin-bottom: 1.2rem;
    font-size: 1.25rem;
    color: #2c3e50;
    border-bottom: 2px solid #f1f2f6;
    padding-bottom: 0.8rem;

    span {
      margin-right: 12px;
    }
  }
`;

const LabelDescription = styled.label`
  font-weight: bold;
  font-size: 1rem;
  color: #2d5a27;
`;
