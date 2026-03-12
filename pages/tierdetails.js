import styled from 'styled-components';
import HeaderCard from '/components/TierDetails/HeaderCard';
import InfoAccordion from '/components/TierDetails/InfoAccordion';
import VariantCard from '/components/TierDetails/VariantCard';
import PageWrapper from "../components/page-structure/PageWrapper";
import AccordionCard from "../components/TierDetails/AccordionCard";
import { useState } from "react";
import { translations } from "../utils/translations";

export default function TierDetail({ animal }) {
  const [lang, setLang] = useState("de");
  const translationsAnimals = translations[lang].animals;
  const translationsCommon = translations[lang].common;

  return (
    <PageWrapper>
      <ContentWrapper>
        <HeaderCard
          animal={animal}
          translationsAnimals={translationsAnimals}
          translationsCommon={translationsCommon}
        />

        <TwoColumnGrid>
          <section>
            {/* Linke Spalte: Beschreibung */}
            <DetailBox title="Beschreibung" icon="📖">
              <p>{animal.description}</p>
            </DetailBox>

            {/* Farbvarianten */}
            <h3 style={{ color: '#4a7c2a', marginTop: '20px' }}>🌸 Farbvarianten</h3>
            <div style={{ display: 'flex', gap: '15px' }}>
              {animal.variants.map(variant => (
                <VariantCard key={variant.id} variant={variant} />
              ))}
            </div>
          </section>

          <AccordionCard
            translationsAnimals={translationsAnimals}
          />
        </TwoColumnGrid>
      </ContentWrapper>
    </PageWrapper>
  );
}


const ContentWrapper = styled.div`
  max-width: 1000px;
  width: 100%;
`;

const TwoColumnGrid = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 20px;
  margin-top: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

