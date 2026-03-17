import React from "react";
import styled from "styled-components";
import NextImage from "next/image";
import { useTranslation } from "next-i18next";

export default function EmptyState({ title, message, buttonText, onReset }) {
  const { t } = /** @type {any} */(useTranslation(["animals", "common"]));

  return (
    <OuterContainer>
      <Container>
        <SpeechBubble>
          <h3>{title || t('animals:empty.title')}</h3>
          <p>{message || t('animals:empty.message')}</p>
        </SpeechBubble>

        <UppyPortraitFrame>
          <NextImage
            src="/images/uppy-traurig.png"
            alt="Uppy ist traurig"
            width={240}
            height={320}
            style={{
              objectFit: 'contain',
            }}
          />
        </UppyPortraitFrame>

        {onReset && (
          <ResetButton onClick={onReset}>
            🐾 {buttonText || t('animals:empty.button')}
          </ResetButton>
        )}
      </Container>
    </OuterContainer>
  );
}

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
  background: var(--color-white);
  border: 2px solid #4ca64c;
  border-radius: var(--border-radius);
  margin-top: 40px;
  position: relative;
`;

const SpeechBubble = styled.div`
  position: relative;
  background: white;
  border: 3px solid #4ca64c;
  border-radius:var(--border-radius);
  padding: 20px 30px;
  margin-bottom: 40px;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);

  /* Der kleine Zipfel */
  &::after {
    content: '';
    position: absolute;
    bottom: -15px;
    left: 50%;
    transform: translateX(-50%);
    border-width: 15px 15px 0;
    border-style: solid;
    border-color: white transparent transparent;
    z-index: 2;
  }

  &::before {
    content: '';
    position: absolute;
    bottom: -19px;
    left: 50%;
    transform: translateX(-50%);
    border-width: 16px 16px 0;
    border-style: solid;
    border-color: #4ca64c transparent transparent;
    z-index: 1;
  }

  h3 {
    color: #4ca64c;
    font-weight: 800;
    margin: 0 0 8px 0;
    font-size: 1.6rem;
  }
`;

const UppyPortraitFrame = styled.div`
  margin-bottom: 35px;
  border-radius: 30px;
  padding: 20px;
  border: 3px solid #b5d99c;
  background: #f8fbf5;

  line-height: 0;
  box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.05);

  img {
    filter: drop-shadow(0 0 15px rgba(255, 255, 255, 0.8));
  }
`;

const ResetButton = styled.button`
  background-color: #4ca64c; 
  color: var(--color-white);
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