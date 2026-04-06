"use client";

import React from "react";
import styled from "styled-components";
import RightAlignedTd from "@/components/pageStructure/table/RightAlignedTd";



interface DesktopOnlyTdProps {
  children: React.ReactNode;
}

/**
 * Eine Tabellenzelle, die nur auf Desktop-Bildschirmen (ab 1100px)
 * angezeigt wird. Erbt die Rechtsbündigkeit von RightAlignedTd.
 */
export default function DesktopOnlyTd({ children }: DesktopOnlyTdProps) {
  return <StyledDesktopOnlyTd>{children}</StyledDesktopOnlyTd>;
}

const StyledDesktopOnlyTd = styled(RightAlignedTd)`
  display: none;
  
  @media (min-width: 1100px) {
    display: table-cell;
  }
`;