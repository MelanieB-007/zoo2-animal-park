"use client";

import React from "react";
import styled from "styled-components";
import { useTranslations } from "next-intl";

import { theme } from "@/styles/theme";

interface ResultsInfoProps {
  currentCount: number;
  totalCount: number;
}

export default function ResultsInfo({
  currentCount,
  totalCount,
}: ResultsInfoProps) {
  const t = useTranslations();

  return (
    <StyledInfo>
      {t("common:results.show")}
      <strong>{currentCount}</strong>
      {" "}
      {t("common:results.of")}
      <strong>{totalCount}</strong>
      {" "}
      {t("animals:results_unit")}
    </StyledInfo>
  );
}

const StyledInfo = styled.p`
  width: 100%;
  text-align: center;
  margin: 0 auto 15px auto;
  font-size: 0.95rem;
  
  color: ${theme.colors.ui.text || "#666"};

  strong {
    color: ${theme.colors.brand.green};
    font-weight: 800;
  }
`;
