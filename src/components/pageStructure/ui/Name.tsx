"use client";

import React from "react";
import styled from "styled-components";
import { theme } from "@/styles/theme";

interface NameProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Eine robuste Text-Komponente für Namen (Tiere, Mitglieder, Gehege).
 * Sorgt für korrekte Worttrennung und verhindert Layout-Bruch.
 */
export default function Name({ children, className }: NameProps) {
  return <StyledName className={className}>{children}</StyledName>;
}

const StyledName = styled.span`
  font-weight: 700; 
  font-size: 0.9rem;
  display: inline-block;
  color: ${theme.colors.ui.text};

  /* Intelligente Worttrennung für lange Tiernamen */
  hyphens: auto;
  -webkit-hyphens: auto;
  -ms-hyphens: auto;

  /* Sicherheit falls hyphens nicht greift */
  overflow-wrap: break-word;
  word-wrap: break-word;

  /* Verhindert, dass der Name über den Container hinausragt */
  max-width: 100%;
  line-height: 1.2;
`;