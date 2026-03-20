import React from "react";
import styled from "styled-components";
import { useTranslation } from "next-i18next";
import useSWR from "swr";

import InfoAccordion from "../page-structure/Elements/InfoAccordion";
import FormTextarea from "../ui/FormTextarea";


export default function TranslationDescriptionSection({ translations = [], setFormData }) {
  const { t } = /** @type {any} */ (useTranslation(["animals", "common"]));
  const { data: dbLanguages } = useSWR('/api/languages');

  // Hilfsfunktion, um den vollen Namen der Sprache zu finden (z.B. "en" -> "Englisch")
  const getLanguageName = (code) => {
    if (!dbLanguages) return code.toUpperCase();
    const lang = dbLanguages.find((l) => l.code === code);
    return lang ? lang.name : code.toUpperCase();
  };

  const handleDescChange = (id, value) => {
    setFormData((prev) => ({
      ...prev,
      translations: prev.translations.map((tr) =>
        tr.id === id ? { ...tr, description: value } : tr
      ),
    }));
  };

  // Wir rendern die Sektion nur, wenn überhaupt Sprachen hinzugefügt wurden
  if (translations.length === 0) return null;

  return (
    <InfoAccordion
      title={t("animals:descriptions_intl") || "Beschreibungen (International)"}
      icon="/images/icons/description_intl.png"
      defaultOpen={true}
    >
      <ContentWrapper>
        {translations.map((tr) => (
          <Wrapper key={tr.id}>
            <label htmlFor={`desc-${tr.id}`}>
              {t("common:description")} ({getLanguageName(tr.spracheCode)})
            </label>
            <FormTextarea
              id={`desc-${tr.id}`}
              value={tr.description || ""}
              onChange={(e) => handleDescChange(tr.id, e.target.value)}
              placeholder={`${t("common:description")}...`}
              $minHeight="120px"
            />
          </Wrapper>
        ))}
      </ContentWrapper>
    </InfoAccordion>
  );
}

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 10px 0;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    font-size: 0.85rem;
    font-weight: 600;
    color: #5d7a2a;
    display: flex;
    align-items: center;
    &::before {
      content: "•";
      margin-right: 6px;
      color: #b5ce7e;
    }
  }
`;