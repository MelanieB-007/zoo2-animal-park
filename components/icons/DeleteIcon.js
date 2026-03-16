import React from "react";
import styled from "styled-components";
import NextImage from "next/image";
import { useTranslation } from 'next-i18next';

import Tooltip from "../ui/Tooltip";

export default function DeleteButton({ tooltip, align }) {
  const { translation } = useTranslation('common');

  return (
    <Tooltip
      text={tooltip}
      align={align}
    >
      <StyledButton>
        <NextImage
          src="/images/icons/trash.webp"
          alt={translation.delete}
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
    filter: brightness(1.3) drop-shadow(0 0 3px rgba(0, 0, 0, 0.2));
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;