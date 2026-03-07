import React from 'react';
import styled from 'styled-components';

/**
 * Eine spezifische Komponente NUR für den Zoo 2 Zoodollar.
 * @param {string|number} label - Der Zoodollar-Wert, der neben dem Zoodollar angezeigt wird.
 * @param {number} size - Optionale Größe (Standard: 20px).
 */
export default function ZoodollarIcon({ value, size = 20 }) {
  return (
    <ZoodollarWrapper>
      {value && <ZoodollarValue>
        {value.toLocaleString()}
      </ZoodollarValue>}
      <ZoodollarImage
        src="/images/currency/zoodollar.webp"
        alt="Zoodollar"
        width={size}
        height={size}
      />

    </ZoodollarWrapper>
  );
}


const ZoodollarWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px; 
  vertical-align: middle;
`;

const ZoodollarImage = styled.img`
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  object-fit: contain;
  filter: drop-shadow(1px 1px 1px rgba(0,0,0,0.15));
`;

const ZoodollarValue = styled.span`
  font-weight: 700;
  font-size: 0.95rem;
  color: #1d4ed8;
`;