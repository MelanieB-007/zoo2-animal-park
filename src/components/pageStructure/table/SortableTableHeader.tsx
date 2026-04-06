"use client";

import React, { ComponentProps } from "react";
import styled, { css } from "styled-components";

import Tooltip from "@/components/pageStructure/ui/Tooltip";
import SortIcon from "@/components/icons/SortIcon";


interface SortableTableHeaderProps {
  text: React.ReactNode;
  columnKey: string;
  onSort: () => void;
  currentSortBy: string | null;
  sortDirection: "asc" | "desc" | null;
  align?: "left" | "right" | "center";
  tooltipText?: string;
  desktopOnly?: boolean;
}

export default function SortableTableHeader({
  text,
  columnKey,
  onSort,
  currentSortBy,
  sortDirection,
  align = "left",
  tooltipText,
  desktopOnly = false,
}: SortableTableHeaderProps) {
  const isActive = currentSortBy === columnKey;

  const headerContent = tooltipText ? (
    <Tooltip text={tooltipText}>
      {text}
    </Tooltip>
  ) : (
    text
  );

  return (
    <SortableTh
      onClick={onSort}
      $align={align}
      $desktopOnly={desktopOnly}
      $isActive={isActive}
    >
      <HeaderWrapper $align={align}>
        {headerContent}
        <SortIcon
          columnKey={columnKey}
          currentSortBy={currentSortBy}
          direction={sortDirection}
        />
      </HeaderWrapper>
    </SortableTh>
  );
}

// --- Styles ---

const SortableTh = styled.th<{
  $align: string;
  $desktopOnly: boolean;
  $isActive: boolean;
}>`
  cursor: pointer;
  user-select: none;
  transition: all 0.2s;
  white-space: nowrap;
  padding: 12px 15px;
  text-align: ${({ $align }) => $align};

  /* Aktiver State oder Hover nutzt deine Khaki-Farben aus dem CSS/Theme */
  background-color: ${({ $isActive, theme }) =>
    $isActive ? "var(--color-khaki-green-darker)" : "transparent"};

  color: ${({ $isActive }) =>
    $isActive ? "var(--color-khaki-green)" : "inherit"};

  /* Desktop Only Logik */
  ${({ $desktopOnly }) =>
    $desktopOnly &&
    css`
      display: none;
      @media (min-width: 1200px) {
        display: table-cell;
      }
    `}

  &:hover {
    background-color: var(--color-khaki-green-darker) !important;
    color: var(--color-khaki-green);
  }
`;

const HeaderWrapper = styled.div<{ $align: string }>`
  display: flex;
  align-items: center;
  gap: 8px;

  justify-content: ${({ $align }) => {
    if ($align === "right") return "flex-end";
    if ($align === "center") return "center";
    return "flex-start";
  }};
`;