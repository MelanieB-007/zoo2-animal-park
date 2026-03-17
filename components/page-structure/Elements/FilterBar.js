import React from "react";

import styled from "styled-components";
import { useTranslation } from "next-i18next";

export default function FilterBar({
  searchTerm,
  setSearchTerm,
  selectedGehege,
  setSelectedGehege,
  selectedLevel,
  setSelectedLevel,
  setCurrentPage,
  tiere = [],
  showGehegeFilter = true,
  showLevelFilter = true,
}) {
  const { t } = useTranslation(['common','animal']);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    if (setCurrentPage) setCurrentPage(1);
  };

  const handleGehege = (e) => {
    setSelectedGehege(e.target.value);
    if (setCurrentPage) setCurrentPage(1);
  };

  const handleLevel = (e) => {
    setSelectedLevel(e.target.value);
    if (setCurrentPage) setCurrentPage(1);
  };

  return (
    <StyledFilterBar>
      <SearchInput
        type="text"
        placeholder={t('searchPlaceholder', { ns: 'animal' })}
        value={searchTerm}
        onChange={handleSearch}
      />

      {showGehegeFilter && (
        <GehegeSelect
          value={selectedGehege}
          onChange={handleGehege}
        >
          <option value="Alle">
            {t('allEnclosures', { ns: 'animal' })} ({tiere.length})
          </option>

          {[...new Set(tiere.map((tier) => tier.gehege?.name))]
            .filter(Boolean)
            .map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
        </GehegeSelect>
      )}

      {showLevelFilter && (
        <GehegeSelect
          value={selectedLevel}
          onChange={handleLevel}
        >
          <option value="Alle">
            {t('allLevels', { ns: 'animal' })}
          </option>

          {[...new Set(tiere.map((tier) => tier.stalllevel))]
            .filter((lvl) => lvl !== undefined && lvl !== null)
            .sort((a, b) => a - b)
            .map((lvl) => (
              <option key={lvl} value={String(lvl)}>
                Level {lvl}
              </option>
            ))}
        </GehegeSelect>
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

  border: 2px solid var(--color-greeen);
  border-radius: var(--border-radius);
  box-shadow: 0 4px 15px var(--color-black);
`;

const SearchInput = styled.input`
  flex: 2;
  min-width: 250px;
  padding: 12px 16px;
  border: 2px solid var(--color-white);
  border-radius: var(--border-radius-icon);
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: var(--color-green);
    box-shadow: 0 0 0 4px var( --color-grey-dark);
  }
`;

const GehegeSelect = styled.select`
  flex: 1;
  min-width: 200px;
  padding: 12px 40px 12px 16px;
  border: 2px solid var(--color-white);
  border-radius: var(--border-radius-icon);
  background-color: var(--color-white);
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%238dbd5b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
`;