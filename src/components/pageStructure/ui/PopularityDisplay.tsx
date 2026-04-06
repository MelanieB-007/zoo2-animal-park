"use client";

import React from "react";
import styled from "styled-components";
import NextImage from "next/image";
import { theme } from "@/styles/theme";

import { useTranslations } from "next-intl";
import FormattedNumber from "@/utils/FormattedNumber";

interface PopularityDisplayProps {
  popularity?: number | string | null;
}

export default function PopularityDisplay({
  popularity,
}: PopularityDisplayProps) {
  // Wir nutzen den "common" Namespace für allgemeine UI-Texte
  const t = useTranslations("common");

  const hasValue =
    popularity !== undefined && popularity !== null && popularity !== "";

  return (
    <StyledWrapper>
      {hasValue && (
        <PopularityValue>
          <FormattedNumber value={popularity} />
        </PopularityValue>
      )}
      <ImageContainer>
        <NextImage
          src="/images/icons/besucher.jpg"
          alt={t("popularity") || "Popularity"}
          width={25}
          height={16}
          style={{ objectFit: "contain" }}
        />
      </ImageContainer>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 5px;
  width: 100%;
  /* Nutzt deine Textfarbe aus dem Theme */
  color: ${theme.colors.ui.text};
`;

const PopularityValue = styled.span`
  font-weight: 700;
  font-size: 0.95rem;
`;

const ImageContainer = styled.div`
  display: flex;
  align-items: center;

  img {
    filter: drop-shadow(1px 1px 1px rgba(0, 0, 0, 0.1));
  }
`;