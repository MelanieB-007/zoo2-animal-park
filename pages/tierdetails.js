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

const TwoColumnGrid = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 20px;
  margin-top: 20px;
  width: 100%; /* Sicherstellen, dass das Grid vollflächig ist */

  @media (max-width: 768px) {
    display: flex; /* Wechsel auf Flexbox für einfache Umkehrung */
    flex-direction: column-reverse; /* Akkordeon (unten im Code) rutscht nach oben */
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

  /* DER WICHTIGE TEIL: */
  height: auto;          /* Die Box darf so hoch werden wie der Text */
  min-height: 203px;     /* Auf Desktop behält sie ihre Mindesthöhe */

  p {
    line-height: 1.6;    /* Macht den Text auf dem Handy besser lesbar */
    margin: 0;           /* Verhindert komische Abstände nach unten */
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


const VariantGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 15px; /* Abstand zwischen den Karten */
  width: 100%;
  margin-top: 20px;

  /* --- DESKTOP-ANSICHT (ab 768px Breite) --- */
  @media (min-width: 768px) {
    /* Platziere so viele 230px-Spalten wie möglich nebeneinander */
    grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
    justify-content: start; /* Linksbündig ausrichten */
  }
`;


const SectionHeadline = styled.h2`
  display: flex;
  align-items: center;
  gap: 12px;

  background: #fdfdfd;
  border: 1.5px solid #d1e2a5;
  border-radius: 30px;
  padding: 8px 24px;
  width: fit-content;

  color: #2d5a27;
  font-size: 1.3rem;
  font-weight: 600;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.03);

  /* DESKTOP-POSITION */
  margin: 35px 0 20px 5px;

  /* Die Linie nach rechts nur auf Desktop anzeigen */
  &::after {
    @media (min-width: 769px) {
      content: "";
      flex: 1;
      height: 1.5px;
      background-color: #d1e2a5;
      margin-left: 20px;
      opacity: 0.5;
      /* Erlaubt der Linie, sich weit nach rechts auszudehnen */
      min-width: 100px;
    }
  }

  @media (max-width: 768px) {
    /* MOBILE-ZENTRIERUNG */
    margin: 30px auto 20px auto; /* auto links/rechts zentriert die Box */
    font-size: 1.15rem;           /* Etwas kleiner für schmale Displays */
    padding: 6px 20px;
    justify-content: center;
  }
`;