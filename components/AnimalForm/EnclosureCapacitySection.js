import React from "react";
import styled from "styled-components";
import { useTranslation } from "next-i18next";

import InfoAccordion from "../page-structure/Elements/InfoAccordion";
import DynamicRowInput from "../ui/DynamicRowInput";


export default function EnclosureCapacitySection({ enclosureSizes = [], setFormData }) {
  const { t } = /** @type {any} */ (useTranslation(["animals", "common"]));

  const onAdd = () => {
    // Wir nehmen die letzte Anzahl an Tieren und erhöhen sie um 1 für die neue Zeile
    const lastCount = enclosureSizes.length > 0
      ? enclosureSizes[enclosureSizes.length - 1].animalCount
      : 0;

    setFormData(prev => ({
      ...prev,
      enclosureSizes: [
        ...prev.enclosureSizes,
        { id: Date.now(), animalCount: lastCount + 1, size: 0 }
      ]
    }));
  };

  const onRemove = (id) => {
    setFormData(prev => ({
      ...prev,
      enclosureSizes: enclosureSizes.filter(item => item.id !== id)
    }));
  };

  const onChange = (id, field, val) => {
    setFormData(prev => ({
      ...prev,
      enclosureSizes: enclosureSizes.map(item =>
        item.id === id ? { ...item, [field]: parseInt(val) || 0 } : item
      )
    }));
  };

  return (
    <InfoAccordion
      title={t("animals:biomeCapacity")}
      icon="/images/icons/gehegeVergroesserung.png"
      defaultOpen={false}
    >
      <StyledWrapper>
        <DynamicRowInput
          label={t("animals:capacityTableLabel")}
          rows={enclosureSizes}
          columns={[
            {
              key: "animalCount",
              label: t("animals:animalCount"),
              type: "number",
              $flex: 1,
              placeholder: "1"
            },
            {
              key: "size",
              label: t("animals:requiredSize"),
              type: "number",
              $flex: 1,
              placeholder: "z.B. 10"
            }
          ]}
          onAdd={onAdd}
          onRemove={onRemove}
          onChange={onChange}
        />
      </StyledWrapper>
    </InfoAccordion>
  );
}

const StyledWrapper = styled.div`
  padding-top: 5px;
  
  /* Blendet das interne Label von DynamicRowInput aus, falls doppelt */
  h4 { display: none; }
`;