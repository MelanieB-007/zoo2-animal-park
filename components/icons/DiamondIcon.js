import React from 'react';
import styled from 'styled-components';
import NextImage from 'next/image';

export default function DiamondIcon({ value, altText, size = 20 }) {

  const hasValue = value !== undefined && value !== null;

  return (
    <DiamondWrapper>
      {hasValue && (
        <DiamondValue>
          {value.toLocaleString()}
        </DiamondValue>
      )}
      <NextImage
        src="/images/currency/diamant.webp"
        alt={altText || "Diamond"}
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
  
  img {
    object-fit: contain;
    filter: drop-shadow(1px 1px 1px rgba(0,0,0,0.15));
  }
`;

const DiamondValue = styled.span`
  font-weight: 700;
  font-size: 0.95rem;
  color: #1d4ed8; 
`;