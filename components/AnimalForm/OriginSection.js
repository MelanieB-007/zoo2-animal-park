import React, { useState, useEffect } from "react";
import useSWR from "swr";
import styled from "styled-components";
import { useTranslation } from "next-i18next";

import InfoAccordion from "..//page-structure/Elements/InfoAccordion";
import OriginTransfer from "../ui/OriginTransfer";


export default function OriginSection({ initialData, setFormData }) {
  const { t } = /** @type {any} */ (useTranslation(["animals", "common"]));
  const { data: origins } = useSWR('/api/origins');

  // Initialisiere mit initialData, falls vorhanden
  const [selectedOrigins, setSelectedOrigins] = useState(initialData || []);

  // WICHTIG: Synchronisiere den lokalen State, wenn die Daten vom Server kommen
  useEffect(() => {
    if (initialData && initialData.length > 0 && selectedOrigins.length === 0) {
      setSelectedOrigins(initialData);
    }
  }, [initialData, selectedOrigins.length]);

  // Synchronisation zurück zum Haupt-Formular
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      origins: selectedOrigins
    }));
  }, [selectedOrigins, setFormData]);

  // 4. Transfer-Logik
  const moveRight = (item) => setSelectedOrigins([...selectedOrigins, item]);
  const moveLeft = (item) => setSelectedOrigins(selectedOrigins.filter(o => o.id !== item.id));

  // 5. Verfügbare Liste berechnen
  const availableOrigins = Array.isArray(origins)
    ? origins.filter((o) => !selectedOrigins.find((s) => s.id === o.id))
    : [];

  return (
    <InfoAccordion
      title={t("animals:originSection.originTitle")}
      icon="/images/herkunft/shop.webp"
      defaultOpen={false}
    >
      <StyledContent>
        <p className="description">
          {t("animals:originSection.originDescription")}
        </p>

        <OriginTransfer
          available={availableOrigins}
          selected={selectedOrigins}
          onMoveRight={moveRight}
          onMoveLeft={moveLeft}
        />
      </StyledContent>
    </InfoAccordion>
  );
}

const StyledContent = styled.div`
  padding: 10px 0;
  .description {
    font-size: 0.85rem;
    color: #88a04d;
    margin-bottom: 15px;
    font-style: italic;
  }
`;