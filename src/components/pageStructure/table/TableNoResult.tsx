"use client";

import React from "react";
import styled from "styled-components";
import { theme } from "@/styles/theme";

interface TableNoResultProps {
  text: string;
  colSpan?: number;
}

/**
 * Zeigt eine zentrierte Nachricht an, wenn eine Tabelle
 * keine Daten zum Anzeigen hat (z.B. bei Filtern).
 */
export default function TableNoResult({
  text,
  colSpan = 8,
}: TableNoResultProps) {
  return (
    <tr>
      <StyledNoResult colSpan={colSpan}>{text}</StyledNoResult>
    </tr>
  );
}

const StyledNoResult = styled.td`
  text-align: center;
  padding: 40px 20px; 

  /* Nutzt deine Textfarbe aus dem Theme */
  color: ${theme.colors.ui.text};

  /* Eine leichte Italic-Optik zeigt an, dass dies ein Status-Text ist */
  font-style: italic;
  font-size: 1.1rem;

  /* Fallback-Hintergrund, damit die Zeile sich leicht abhebt */
  background-color: ${theme.colors.ui.surface};
  border-bottom: none;
`;
