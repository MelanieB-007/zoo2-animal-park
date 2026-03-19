import React from "react";
import NextImage from "next/image";
import styled from "styled-components";
import { useTranslation } from "next-i18next";

export default function PopularityDisplay({ popularity }) {
  const { t } = /** @type {any} */ (
    useTranslation(["animals", "common"])
  );

  const hasValue = popularity !== undefined && popularity !== null;

  return (
    <StyledWrapper>
      {hasValue && <span>{popularity.toLocaleString()}</span>}
      <ImageContainer>
        <NextImage
          src="/images/icons/besucher.jpg"
          alt={t("common:popularity")}
          width={25}
          height={16}
          style={{ objectFit: 'contain' }}
        />
      </ImageContainer>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 5px;
  font-weight: bold;
  width: 100%;
  color: var(--color-text-dark, #333); 
`;

const ImageContainer = styled.div`
  display: flex;
  align-items: center;
  
  img {
    filter: drop-shadow(1px 1px 1px rgba(0, 0, 0, 0.1));
  }
`;