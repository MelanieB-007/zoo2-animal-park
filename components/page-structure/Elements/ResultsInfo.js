import React from "react";
import styled from "styled-components";
import { useTranslation } from "next-i18next";

export default function ResultsInfo({
  currentCount,
  totalCount,
  labelUnit,
}) {
  const { t } = useTranslation(['common']);

  return (
    <StyledInfo>
      {t('resultsShow')} <strong>{currentCount}</strong> {labelUnit}
      <strong> {totalCount}</strong> {labelUnit}
    </StyledInfo>
  );
}

const StyledInfo = styled.p`
  width: 100%;
  text-align: center;
  margin: 0 auto 15px auto;
  font-size: 0.95rem;
  color: var(--color-grey);
  font-family: "Inter", sans-serif;

  strong {
    color: var( --color-khaki-green);
    font-weight: 800;
  }
`;