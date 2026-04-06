"use client";

import React, { ReactNode } from "react";
import styled from "styled-components";

import { theme } from "@/styles/theme";

// 1. Definition der erlaubten Werte (Union Types)
type TooltipPosition = "top" | "bottom";
type TooltipAlign = "left" | "right" | "center";

interface TooltipProps {
  text: string | null | undefined;
  children: ReactNode; // ReactNode erlaubt alles (Texte, andere Komponenten etc.)
  align?: TooltipAlign;
  position?: TooltipPosition;
}

// Interface für das Styled Component (mit $ Präfix für Styled-Props)
interface ContainerProps {
  $text: string;
  $align: TooltipAlign;
  $position: TooltipPosition;
}

export default function Tooltip({
  text,
  children,
  align = "center",
  position = "top",
}: TooltipProps) {
  // Wenn kein Text da ist, gib einfach nur das Kind-Element zurück
  if (!text) return <>{children}</>;

  return (
    <TooltipContainer
      $text={text}
      $align={align}
      $position={position}
      >
      {children}
    </TooltipContainer>
  );
}

const TooltipContainer = styled.div<ContainerProps>`
  position: relative;
  display: inline-flex;
  align-items: center;

  &::after {
    content: "${(props) => props.$text}";
    position: absolute;
    z-index: 9999;

    ${(props) =>
      props.$position === "bottom"
        ? "top: 140%; bottom: auto;"
        : "bottom: 140%; top: auto;"}

    ${(props) => {
      if (props.$align === "left")
        return "right: 0; left: auto; transform: none;";

      if (props.$align === "right")
        return "left: 0; right: auto; transform: none;";

      return "left: 50%; transform: translateX(-50%);";
    }}
    
    background-color: ${theme.colors.brand.petrolDark};
    color: ${theme.colors.ui.surface};

    box-shadow:
      0 4px 6px -1px rgba(0, 0, 0, 0.3),
      0 2px 4px -1px rgba(0, 0, 0, 0.2),
      0 10px 15px -3px rgba(0, 0, 0, 0.4);

    border: 1px solid var(--color-grey-0-1);
    padding: 8px 12px;
    border-radius: 8px;
    font-size: 0.8rem;
    white-space: nowrap;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.2s ease;
    pointer-events: none;
  }

  &::before {
    content: "";
    position: absolute;
    z-index: 9999;
    left: 50%;
    transform: translateX(-50%);
    border: 6px solid transparent;

    ${(props) =>
      props.$position === "bottom"
        ? `top: 110%; border-bottom-color: ${theme.colors.brand.petrolDark};`
        : `bottom: 110%; border-top-color: ${theme.colors.brand.petrolDark};`}

    opacity: 0;
    visibility: hidden;
  }

  &:hover::after,
  &:hover::before {
    opacity: 1;
    visibility: visible;
  }
`;
