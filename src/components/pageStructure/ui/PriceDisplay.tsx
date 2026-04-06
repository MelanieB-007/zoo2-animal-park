"use client";

import React from "react";
import styled from "styled-components";
import { useTranslations } from "next-intl";
import DiamondIcon from "@/components/icons/DiamondIcon";
import ZoodollarIcon from "@/components/icons/ZoodollarIcon";



interface PriceDisplayProps {
  value: number | string;
  type: string;
}

export default function PriceDisplay({ value, type }: PriceDisplayProps) {
  const t = useTranslations("common");

  // Wir prüfen den Typ (aus der DB kommt oft "Diamanten" oder "Zoodollar")
  const isDiamond = type?.toLowerCase() === "diamanten";

  // Wir holen die Alt-Texte direkt aus den Sprachdateien
  const altText = isDiamond
    ? t("currencies.diamonds")
    : t("currencies.zoodollars");

  return (
    <PriceWrapper title={altText}>
      {isDiamond ? (
        <DiamondIcon value={value} altText={altText} />
      ) : (
        <ZoodollarIcon value={value} altText={altText} />
      )}
    </PriceWrapper>
  );
}

const PriceWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  padding-right: 5px;
`;