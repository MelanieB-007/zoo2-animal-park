"use client";

import React from "react";
import styled from "styled-components";
import NextImage from "next/image";
import { useTranslations } from "next-intl";

import { theme } from "@/styles/theme";

// 1. Interface für die Props
interface EmptyStateProps {
  title?: string;
  message?: string;
  buttonText?: string;
  onReset?: () => void; // Funktion ohne Rückgabewert
}

export default function EmptyState({
  title,
  message,
  buttonText,
  onReset,
}: EmptyStateProps) {
  const t = useTranslations();

  return (
    <OuterContainer>
      <Container>
        <SpeechBubble>
          <h3>{title || t("animals:empty.title")}</h3>
          <p>{message || t("animals:empty.message")}</p>
        </SpeechBubble>

        <UppyPortraitFrame>
          <NextImage
            src="/images/uppy-traurig.png"
            alt={t("animals:empty.uppySad")}
            width={240}
            height={320}
            style={{
              objectFit: "contain",
            }}
          />
        </UppyPortraitFrame>

        {onReset && (
          <ResetButton onClick={onReset}>
            🐾 {buttonText || t("animals:empty.button")}
          </ResetButton>
        )}
      </Container>
    </OuterContainer>
  );
}

// --- Styled Components mit Theme-Anbindung ---

const OuterContainer = styled.div`
  padding: 30px 0;
  overflow: visible;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px 60px;
  background: ${theme.colors.ui.surface};
  border: 2px solid ${theme.colors.brand.green};
  border-radius: ${theme.borderRadius};
  margin-top: 40px;
  position: relative;
`;

const SpeechBubble = styled.div`
  position: relative;
  background: white;
  border: 3px solid ${theme.colors.brand.green};
  border-radius: 20px;
  padding: 20px 30px;
  margin-bottom: 40px;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);

  /* Der kleine Zipfel (Weiss) */
  &::after {
    content: "";
    position: absolute;
    bottom: -15px;
    left: 50%;
    transform: translateX(-50%);
    border-width: 15px 15px 0;
    border-style: solid;
    border-color: white transparent transparent;
    z-index: 2;
  }

  /* Der Zipfel-Rand (Grün) */
  &::before {
    content: "";
    position: absolute;
    bottom: -19px;
    left: 50%;
    transform: translateX(-50%);
    border-width: 16px 16px 0;
    border-style: solid;
    border-color: ${theme.colors.brand.green} transparent transparent;
    z-index: 1;
  }

  h3 {
    color: ${theme.colors.brand.green};
    font-weight: 800;
    margin: 0 0 8px 0;
    font-size: 1.6rem;
  }

  p {
    color: ${theme.colors.brand.petrol};
    line-height: 1.4;
  }
`;

const UppyPortraitFrame = styled.div`
  margin-bottom: 35px;
  border-radius: 30px;
  padding: 20px;
  border: 3px solid ${theme.colors.brand.greenLight};
  background: ${theme.colors.ui.filterHover};

  line-height: 0;
  box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.05);

  img {
    filter: drop-shadow(0 0 15px rgba(255, 255, 255, 0.8));
  }
`;

const ResetButton = styled.button`
  background-color: ${theme.colors.brand.green};
  color: ${theme.colors.ui.surface};
  border: none;
  padding: 14px 28px;
  font-size: 1rem;
  font-weight: 800;
  border-radius: 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.2s ease;

  /* Dunklerer Schatten-Effekt für den "Button-Look" */
  box-shadow: 0 4px 0 #3a7d3a;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 0 #3a7d3a;
  }

  &:active {
    transform: translateY(1px);
    box-shadow: 0 2px 0 #3a7d3a;
  }
`;
