"use client";

import React from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import { theme } from "@/styles/theme";

interface LinkedRowProps {
  children: React.ReactNode;
  path: string;
}

/**
 * Eine Tabellenzeile (tr), die als Link fungiert.
 * Ideal für die Navigation von der Tierliste zur Detailansicht.
 */
export default function TableLinkedRow({ children, path }: LinkedRowProps) {
  const router = useRouter();

  const handleNavigation = (e: React.MouseEvent) => {
    // Verhindert Navigation, wenn man auf einen Button innerhalb der Zeile klickt
    // (z.B. Edit- oder Delete-Button)
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("a")) {
      return;
    }

    router.push(path);
  };

  return (
    <StyledLinkedRow
      onClick={handleNavigation}
      role="link"
      tabIndex={0}
    >
      {children}
    </StyledLinkedRow>
  );
}

const StyledLinkedRow = styled.tr`
  border-bottom: 1px solid ${theme.colors.ui.border};
  cursor: pointer;
  transition: background-color 0.15s ease-in-out;

  &:hover {
    /* Ein sehr helles Petrol/Grün für den Hover aus deinem Theme */
    background-color: ${theme.colors.brand.greenLight}20;
  }

  /* Fokus-Style für Barrierefreiheit (Tastatur-Navigation) */
  &:focus-visible {
    outline: 2px solid ${theme.colors.brand.petrol};
    background-color: ${theme.colors.brand.greenLight}10;
  }

  td {
    padding: 12px 15px;
  }
`;