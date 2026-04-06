"use client";

import React from "react";
import styled from "styled-components";
import { useTranslations } from "next-intl";

import { theme } from "@/styles/theme";
import Tooltip from "@/components/pageStructure/ui/Tooltip";
import GameIcon from "@/components/icons/GameIcon";

// 1. Interface für die Props
interface StallLevelBadgeProps {
  level: number | string;
  habitat?: string;
  showTooltip?: boolean;
  size?: number;
}

// 2. Interfaces für die Styled Components
interface SizeProps {
  $size: number;
}

export default function StallLevelBadge({
  level,
  habitat = "gras",
  showTooltip = true,
  size = 64,
}: StallLevelBadgeProps) {
  const t = useTranslations();

  const BadgeContent = (
    <StallContainer $size={size}>
      <GameIcon
        fileName="Stall.png"
        type={`gehege/${habitat.toLowerCase()}`}
        size={size}
      />
      <LevelBadgeCircle $size={size}>{level}</LevelBadgeCircle>
    </StallContainer>
  );

  if (!showTooltip) {
    return BadgeContent;
  }

  return (
    <Tooltip
      text={`${t("animals:tooltips.level")}: ${level}`}
      position="bottom"
    >
      {BadgeContent}
    </Tooltip>
  );
}

// --- Styled Components ---

const StallContainer = styled.div<SizeProps>`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  width: ${(props) => props.$size}px;
  height: ${(props) => props.$size}px;

  /* Erlaubt dem Level-Kreis, über den Rand zu ragen */
  overflow: visible !important;

  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.1);
    z-index: 10;
  }
`;

const LevelBadgeCircle = styled.div<SizeProps>`
  position: absolute;

  bottom: -5px;
  right: -5px;

  /* Dynamische Größe berechnen */
  ${({ $size }) => {
    const dynamicSize = Math.max($size * 0.45, 22);
    return `
      width: ${dynamicSize}px;
      height: ${dynamicSize}px;
      font-size: ${Math.max($size * 0.25, 11)}px;
    `;
  }}

  display: flex;
  align-items: center;
  justify-content: center;

  /* Styling des Kreises - Nutzt jetzt das Theme */
  background: ${theme.colors.brand.green};
  border: 2px solid ${theme.colors.ui.surface};
  border-radius: 50%;

  color: ${theme.colors.ui.surface};
  font-weight: 900;
  font-family: ${theme.fonts.text}, sans-serif;

  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  z-index: 5;
`;
