"use client";

import React, { useState, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import styled from "styled-components";

import { theme } from "@/styles/theme";
import { AnimalWithRelations } from "@/interfaces/animal";
import BiomeBadge from "@/components/pageStructure/ui/BiomeBadge";
import { getTranslatedName } from "@/utils/TranslationHelper";
import { getUniqueBiomes } from "@/utils/AnimalHelper";
import CustomSelect, { SelectOption } from "@/components/forms/CustomSelect";

interface CustomBiomeFilterProps {
  animals: AnimalWithRelations[];
  selectedBiome: string;
  onSelect: (biome: string) => void;
}

export default function CustomBiomeFilter({
  animals = [],
  selectedBiome,
  onSelect,
}: CustomBiomeFilterProps) {
  const t = useTranslations();
  const locale = useLocale(); // Holt die aktuelle Sprache (de, en, etc.)
  const [isOpen, setIsOpen] = useState(false);

  // 1. Logik zum Extrahieren der Biome
  const uniqueBiomes = useMemo(() => getUniqueBiomes(animals), [animals]);

  // 2. Das aktuell gewählte Biome-Objekt finden
  const currentBiome = useMemo(
    () => uniqueBiomes.find((b) => b?.name === selectedBiome),
    [uniqueBiomes, selectedBiome]
  );

  // 3. Header-Label definieren
  const renderLabel = () => {
    if (selectedBiome === "Alle") {
      // Umgestellt auf Punkt-Notation
      return <span>{t("animals.filter.all_enclosures")}</span>;
    }
    return (
      <SelectedValue>
        {currentBiome && (
          <BiomeBadge biome={currentBiome} showTooltip={false} />
        )}
        <LabelText>
          {/* i18n.language durch locale ersetzt */}
          {getTranslatedName(currentBiome, locale) || selectedBiome}
        </LabelText>
      </SelectedValue>
    );
  };

  return (
    <CustomSelect
      label={renderLabel()}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      minWidth="220px"
    >
      {/* Option: Alle */}
      <SelectOption
        onClick={() => {
          onSelect("Alle");
          setIsOpen(false);
        }}
      >
        {t("animals.filter.all_enclosures")}
      </SelectOption>

      {/* Dynamische Biome-Optionen */}
      {uniqueBiomes.map((biome) => (
        <SelectOption
          key={biome.name}
          onClick={() => {
            onSelect(biome.name);
            setIsOpen(false);
          }}
        >
          <BiomeBadge biome={biome} showTooltip={false} />
          {/* i18n.language durch locale ersetzt */}
          <LabelText>{getTranslatedName(biome, locale)}</LabelText>
        </SelectOption>
      ))}
    </CustomSelect>
  );
}

// --- Styles ---
const SelectedValue = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const LabelText = styled.span`
  font-weight: 600;
  color: ${theme.colors.brand.petrol};
`;
