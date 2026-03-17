import styled from "styled-components";

import HeaderCard from "/components/TierDetails/HeaderCard";
import PageWrapper from "../components/page-structure/PageWrapper";
import AccordionCard from "../components/TierDetails/AccordionCard";
import DescriptionBox from "../components/page-structure/Elements/DescriptionBox";
import Variants from "../components/TierDetails/Variants";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export default function TierDetail({ animal }) {
  return (
    <PageWrapper>
      <ContentWrapper>
        {/*<HeaderCard
          animal={animal}
        />*/}

        <TwoColumnGrid>
          <section>
            <DescriptionBox
              animal = {animal}
            />

            <Variants
              animal = {animal}
            />
          </section>

          <AccordionCard
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

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'animal', 'login', 'navigation'])),
    },
  };
}