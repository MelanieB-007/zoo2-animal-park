import React from "react";
import styled from "styled-components";
import NextImage from "next/image";
import Tooltip from "../ui/Tooltip";

export default function DeleteButton({ tooltip, align, altText, onClick, ...props }) {
  return (
    <Tooltip
      text={tooltip}
      align={align}
    >
      <StyledButton
        onClick={onClick} {...props}
        type="button"
      >
        <NextImage
          src="/images/icons/trash.webp"
          alt={altText || "Delete"}
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
`;