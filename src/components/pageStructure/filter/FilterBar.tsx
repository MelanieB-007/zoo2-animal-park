"use client";

import React, { ChangeEvent, Dispatch, SetStateAction } from "react";
import styled from "styled-components";
import { useTranslations } from "next-intl";

import CustomBiomeFilter from "./CustomBiomeFilter";
import { AnimalWithRelations } from "@/interfaces/animal";
import { theme } from "@/styles/theme";

import CustomLevelFilter from "@/components/pageStructure/filter/CustomLevelFilter";

// 1. Wir definieren ein Interface für die Props
interface FilterBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedBiomes: string;
  setSelectedBiomes: (value: string) => void;
  selectedLevel: string;
  setSelectedLevel: (value: string) => void;
  setCurrentPage?: Dispatch<SetStateAction<number>>;
  animals?: AnimalWithRelations[];
  showBiomesFilter?: boolean;
  showLevelFilter?: boolean;
}

export default function FilterBar({
  searchTerm,
  setSearchTerm,
  selectedBiomes,
  setSelectedBiomes,
  selectedLevel,
  setSelectedLevel,
  setCurrentPage,
  animals = [],
  showBiomesFilter = true,
  showLevelFilter = true,
}: FilterBarProps) {

  const t = useTranslations();

  // 2. Das Event-Objekt typisieren
  function handleSearch(e: ChangeEvent<HTMLInputElement>) {
    setSearchTerm(e.target.value);
    setCurrentPage?.(1);
  }

  function handleBiomeChange(value: string) {
    setSelectedBiomes(value);
    setCurrentPage?.(1);
  }

  function handleLevel(value: string) {
    setSelectedLevel(value);
    setCurrentPage?.(1);
  }

  return (
    <StyledFilterBar>
      <SearchInput
        type="text"
        placeholder={t("animals:filter.search_placeholder")}
        value={searchTerm}
        onChange={handleSearch}
      />

      {showBiomesFilter && (
        <CustomBiomeFilter
          animals={animals}
          selectedBiome = {selectedBiomes}
          onSelect={handleBiomeChange}
        />
      )}

      {showLevelFilter && (
        <CustomLevelFilter
          animals={animals}
          selectedLevel={selectedLevel}
          onSelect={handleLevel}
        />
      )}
    </StyledFilterBar>
  );
}


const StyledFilterBar = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
  flex-wrap: wrap;
  background: ${theme.colors.ui.surface};
  padding: 20px;
  margin-bottom: 25px;
  border: 2px solid #4ca64c;
  border-radius: ${theme.borderRadius};
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
`;

const SearchInput = styled.input`
  flex: 2;
  min-width: 250px;
  padding: 12px 16px;
  border: 2px solid var(--color-selectHeader);
  border-radius: 12px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: ${theme.colors.ui.border};
    box-shadow: 0 0 0 4px rgba(141, 189, 91, 0.1);
  }
`;
