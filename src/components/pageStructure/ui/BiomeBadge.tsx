"use client";

import styled from "styled-components";
import NextImage from "next/image";
import { useTranslations } from "next-intl";

import { theme } from "@/styles/theme";
import { habitatColors } from "@/constants/habitatConstants";
import Tooltip from "./Tooltip";

interface BiomeBadgeProps {
  biome: {
    name: string;
  };
  showTooltip?: boolean;
  size?: number;
}

interface BadgeWrapperProps {
  $type: string;
}

export default function BiomeBadge({ biome, showTooltip, size = 20 }:BiomeBadgeProps) {
  const t  = useTranslations();

  const shouldShowTooltip = showTooltip !== false;

  const safeType = biome?.name?.toLowerCase() || "default";

  const BadgeContent = (
    <BadgeWrapper $type={safeType}>
      <NextImage
        src={`/images/gehege/icons/${safeType}.webp`}
        alt={biome?.name || t("common:enclosure")}
        width={size}
        height={size}
      />
    </BadgeWrapper>
  );

  return shouldShowTooltip ? (
    <Tooltip text={`${biome?.name} ${t("animals:table.enclosure")}`}>
      {BadgeContent}
    </Tooltip>
  ) : (
    BadgeContent
  );
}

const BadgeWrapper = styled.div<BadgeWrapperProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 6px 14px;
  border-radius: ${theme.borderRadius};
  background-color: ${props =>
          (habitatColors[props.$type]?.main || "#666") + "33"};
  border: 2px solid ${props =>
          habitatColors[props.$type]?.main || "#666"};
  font-weight: 800;
  font-size: 0.8rem;
  text-transform: uppercase;
`;
