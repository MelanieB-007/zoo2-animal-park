"use client";

import React from "react";
import styled from "styled-components";
import { theme } from "@/styles/theme";

interface TableContainerProps {
  children: React.ReactNode;
}

/**
 * Ein Wrapper für Tabellen, der horizontales Scrollen auf
 * kleinen Bildschirmen ermöglicht, ohne das Layout zu brechen.
 */
export default function TableContainer({ children }: TableContainerProps) {
  return <StyledTableContainer>{children}</StyledTableContainer>;
}

const StyledTableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  margin-bottom: 1rem;

  /* Scrollbar-Styling (optional, passt zum Petrol-Look) */
  &::-webkit-scrollbar {
    height: 6px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: ${theme.colors.brand.petrolLight || "#ccc"};
    border-radius: 10px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
`;