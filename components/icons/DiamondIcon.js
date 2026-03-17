import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'next-i18next';

export default function DiamondIcon({ value, size = 20 }) {
  const displayValue = (value !== undefined && value !== null) ? value : null;
  const { t } = useTranslation('common');

  return (
    <DiamondWrapper>
      {displayValue && <DiamondValue>
        {displayValue.toLocaleString()}
        </DiamondValue>}
      <DiamondImage
        src="/images/currency/diamant.webp"
        alt={t('diamond')}
        width={size}
        height={size}
      />
    </DiamondWrapper>
  );
}


const DiamondWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px; 
  vertical-align: middle;
`;

const DiamondImage = styled.img`
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  object-fit: contain;
  filter: drop-shadow(1px 1px 1px var(--color-black));
`;

const DiamondValue = styled.span`
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--color-blue-marine);
`;