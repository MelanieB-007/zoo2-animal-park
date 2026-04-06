"use client";

import React from "react";
import styled from "styled-components";
import NextImage from "next/image";
import { useTranslations } from "next-intl";

import { theme } from "@/styles/theme";
import FormattedNumber from "@/utils/FormattedNumber";

interface XPIconProps {
  label?: number | string | null; // Das 'label' im alten Code entspricht dem 'value'
  size?: number;
}

export default function XPIcon({ label: value, size = 20 }: XPIconProps) {
  const t = useTranslations();

  // Wir prüfen, ob ein Wert vorhanden ist (0 ist auch ein gültiger Wert)
  const hasValue = value !== undefined && value !== null && value !== "";

  return (
    <XPWrapper>
      {hasValue && (
        <XPValue>
          <FormattedNumber value={value} />
        </XPValue>
      )}
      <Image
        src="/images/icons/star.png"
        alt={t("icons.xp_stars") || "XP-Stars"}
        width={size}
        height={size}
      />
    </XPWrapper>
  );
}

const XPWrapper = styled.div`
  display: inline-flex;
  justify-content: flex-end;
  align-items: center;
  gap: 6px;
  vertical-align: middle;
  width: 100%;
`;

const XPValue = styled.span`
  font-weight: 700;
  font-size: 0.95rem;
  color: ${theme.colors.brand.marine};
`;

const Image = styled(NextImage)`
  object-fit: contain;
  filter: drop-shadow(1px 1px 1px rgba(0,0,0,0.15));
`;