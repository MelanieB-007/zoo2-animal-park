import styled from "styled-components";
import { useTranslation } from "next-i18next";
import HeaderCard from "./HeaderCard";

import Textarea from "../page-structure/Elements/Textarea";
import VariantArea from "./VariantArea";
import AccordionCard from "./AccordionCard";

export default function AnimalDetailContent({ animal }) {
  const { t } = useTranslation(["animals", "common"]);

  if (!animal) return <div>{t("common:not_found")}</div>;

  return (
    <Wrapper>
      <HeaderCard animal={animal} />

      <MainGrid>
        <PrimaryColumn>
          <Textarea
            label={t("common:description")}
            text={animal.beschreibung ?? t("common:no_description_available")}
          />

          <VariantArea animal={animal} />
        </PrimaryColumn>

        <SecondaryColumn>
          <AccordionCard animal={animal} />
        </SecondaryColumn>
      </MainGrid>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px; 
  width: 100%;
`;

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