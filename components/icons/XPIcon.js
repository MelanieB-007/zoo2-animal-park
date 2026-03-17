import React from 'react';
import styled from 'styled-components';
import { useTranslation } from "next-i18next";


export default function XPIcon({ label, size = 20 }) {
  const { t } = useTranslation('common');

  return (
    <XPWrapper>
      {/* Prüfen, ob label existiert UND ob es eine Zahl ist */}
      {typeof label === 'number' && (
        <XPValue>{label.toLocaleString()}</XPValue>
      )}

      {/* Das Bild nur rendern, wenn src hart codiert ist oder existiert */}
      <StarImage
        src="/images/icons/star.png"
        alt="XP" // Erstmal hart codieren zum Testen!
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
  filter: drop-shadow(1px 1px 1px var(--color-black));
`;

const XPValue = styled.span`
  font-weight: 700; 
  font-size: 0.95rem;
  color: var(--color-blau-marine); 
`;