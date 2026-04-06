"use client";

import React from "react";
import styled from "styled-components";
import NextImage from "next/image";

import { theme } from "@/styles/theme";

// 1. Interface für die Props
interface GameIconProps {
  type: string;
  fileName?: string | null;
  size?: number;
  bordercolor?: string;
}

// 2. Interface für das Styled Component
interface IconFrameProps {
  $size: number;
  $bordercolor: string;
}

export default function GameIcon({
  type,
  fileName,
  size = 50,
  bordercolor = theme.colors.brand.green,
}: GameIconProps) {
  // 3. Pfad-Logik mit Fallback
  const name = fileName?.trim() || "placeholder.png";

  let imagePath =
    name === "placeholder.png"
      ? `/images/placeholder.jpg`
      : `/images/${type}/${name}`;

  // Sicherheits-Check: Doppelte Slashes (außer bei http://) bereinigen
  const cleanPath = imagePath.replace(/([^:]\/)\/+/g, "$1");

  return (
    <IconFrame $size={size} $bordercolor={bordercolor}>
      <StyledImage
        src={cleanPath}
        alt={name}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          console.warn(
            `Bild nicht gefunden: ${cleanPath}. Nutze Notfall-Fallback.`
          );
          target.src = "/images/placeholder.png";
        }}
      />
    </IconFrame>
  );
}

// --- Styled Components ---

const IconFrame = styled.div<IconFrameProps>`
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  background: #eee;

  border: 2px solid ${(props) => props.$bordercolor};
  border-radius: 12px; /* Etwas runder für den modernen Look */

  padding: 0;
  display: flex;
  overflow: hidden;

  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  flex-shrink: 0; /* Verhindert, dass das Icon in Flex-Containern gequetscht wird */
`;

const StyledImage = styled(NextImage)`
  width: 100%;
  height: 100%;

  object-fit: cover;
  object-position: center;

  /* Verhindert leichtes Flackern bei Animationen */
  -webkit-backface-visibility: hidden;
`;
