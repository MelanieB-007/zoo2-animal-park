import React from "react";
import styled from "styled-components";
import { useTranslation } from "next-i18next";

import InfoAccordion from "../page-structure/Elements/InfoAccordion";
import InputGroup from "../ui/InputGroup";
import FormInput from "../ui/FormInput";
import FormSelect from "../ui/FormSelect";
import PriceDisplay from "../icons/PriceDisplay";
import StallLevelBadge from "../ui/StallLevelBadge";


export default function BreedingSection({ formData, onChange }) {
  const { t } = /** @type {any} */ (useTranslation(["animals", "common"]));

  const stallOptions = [
    { value: 0, label: "Level 0" },
    { value: 1, label: "Level 1" },
    { value: 2, label: "Level 2" },
    { value: 3, label: "Level 3" },
  ];

  return (
    <InfoAccordion
      title={t("animals:breeding.breeding")}
      icon="/images/icons/breeding.png"
    >
      <SectionLayout>
        <FieldsGrid>
          {/* Stall-Level Auswahl */}
          <Wrapper>
            <label>{t("animals:table.stall")}</label>
            <FormSelect
              name="breedingLevel"
              value={formData.breedingLevel}
              onChange={onChange}
              options={stallOptions}
            />
          </Wrapper>

          {/* Zuchtkosten */}
          <Wrapper>
            <label>{t("common:costs")}</label>
            <InputGroup icon="/images/currency/zoodollar.webp">
              <FormInput
                name="breedingCosts"
                type="number"
                value={formData.breedingCosts}
                onChange={onChange}
              />
            </InputGroup>
          </Wrapper>

          {/* Zuchtdauer */}
          <Wrapper>
            <label>{t("common:time")}</label>
            <InputGroup unit="h">
              <FormInput
                name="breedingDuration"
                type="text"
                value={formData.breedingDuration}
                onChange={onChange}
              />
            </InputGroup>
          </Wrapper>

          {/* Zuchtchance */}
          <Wrapper>
            <label>{t("animals:breeding.breedingChance")}</label>
            <InputGroup unit="%">
              <FormInput
                name="breedingChance"
                type="number"
                value={formData.breedingChance}
                onChange={onChange}
              />
            </InputGroup>
          </Wrapper>
        </FieldsGrid>
      </SectionLayout>
    </InfoAccordion>
  );
}

const SectionLayout = styled.div`
  display: flex;
  gap: 25px;
  align-items: flex-start;
  padding: 10px 0;

  @media (max-width: 500px) {
    flex-direction: column;
    align-items: center;
  }
`;

const BadgeWrapper = styled.div`
  padding-top: 10px;
  flex-shrink: 0;
`;

const FieldsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  flex: 1;
  width: 100%;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  label { font-size: 0.85rem; font-weight: 600; color: #5d7a2a; }
`;