"use client";

import React from "react";
import styled from "styled-components";
import NextImage from "next/image";
import { useTranslations } from "next-intl";
import FormattedNumber from "@/utils/FormattedNumber";



interface ZoodollarIconProps {
  value?: number | string | null;
  altText?: string;
  size?: number;
}

export default function ZoodollarIcon({
  value,
  altText,
  size = 20,
}: ZoodollarIconProps) {
  // Holt den Standard-Alt-Text aus der Sprachdatei
  const t = useTranslations("currencies");

  const hasValue = value !== undefined && value !== null;

  return (
    <ZoodollarWrapper>
      {hasValue && (
        <ZoodollarValue>
          <FormattedNumber value={value} />
        </ZoodollarValue>
      )}
      <NextImage
        src="/images/currency/zoodollar.webp"
        // Nutzt Prop oder Fallback aus der JSON
        alt={altText || t("zoodollars")}
        width={size}
        height={size}
        priority={size > 40}
      />
    </ZoodollarWrapper>
  );
}

const ZoodollarWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  vertical-align: middle;

  img {
    object-fit: contain;
    filter: drop-shadow(1px 1px 1px rgba(0, 0, 0, 0.15));
  }
`;

const ZoodollarValue = styled.span`
  font-weight: 700;
  font-size: 0.95rem;
  /* Nutze hier idealerweise theme.colors.brand.green oder ähnlich */
  color: #15803d;
`;