import React from "react";
import styled from "styled-components";
import { useTranslation } from "next-i18next";
import useSWR from "swr";

import InfoAccordion from "..//page-structure/Elements/InfoAccordion";
import FormSelect from "../ui/FormSelect";
import FormInput from "../ui/FormInput";
import InputGroup from "../ui/InputGroup";


export default function EnclosureTypeSection({ formData, onChange }) {
  const { t } = /** @type {any} */ (useTranslation(["animals", "common"]));

  // Typische Gehegetypen aus Zoo 2
  const { data: biomes } = useSWR('/api/biomes');

  return (
    <InfoAccordion
      title={t("common:enclosure")}
      icon="/images/gehege/gras/Gehege.webp"
      defaultOpen={false}
    >
      <FlexContainer>
        {/* Gehegetyp */}
        <Wrapper>
          <label htmlFor="enclosureType">{t("common:enclosureType")}</label>
          <FormSelect
            id="enclosureType"
            name="enclosureType"
            value={formData.enclosureType}
            onChange={onChange}
            options={biomes}
            $width="100%"
          />
        </Wrapper>

        {/* Spielzeug */}
        <Wrapper>
          <label htmlFor="toy">{t("animals:toy")}</label>
          <InputGroup icon="">
            <FormInput
              id="toy"
              name="toy"
              type="text"
              value={formData.toy}
              onChange={onChange}
              placeholder={t("animals:toyPlaceholder")}
              $width="100%"
            />
          </InputGroup>
        </Wrapper>
      </FlexContainer>
    </InfoAccordion>
  );
}

const FlexContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 10px 0;

  @media (min-width: 600px) {
    flex-direction: row;
    gap: 30px;
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;

  label {
    font-size: 0.85rem;
    font-weight: 600;
    color: #5d7a2a;
  }
`;