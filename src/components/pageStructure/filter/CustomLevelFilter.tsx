"use client";

import React, { useState, useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import styled from "styled-components";

import { theme } from "@/styles/theme";
import { AnimalWithRelations } from "@/interfaces/animal";
import CustomSelect, { SelectOption } from "@/components/forms/CustomSelect";
import StallLevelBadge from "@/components/pageStructure/ui/StallLevelBadge";


interface CustomLevelFilterProps {
  animals: AnimalWithRelations[];
  selectedLevel: string | number;
  onSelect: (level: string) => void;
}

export default function CustomLevelFilter({
  animals = [],
  selectedLevel,
  onSelect,
}: CustomLevelFilterProps) {
  const t = useTranslations();

  const [isOpen, setIsOpen] = useState(false);

  // 1. Die Logik bleibt hier, da sie spezifisch für "Level" ist
  const uniqueLevels = useMemo(() => {
    return [
      ...new Set(
        animals
          .map((a) => a.stalllevel)
          .filter((lvl): lvl is number => lvl !== null && lvl !== undefined)
      ),
    ].sort((a, b) => a - b);
  }, [animals]);

  // 2. Wir definieren, was im geschlossenen Header angezeigt wird
  const renderLabel = () => {
    if (selectedLevel === "Alle") {
      return <span>{t("animals:filter.all_levels")}</span>;
    }
    return (
      <SelectedValue>
        <ScaledBadge>
          <StallLevelBadge
            level={Number(selectedLevel)}
            habitat="gras"
            showTooltip={false}
            size={60}
          />
        </ScaledBadge>
        <LabelText>
          {t("animals:filter.level_label")} {selectedLevel}
        </LabelText>
      </SelectedValue>
    );
  };

  return (
    <CustomSelect
      label={renderLabel()}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      minWidth="180px"
    >
      {/* Option: Alle */}
      <SelectOption
        onClick={() => {
          onSelect("Alle");
          setIsOpen(false);
        }}
      >
        {t("animals:filter.all_levels")}
      </SelectOption>

      {/* Dynamische Level-Optionen */}
      {uniqueLevels.map((lvl) => (
        <SelectOption
          key={lvl}
          onClick={() => {
            onSelect(String(lvl));
            setIsOpen(false);
          }}
        >
          <ScaledBadge>
            <StallLevelBadge
              level={lvl}
              habitat="gras"
              showTooltip={false}
              size={60}
            />
          </ScaledBadge>
          <LabelText>
            {t("animals:filter.level_label")} {lvl}
          </LabelText>
        </SelectOption>
      ))}
    </CustomSelect>
  );
}

// --- Spezifische Styles für diesen Filter ---

const SelectedValue = styled.div`
  display: flex;
  align-items: center;
`;

const ScaledBadge = styled.div`
  transform: scale(0.7);
  margin: -10px;
`;

const LabelText = styled.span`
  font-weight: 600;
  color: ${theme.colors.brand.petrol};
  margin-left: 5px;
`;
