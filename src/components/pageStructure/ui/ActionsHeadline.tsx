"use client";

import React from "react";
import styled from "styled-components";
import { theme } from "@/styles/theme";

interface ActionsHeadlineProps {
  text: string;
}

/**
 * Die Kopfzeile (th) für die Aktions-Spalte in Tabellen.
 * Zentriert den Text, da darunter meist nur Icons stehen.
 */
export default function ActionsHeadline({ text }: ActionsHeadlineProps) {
  return <ActionText>{text}</ActionText>;
}

const ActionText = styled.th`
  text-align: center;
  padding: 15px;

  /* Nutzt das Farbschema deiner anderen Tabellenköpfe */
  color: ${theme.colors.brand.green};
  font-weight: 700;

  /* Verhindert Umbrüche, falls das Wort "Aktionen" zu lang ist */
  white-space: nowrap;

  /* Untere Linie passend zum Rest der Tabelle */
  border-bottom: 2px solid ${theme.colors.ui.border};
`;
