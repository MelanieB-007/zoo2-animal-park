import { useTranslation } from "next-i18next";
import styled from "styled-components";

import VariantCard from "./VariantCard";

export default function Variants({ animal }) {
  const { t } = useTranslation('animals');

  if (!animal?.variants || animal.variants.length === 0) return null;

  return (
    <>
      <SectionHeadline>
        <span style={{ fontSize: '1.2rem' }}>🌸</span>
        {t('colorVariants')}
      </SectionHeadline>

      <VariantGrid>
        {animal.variants.map((variant) => (
          <VariantCard key={variant.id} variant={variant} />
        ))}
      </VariantGrid>
    </>
  );
}

const VariantGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 15px; 
  width: 100%;
  margin-top: 20px;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
    justify-content: start;
  }
`;

const SectionHeadline = styled.h2`
  display: flex;
  align-items: center;
  gap: 12px;

  background: var(--color-white);
  border: 1.5px solid var(--color-lime);
  border-radius: 30px;
  padding: 8px 24px;
  width: fit-content;

  color: var(--color-green-label);
  font-size: 1.3rem;
  font-weight: 600;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.03);

  /* DESKTOP-POSITION */
  margin: 35px 0 20px 5px;
  
  &::after {
    @media (min-width: 769px) {
      content: "";
      flex: 1;
      height: 1.5px;
      background-color: var(--color-yellow-ligh);
      margin-left: 20px;
      opacity: 0.5;
      min-width: 100px;
    }
  }

  @media (max-width: 768px) {
    margin: 30px auto 20px auto; 
    font-size: 1.15rem;           
    padding: 6px 20px;
    justify-content: center;
  }
`;