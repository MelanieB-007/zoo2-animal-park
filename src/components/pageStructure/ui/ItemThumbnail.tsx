"use client";

import React, { ComponentProps } from "react";
import styled from "styled-components";
import { useTranslations } from "next-intl";

import GameIcon from "@/components/icons/GameIcon";
import Tooltip from "@/components/pageStructure/ui/Tooltip";
import { habitatColors } from "@/constants/habitatConstants";

// 1. Wir extrahieren den exakten Typ aus der Tooltip-Komponente
type TooltipAlign = ComponentProps<typeof Tooltip>["align"];

interface ItemThumbnailProps {
  image: string;
  name?: string;
  habitat?: { name: string };
  size?: number;
  category: string;
  tooltip?: boolean;
  // 2. Wir nutzen den extrahierten Typ hier
  tooltipAlign?: TooltipAlign;
}

export default function ItemThumbnail({
  image,
  name,
  habitat,
  size = 55,
  category,
  tooltip = true,
  // 3. WICHTIG: Falls du einen Default setzt, stelle sicher,
  // dass er einer der erlaubten Werte des Tooltips ist
  tooltipAlign = "top" as TooltipAlign,
}: ItemThumbnailProps) {
  const t = useTranslations("animals");
  const habitatKey = (habitat?.name || "standard").toLowerCase();

  const thumbnail = (
    <StyledThumbnail $habitat={habitatKey} $size={size}>
      <GameIcon
        type={category}
        fileName={image}
        size={size - 10}
        bordercolor="transparent"
      />
    </StyledThumbnail>
  );

  if (tooltip && name) {
    return (
      <Tooltip text={name} align={tooltipAlign}>
        {thumbnail}
      </Tooltip>
    );
  }

  return thumbnail;
}

// --- Styles ---

const StyledThumbnail = styled.div<{ $habitat: string; $size: number }>`
  position: relative;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => 
    props.theme.colors.ui.surface} 
  flex-shrink: 0;

  /* Dynamischer Rahmen basierend auf dem Habitat-Key */
  border: 3px solid
    ${({ $habitat }) => 
      habitatColors[$habitat]?.main || "#8dbd5b"};

  transition:
    transform 0.2s ease-in-out,
    box-shadow 0.2s,
    border-color 0.2s;
  cursor: pointer;
  z-index: 1;

  /* Hover-Effekt für die Detailansicht */
  &:hover {
    transform: scale(1.6);
    z-index: 100;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
    border-color: ${({ $habitat }) =>
      habitatColors[$habitat]?.light || "#a8d384"};
  }
`;