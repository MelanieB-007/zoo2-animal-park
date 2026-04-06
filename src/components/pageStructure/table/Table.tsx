"use client";

import React from "react";
import styled from "styled-components";
import { theme } from "@/styles/theme";

interface TableProps {
  children: React.ReactNode;
}

/**
 * Die Haupt-Tabelle für die Desktop-Ansicht.
 * Nutzt das zentrale Theme für Farben und Abstände.
 */
export default function Table({ children }: TableProps) {
  return (
    <DesktopView>
      <TableFrame>
        <StyledTable>{children}</StyledTable>
      </TableFrame>
    </DesktopView>
  );
}

const DesktopView = styled.div`
  display: block;
  
  @media (max-width: 767px) {
    display: none;
  }
`;

export const TableFrame = styled.div`
  background: ${theme.colors.ui.surface};
  border: 2px solid ${theme.colors.brand.green};
  border-radius: 12px; 
  overflow-x: auto;
  overflow-y: hidden;
  position: relative;
  margin-top: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
`;

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  min-width: 800px;

  th {
    background: ${theme.colors.ui.surface};
    padding: 15px;
    text-align: left;
    color: ${theme.colors.brand.green};
    font-weight: 700;
    border-bottom: 2px solid ${theme.colors.ui.border};
    white-space: nowrap;
  }

  td {
    padding: 12px 15px;
    border-bottom: 1px solid ${theme.colors.ui.border};
    color: ${theme.colors.ui.text};
    vertical-align: middle;
  }

  tr:last-child td {
    border-bottom: none;
  }

  tr:hover td {
    background: ${theme.colors.brand.petrolLight}15; /* 15% Deckkraft vom Petrol-Light */
    transition: background 0.2s ease;
  }

  /* Abrundung der Ecken passend zum Frame */
  th:first-child {
    border-top-left-radius: 10px;
  }
  th:last-child {
    border-top-right-radius: 10px;
  }

  tr:last-child td:first-child {
    border-bottom-left-radius: 10px;
  }
  tr:last-child td:last-child {
    border-bottom-right-radius: 10px;
  }
`;