"use client";

import React from "react";
import styled from "styled-components";

interface TableInfoCellProps {
  children: React.ReactNode;
}

/**
 * Ein Flex-Container für Tabellenzellen, um Icons und Text
 * mit gleichmäßigem Abstand (Gap) nebeneinander anzuzeigen.
 */
export default function TableInfoCell({ children }: TableInfoCellProps) {
  return <StyledInfoCell>{children}</StyledInfoCell>;
}

const StyledInfoCell = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;

  /* Verhindert, dass der Inhalt bei schmalen Spalten umbricht */
  white-space: nowrap;

  /* Falls du Text neben einem Icon hast, sorgt das für eine 
     schöne Ausrichtung der Schriftlinie */
  line-height: 1.2;

  /* Optional: Falls der Text zu lang wird, kürzen wir ihn dezent ab, 
     bevor er das Layout sprengt */
  span {
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;
