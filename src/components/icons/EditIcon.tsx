"use client";

import React, { ComponentProps } from "react";
import styled from "styled-components";
import NextImage from "next/image";
import { useTranslations } from "next-intl";

import Tooltip from "@/components/pageStructure/ui/Tooltip";

// Sicherstellen, dass der Typ exakt vom Tooltip kommt
type TooltipAlign = ComponentProps<typeof Tooltip>["align"];

interface EditButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  tooltip?: string;
  align?: TooltipAlign;
  altText?: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function EditButton({
  tooltip,
  align,
  altText,
  onClick,
  ...props
}: EditButtonProps) {
  const t = useTranslations();

  // Fallback-Texte aus der Sprachdatei
  const defaultTooltip = tooltip || t("common:actions.edit");
  const imageAlt = altText || t("common:actions.edit");

  return (
    <Tooltip
      text={defaultTooltip}
      align={align}
    >
      <StyledButton
        onClick={onClick}
        type="button"
        {...props}
      >
        <NextImage
          src="/images/icons/edit.webp"
          alt={imageAlt}
          width={24}
          height={24}
        />
      </StyledButton>
    </Tooltip>
  );
}

const StyledButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 4px;
  transition:
    filter 0.2s,
    transform 0.1s;

  &:hover {
    filter: brightness(1.3) drop-shadow(0 0 3px rgba(0, 0, 0, 0.2));
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }

  &:focus-visible {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }
`;