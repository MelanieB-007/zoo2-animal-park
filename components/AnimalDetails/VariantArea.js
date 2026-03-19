import styled from "styled-components";
import { useTranslation } from "next-i18next";
import VariantCard from "./VariantCard";


export default function VariantArea({ animal }) {
  const { t } = /** @type {any} */ (
    useTranslation(["animals", "common"])
  );

  if (!animal?.variants || animal.variants.length === 0) {
    return null;
  }

  return (
    <>
      <SectionHeadline>
        <span style={{ fontSize: '1.2rem' }}>🌸</span>
        {t("animals:colorVariants")}
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
 
  @media (min-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
    justify-content: start; 
  }
`;

const SectionHeadline = styled.h2`
  display: flex;
  align-items: center;
  gap: 12px;

  background: #fdfdfd;
  border: 1.5px solid #d1e2a5;
  border-radius: 30px;
  padding: 8px 24px;
  width: fit-content;

  color: #2d5a27;
  font-size: 1.3rem;
  font-weight: 600;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.03);

  margin: 25px 0 0 5px;
  
  &::after {
    @media (min-width: 769px) {
      content: "";
      flex: 1;
      height: 1.5px;
      background-color: #d1e2a5;
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