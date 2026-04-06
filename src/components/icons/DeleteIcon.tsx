"use client";

import React, { ComponentProps } from "react";
import styled from "styled-components";
import NextImage from "next/image";
import { useTranslations } from "next-intl";

import Tooltip from "@/components/pageStructure/ui/Tooltip";

// Wir holen uns den Typ direkt vom Tooltip-Feld "align"
type TooltipAlign = ComponentProps<typeof Tooltip>["align"];

interface DeleteButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  tooltip?: string;
  align?: TooltipAlign;
  altText?: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function DeleteButton({
  tooltip,
  align,
  altText,
  onClick,
  ...props
}: DeleteButtonProps) {
  const t = useTranslations("common");

  const defaultTooltip = tooltip || t("actions.delete");
  const imageAlt = altText || t("actions.delete");

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
          src="/images/icons/trash.webp"
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
    filter: brightness(1.1) sepia(1) hue-rotate(-50deg) saturate(5);
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }

  &:focus-visible {
    outline: 2px solid #ef4444;
    outline-offset: 2px;
  }
`;