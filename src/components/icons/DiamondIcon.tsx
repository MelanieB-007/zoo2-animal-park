"use client";

import React from "react";
import styled from "styled-components";
import NextImage from "next/image";
import { useTranslations } from "next-intl";


import { theme } from "@/styles/theme";
import FormattedNumber from "@/utils/FormattedNumber";

interface DiamondIconProps {
  value?: number | string | null;
  altText?: string;
  size?: number;
}

export default function DiamondIcon({
  value,
  altText,
  size = 20,
}: DiamondIconProps) {
  // Wir holen uns die Übersetzung für den Fall, dass kein altText übergeben wurde
  const t = useTranslations("currencies");

  const hasValue = value !== undefined && value !== null;

  return (
    <DiamondWrapper>
      {hasValue && (
        <DiamondValue>
          <FormattedNumber value={value} />
        </DiamondValue>
      )}
      <NextImage
        src="/images/currency/diamant.webp"
        // Nutzt den übergebenen Text ODER den Standard aus der JSON
        alt={altText || t("diamonds")}
        width={size}
        height={size}
        priority={size > 40} // Falls es mal ein riesiges Icon ist, schneller laden
      />
    </DiamondWrapper>
  );
}

const DiamondWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  vertical-align: middle;

  img {
    object-fit: contain;
    filter: drop-shadow(1px 1px 1px rgba(0, 0, 0, 0.15));
  }
`;

const DiamondValue = styled.span`
  font-weight: 700;
  font-size: 0.95rem;
  color: ${theme.colors.brand.green};
`;