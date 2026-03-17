import React from "react";
import styled from "styled-components";
import { useTranslation } from "next-i18next";

/**
 * @param {{ currentCount: number, totalCount: number }} props
 */
export default function ResultsInfo({ currentCount, totalCount }) {
  const { t } = /** @type {any} */(useTranslation(["animals", "common"]));

  return (
    <StyledInfo>
      {t('common:results.show')} <strong>{currentCount}</strong> {t('common:results.of')}
      <strong> {totalCount}</strong> {t('animals:results_unit')}
    </StyledInfo>
  );
}

const StyledInfo = styled.p`
  width: 100%;
  text-align: center;
  margin: 0 auto 15px auto;
  font-size: 0.95rem;
  color: #666;

  strong {
    color: var(--color-zoo-green, #2d5a27);
    font-weight: 800;
  }
`;