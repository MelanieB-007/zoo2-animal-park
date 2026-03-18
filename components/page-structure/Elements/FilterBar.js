import React from "react";
import styled from "styled-components";
import { useTranslation } from "next-i18next";
import CustomGehegeFilter from "./CustomGehegeFilter";
import CustomLevelFilter from "./CustomLevelFilter";

export default function FilterBar({
  searchTerm,
  setSearchTerm,
  selectedGehege,
  setSelectedGehege,
  selectedLevel,
  setSelectedLevel,
  setCurrentPage,
  animals = [],
  showGehegeFilter = true,
  showLevelFilter = true,
}) {
  const { t } = /** @type {any} */ (
    useTranslation(["animals", "common"])
  );

  function handleSearch(e) {
    setSearchTerm(e.target.value);
    if (setCurrentPage) {
      setCurrentPage(1);
    }
  }

  function handleGehegeChange(value) {
    setSelectedGehege(value);
    if (setCurrentPage) {
      setCurrentPage(1);
    }
  }

  function handleLevel(value) {
    setSelectedLevel(value);
    if (setCurrentPage) {
      setCurrentPage(1);
    }
  }

  return (
    <StyledFilterBar>
      <SearchInput
        type="text"
        placeholder={t("animals:search_placeholder")}
        value={searchTerm}
        onChange={handleSearch}
      />

      {showGehegeFilter && (
        <CustomGehegeFilter
          animals={animals}
          selectedGehege={selectedGehege}
          onSelect={handleGehegeChange}
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

  background: var(--color-white);
  padding: 20px;
  margin-bottom: 25px;

  border: 2px solid #4ca64c;
  border-radius: var(--border-radius);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
`;

const SearchInput = styled.input`
  flex: 2;
  min-width: 250px;
  padding: 12px 16px;
  border: 2px solid #e0e7d5;
  border-radius: 12px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: var(--color-green-lighter);
    box-shadow: 0 0 0 4px rgba(141, 189, 91, 0.1);
  }
`;