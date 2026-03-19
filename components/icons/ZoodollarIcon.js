import React from 'react';
import styled from 'styled-components';
import NextImage from 'next/image';
import FormattedNumber from "../ui/FormattedNumber";

export default function ZoodollarIcon({ value, altText, size = 20 }) {
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
        alt={altText || "Zoodollar"}
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

  img {
    object-fit: contain;
    filter: drop-shadow(1px 1px 1px rgba(0,0,0,0.15));
  }
`;

const ZoodollarValue = styled.span`
  font-weight: 700;
  font-size: 0.95rem;
  color: #15803d; 
`;