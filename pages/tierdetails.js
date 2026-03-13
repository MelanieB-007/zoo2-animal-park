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
              <p>{animal.beschreibung}</p>
            </DetailBox>

            {/* Farbvarianten */}
            {animal.variants && animal.variants.length > 0 && (
              <>
                <h3 style={{ color: "#4a7c2a", marginTop: "20px" }}>
                  🌸 Farbvarianten
                </h3>
                <div style={{ display: "flex", gap: "15px" }}>
                  {animal.variants.map((variant) => (
                    <VariantCard key={variant.id} variant={variant} />
                  ))}
                </div>
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

const DetailBox = styled.div`
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  height: 203px;

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