import React from 'react';
import styled from 'styled-components';

/**
 * Eine spezifische Komponente NUR für den Zoo 2 Diamand.
 * @param {string|number} label - Der Diamand-Wert, der neben dem Diamanten angezeigt wird.
 * @param {number} size - Optionale Größe (Standard: 20px).
 */
export default function DiamandIcon({ value, size = 20 }) {
  return (
    <DiamandWrapper>
      {value && <DiamandValue>
        {value.toLocaleString()}
      </DiamandValue>}
      <DiamandImage
        src="/images/currency/diamant.webp"
        alt="Diamand"
        width={size}
        height={size}
      />

    </DiamandWrapper>
  );
}


const DiamandWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px; 
  vertical-align: middle;
`;

const DiamandImage = styled.img`
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  object-fit: contain;
  filter: drop-shadow(1px 1px 1px rgba(0,0,0,0.15));
`;

const DiamandValue = styled.span`
  font-weight: 700;
  font-size: 0.95rem;
  color: #1d4ed8;
`;