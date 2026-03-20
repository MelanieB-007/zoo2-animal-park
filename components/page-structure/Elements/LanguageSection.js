import React from "react";
import useSWR from "swr";
import styled from "styled-components";
import DynamicRowInput from "./DynamicRowInput";
import { useTranslation } from "next-i18next";
import InfoAccordion from "./InfoAccordion"; // Pfad prüfen!

export default function LanguageSection({ translations = [], setFormData }) {
  const { t } = /** @type {any} */ (useTranslation(["animals", "common"]));
  const { data: dbLanguages } = useSWR('/api/languages');

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
        translations: [...translations, { id: Date.now(), spracheCode: nextAvailable.value, name: "" }]
      }));
    } else {
      // Feedback für den User, falls der Button geklickt wird
      alert("Alle verfügbaren Sprachen wurden bereits hinzugefügt.");
    }
  };

  const onRemove = (id) => {
    setFormData(prev => ({
      ...prev,
      translations: translations.filter(t => t.id !== id)
    }));
  };

  const onChange = (id, field, val) => {
    setFormData(prev => ({
      ...prev,
      translations: translations.map(t => t.id === id ? { ...t, [field]: val } : t)
    }));
  };

  return (
    <InfoAccordion
      title={t("animals:other_languages") || "Weitere Sprachen"}
      icon="/images/icons/languages.png"
      defaultOpen={false}
    >
      <StyledDynamicWrapper>
      <DynamicRowInput
        label="Sprachen"
        rows={translations}
        columns={[
          {
            key: "spracheCode",
            label: "Sprache",
            type: "select",
            flex: 0.5,
            options: languageOptions
          },
          {
            key: "name",
            label: "Name",
            type: "text",
            flex: 1
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