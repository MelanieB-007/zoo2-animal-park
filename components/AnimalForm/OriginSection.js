import React, { useState, useEffect } from "react";
import useSWR from "swr";
import styled from "styled-components";
import { useTranslation } from "next-i18next";

import InfoAccordion from "..//page-structure/Elements/InfoAccordion";
import OriginTransfer from "../ui/OriginTransfer";


export default function OriginSection({ initialData, setFormData }) {
  const { t } = /** @type {any} */ (useTranslation(["animals", "common"]));

  // 1. Daten laden
  const { data: origins } = useSWR('/api/origins');

  // 2. Lokaler State für die Auswahl (initialisiert mit bereits gespeicherten Daten)
  const [selectedOrigins, setSelectedOrigins] = useState(initialData || []);

  // 3. Synchronisation mit dem Haupt-Formular-State
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      origins: selectedOrigins // Schreibt das Array der gewählten Objekte in formData
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
      title={t("animals:obtainment_title") || "Erhältlichkeit"}
      icon="/images/icons/chest.png"
      defaultOpen={false}
    >
      <StyledContent>
        <p className="description">
          {t("animals:obtainment_description") || "Woher bekommt man dieses Tier?"}
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