import styled from "styled-components";
import NextImage from "next/image";
import { useTranslation } from "next-i18next";

import Tooltip from "../ui/Tooltip";

export default function VariantCard({ variant }) {
  const { t } = useTranslation("common");
  const herkunft = variant.herkunft;

  return (
    <Tooltip text={variant.name}>
      <StyledVariantCard>
        <ImageWrapper>
          <NextImage
            src={`/images/farbvarianten/${variant.bild}`}
            alt={variant.name|| "Tier-Variante"}
            width={200}
            height={200}
            style={{ objectFit: "contain" }}
          />
        </ImageWrapper>

        <VariantName>{variant.farbe}</VariantName>

        <ReleaseDate>
          📅 {t("release")}: {variant.release}
        </ReleaseDate>

        {herkunft && (
          <Tooltip
            text={herkunft.name}
          >
            <OriginRow>
              <NextImage
                src={`/images/herkunft/${herkunft.bild}`}
                alt={herkunft.name}
                width={20}
                height={20}
              />
            </OriginRow>
          </Tooltip>
        )}
      </StyledVariantCard>
    </Tooltip>
  );
}

const StyledVariantCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--color-white);
  border: 2px solid var(--color-white-border);
  border-radius: var(--border-radius);
  padding: 15px;
  width: 100%; 
  max-width: none;
  margin: 0 auto;

  height: auto;
  min-height: 260px;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);

  @media (min-width: 768px) {
    width: 230px;
    margin: 0; 
  }

  &:hover {
    transform: translateY(-5px);
    border-color: var( --color-green-darker);
    background: var(--color-white);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
  }
`;

const ImageWrapper = styled.div`
  width: 100%;
  max-width: 200px;
  aspect-ratio: 1 / 1;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: var(--border-radius-icon);
  background: var(--color-white);

  img {
    max-width: 100%;
    height: auto !important;
  }
`;

const VariantName = styled.span`
  margin-top: 15px;
  font-size: 1.1rem;
  font-weight: bold;
  color: var(--color-petrol-grey);
  text-align: center;
  display: block;
  width: 100%;
  word-wrap: break-word;
`;

const ReleaseDate = styled.div`
  font-size: 0.8rem;
  margin-top: 5px;
`;

const OriginRow = styled.div`
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  background: #f1f8e9; 
  padding: 6px 12px;
  border-radius: 20px;
  color:var(--color-green-darker);
  border: 1px solid var(--color-lime);
  width: fit-content; 

  span {
    font-weight: 600;
  }
`;