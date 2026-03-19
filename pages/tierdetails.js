import styled from "styled-components";
import HeaderCard from "/components/TierDetails/HeaderCard";
import VariantCard from "/components/TierDetails/VariantCard";
import PageWrapper from "../components/page-structure/PageWrapper";
import AccordionCard from "../components/TierDetails/AccordionCard";
import { useState } from "react";
import { translations } from "../utils/translations";

export default function TierDetail({ animal }) {
  const [lang, setLang] = useState("de");
  const translationsAnimals = translations[lang].animals;
  const translationsCommon = translations[lang].common;

  const description = animal.beschreibung || "Keine Beschreibung verfügbar";

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
            <DetailBox>
              <LabelDescription>
                {translationsCommon.description}
              </LabelDescription>
              <p>{description}</p>
            </DetailBox>

            {/* Farbvarianten */}
            {animal.variants && animal.variants.length > 0 && (
              <>
                <SectionHeadline>
                  <span style={{ fontSize: '1.2rem' }}>🌸</span> {/* Dein Icon hier */}
                  {translationsAnimals.colorVariants} {/* Der Text "Farbvarianten" */}
                </SectionHeadline>
                <VariantGrid>
                  {animal.variants.map((variant) => (
                    <VariantCard key={variant.id} variant={variant} />
                  ))}
                </VariantGrid>
              </>
            )}
          </section>

          <AccordionCard
            translationsAnimals={translationsAnimals}
            animal={animal}
          />
        </TwoColumnGrid>
      </ContentWrapper>
    </PageWrapper>
  );
}

const ContentWrapper = styled.div`
  max-width: 1000px;
  width: 100%;
  padding: 0 10px; /* Kleiner Seitenabstand für das Handy */
  display: flex;
  flex-direction: column;
  align-items: center;
`;




