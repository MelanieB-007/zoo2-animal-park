import React from "react";
import styled from "styled-components";
import NextImage from "next/image";
import Tooltip from "../ui/Tooltip";

export default function EditButton({ tooltip, align }) {
  return (
    <Tooltip
      text={tooltip}
      align={align}
    >
      <StyledButton>
        <NextImage
          src="/images/icons/edit.webp"
          alt="Editieren"
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
  font-size: 1.2rem;
  color: #3b82f6;
  transition:
    filter 0.2s,
    transform 0.1s;

  &:hover {
    filter: brightness(1.3) drop-shadow(0 0 3px rgba(0, 0, 0, 0.2));
    transform: scale(1.1);
  }
`;
