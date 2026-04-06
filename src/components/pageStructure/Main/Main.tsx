"use client";

import React from "react";
import styled from "styled-components";
import { theme } from "@/styles/theme";

interface MainProps {
  children: React.ReactNode;
}

/**
 * Die zentrale Inhalts-Komponente (Main).
 * Sie umschließt den Content und sorgt für das "Glass-Morphismus" Design.
 */
export default function Main({ children }: MainProps) {
  return <StyledMain>{children}</StyledMain>;
}

const StyledMain = styled.main`
  position: relative;
  /* Sorgt dafür, dass der Container den verfügbaren Platz füllt 
     und den Footer nach unten drückt */
  flex: 1 0 auto;

  margin: 10px auto;
  width: 95%;
  max-width: 1200px; /* Entspricht deiner var(--width-page) */
  padding: 2rem;
  z-index: 1;

  /* Glass-Morphismus Effekt */
  background-color: ${theme.colors.ui.surface}F2; /* F2 für fast deckend */
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);

  /* Spacing zwischen den Sektionen (z.B. Headline, Tabelle, Pagination) */
  & > * {
    margin-bottom: 2.5rem;
  }

  & > *:last-child {
    margin-bottom: 0;
  }

  /* Responsive Anpassungen */
  @media (max-width: 1200px) {
    padding: 1.5rem;
    width: 98%;
  }

  @media (max-width: 768px) {
    padding: 1.2rem 1rem;
    margin: 8px auto;
    border-radius: 10px; 
    width: 100%;

    /* Auf Mobile reduzieren wir den Abstand zwischen Elementen */
    & > * {
      margin-bottom: 1.5rem;
    }
  }
`;
