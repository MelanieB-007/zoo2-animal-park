import React from 'react';
import styled from 'styled-components';

/**
 * Eine spezifische Komponente NUR für den Zoo 2 XP-Stern.
 * @param {string|number} label - Der XP-Wert, der neben dem Stern angezeigt wird.
 * @param {number} size - Optionale Größe (Standard: 20px).
 */
export default function XPIcon({ label, size = 20 }) {
  return (
    <XPWrapper>
      {label && <XPValue>{label.toLocaleString()}</XPValue>}
      <StarImage
        src="/images/icons/star.png"
        alt="XP-Sterne"
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

const StarImage = styled.img`
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  object-fit: contain;
  filter: drop-shadow(1px 1px 1px rgba(0,0,0,0.15));
`;

const XPValue = styled.span`
  font-weight: 700; 
  font-size: 0.95rem;
  color: #1d4ed8; 
`;