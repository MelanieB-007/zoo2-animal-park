"use client";

import React from "react";
import styled from "styled-components";

interface RightAlignedTdProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Eine einfache Tabellenzelle (td), die den Inhalt rechtsbündig ausrichtet.
 * Ideal für Zahlenwerte und Währungen im Zoo-Manager.
 */
export default function RightAlignedTd({
  children,
  className,
}: RightAlignedTdProps) {
  return (
    <StyledRightAlignedTd className={className}>
      {children}
    </StyledRightAlignedTd>
  );
}

export const StyledRightAlignedTd = styled.td`
  text-align: right;
  padding-right: 20px;
  white-space: nowrap;
`;
