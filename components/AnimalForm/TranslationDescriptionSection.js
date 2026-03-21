import React from "react";
import useSWR from "swr";
import styled from "styled-components";
import { useTranslation } from "next-i18next";

import DynamicRowInput from "../ui/DynamicRowInput";
import InfoAccordion from "../page-structure/Elements/InfoAccordion";

export default function TranslationDescriptionSection({ translations = [], setFormData }) {
  const { t } = /** @type {any} */ (useTranslation(["animals", "common"]));
  const { data: dbLanguages } = useSWR('/api/languages');

  // Wie bei den Namen filtern wir Deutsch aus (da DE meist in der Hauptsektion steht)
  const languageOptions = Array.isArray(dbLanguages)
    ? dbLanguages
      .filter(lang => lang.code !== 'de')
      .map(lang => ({ value: lang.code, label: lang.name }))
    : [];

  const allLanguagesUsed = languageOptions.length > 0 &&
    translations.length >= languageOptions.length;

  // WICHTIG: Die onAdd Funktion muss identisch zur Name-Sektion sein,
  // damit das Objekt im Array alle nötigen Keys (name & description) hat.
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
            name: "", // Initialwert für Namen
            description: "" // Initialwert für Beschreibung
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
      title={t("animals:translationDescriptionSection.descriptionIntl")}
      icon="/images/icons/globus.png"
      defaultOpen={false}
    >
      <StyledDynamicWrapper>
        <DynamicRowInput
          label={t("animals:translationDescriptionSection.descriptionIntl")}
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
              key: "description",
              label: t("common:description") || "Beschreibung",
              type: "textarea", // Hier nutzen wir die Textarea für längere Texte
              $flex: 1.4,
              placeholder: t("common:descriptionPlaceholder") || "Beschreibung eingeben..."
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
  h4 {
    display: none;
  }
`;