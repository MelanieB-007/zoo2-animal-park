import React from "react";
import useSWR from "swr";
import styled from "styled-components";
import { useTranslation } from "next-i18next";

import DynamicRowInput from "../ui/DynamicRowInput";
import InfoAccordion from "../page-structure/Elements/InfoAccordion";

export default function TranslationNameSection({ translations = [], setFormData }) {
  const { t } = /** @type {any} */ (useTranslation(["animals", "common"]));
  const { data: dbLanguages } = useSWR('/api/languages');

  // Filtert Deutsch aus, da das Tier den Hauptnamen (DE) in der BasicSection hat
  const languageOptions = Array.isArray(dbLanguages)
    ? dbLanguages
      .filter(lang => lang.code !== 'de')
      .map(lang => ({ value: lang.code, label: lang.name }))
    : [];

  const allLanguagesUsed = languageOptions.length > 0 &&
    translations.length >= languageOptions.length;

  const onAdd = () => {
    const usedCodes = translations.map(t => t.spracheCode);
    const nextAvailable = languageOptions.find(opt => !usedCodes.includes(opt.value));

    if (nextAvailable) {
      setFormData(prev => ({
        ...prev,
        translations: [
          ...prev.translations,
          {
            id: Date.now(),
            spracheCode: nextAvailable.value,
            name: "",
            description: "" // Wir initialisieren den Key hier, damit er für die andere Sektion bereitsteht
          }
        ]
      }));
    }
  };

  const onRemove = (id) => {
    setFormData(prev => ({
      ...prev,
      translations: prev.translations.filter(t => t.id !== id)
    }));
  };

  const onChange = (id, field, val) => {
    setFormData(prev => ({
      ...prev,
      translations: prev.translations.map(t => t.id === id ? { ...t, [field]: val } : t)
    }));
  };

  return (
    <InfoAccordion
      title={t("animals:translationNameSection.otherLanguages") || "Weitere Sprachen"}
      icon="/images/icons/globus.png"
      defaultOpen={false}
    >
      <StyledDynamicWrapper>
        <DynamicRowInput
          label={t("common:namesIntl") || "Namen in anderen Sprachen"}
          rows={translations}
          columns={[
            {
              key: "spracheCode",
              label: t("common:language") || "Sprache",
              type: "select",
              $flex: 0.6,
              options: languageOptions
            },
            {
              key: "name",
              label: t("common:name") || "Name",
              type: "text",
              $flex: 1.4
            }
          ]}
          onAdd={onAdd}
          onRemove={onRemove}
          onChange={onChange}
          disabledAdd={allLanguagesUsed}
        />
      </StyledDynamicWrapper>
    </InfoAccordion>
  );
}

const StyledDynamicWrapper = styled.div`
  padding-top: 5px;

  /* Blendet die interne H4 von DynamicRowInput aus, da wir das Label-Prop nutzen */
  h4 {
    display: none;
  }
`;