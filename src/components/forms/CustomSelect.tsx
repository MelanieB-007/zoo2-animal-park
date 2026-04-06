"use client";

import React, { useRef, useEffect, ReactNode } from "react";
import styled from "styled-components";

import { theme } from "@/styles/theme";

interface CustomSelectProps {
  label: ReactNode; // Was im geschlossenen Header steht
  children: ReactNode; // Die Liste der Optionen (SelectOption)
  isOpen: boolean; // Zustand von außen (vom Filter)
  setIsOpen: (open: boolean) => void;
  minWidth?: string;
  className?: string; // Falls du mal eine spezielle CSS-Klasse brauchst
}

export default function CustomSelect({
  label,
  children,
  isOpen,
  setIsOpen,
  minWidth = "200px",
  className,
}: CustomSelectProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Klick-außerhalb Logik
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsOpen]);

  return (
    <SelectWrapper
      ref={wrapperRef}
      $minWidth={minWidth}
      className={className}
    >
      <SelectHeader
        onClick={() => setIsOpen(!isOpen)}
        $isOpen={isOpen}
      >
        <LabelContainer>{label}</LabelContainer>
        <Chevron $isOpen={isOpen}>▼</Chevron>
      </SelectHeader>

      {isOpen && <OptionsList>{children}</OptionsList>}
    </SelectWrapper>
  );
}

// --- Styled Components für die Wiederverwendung ---

const SelectWrapper = styled.div<{ $minWidth: string }>`
  position: relative;
  min-width: ${(props) => props.$minWidth};
  font-family: ${theme.fonts.text};
`;

const SelectHeader = styled.div<{ $isOpen: boolean }>`
  padding: 0 16px;
  height: 48px;
  border: 2px solid
    ${(props) =>
      props.$isOpen ? theme.colors.brand.green : theme.colors.ui.border};
  border-radius: 12px;
  background: ${theme.colors.ui.surface};
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${theme.colors.brand.orange};
  }
`;

const LabelContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  overflow: hidden;
`;

const OptionsList = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  background: ${theme.colors.ui.surface};
  border: 2px solid ${theme.colors.brand.green};
  border-radius: 12px;
  box-shadow: ${theme.shadows.soft};
  z-index: 1000; /* Schön hoch, damit es über Tabellen liegt */
  max-height: 300px;
  overflow-y: auto;

  /* Schöner Scrollbar-Look */
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${theme.colors.brand.greenLight};
    border-radius: 10px;
  }
`;

/**
 * Diese Komponente exportieren wir separat, damit du sie in
 * deinen Filtern als "Items" benutzen kannst.
 */
export const SelectOption = styled.div`
  padding: 10px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${theme.colors.ui.filterHover};
    color: ${theme.colors.brand.petrolDark};
  }

  /* Markierung für das aktuell gewählte Element, falls du mal $active nutzt */
  &.active {
    background: ${theme.colors.ui.filterHover};
    font-weight: bold;
  }
`;

const Chevron = styled.span<{ $isOpen: boolean }>`
  font-size: 0.7rem;
  margin-left: 10px;
  transition: transform 0.3s ease;
  transform: ${(props) => (props.$isOpen ? "rotate(180deg)" : "rotate(0)")};
  color: ${theme.colors.brand.green};
`;
