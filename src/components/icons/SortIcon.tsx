"use client";

import React from "react";
import styled from "styled-components";

import { theme } from "@/styles/theme";

// Wir definieren die erlaubten Sortier-Richtungen
type SortDirection = "asc" | "desc" | null;

interface SortIconProps {
  columnKey: string;
  currentSortBy: string | null;
  direction: SortDirection;
}

export default function SortIcon({
  columnKey,
  currentSortBy,
  direction,
}: SortIconProps) {
  // Wenn diese Spalte gerade NICHT sortiert wird
  if (currentSortBy !== columnKey) {
    return <StyledIcon>↕</StyledIcon>;
  }

  // Wenn diese Spalte aktiv sortiert wird
  return <StyledDirection>{direction === "asc" ? "▲" : "▼"}</StyledDirection>;
}

const StyledIcon = styled.span`
  color: #ccc;
  margin-left: 8px;
  font-size: 0.8rem;
  opacity: 0.6;
  user-select: none;
`;

const StyledDirection = styled.span`
  /* Nutze hier dein Brand-Grün aus dem Theme, falls vorhanden */
  color: ${theme.colors.brand.petrolLight || "#4ca64c"};
  margin-left: 8px;
  font-weight: bold;
  font-size: 0.9rem;
  user-select: none;
`;