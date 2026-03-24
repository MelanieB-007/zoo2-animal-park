import React from "react";
import styled from "styled-components";

import GameIcon from "./GameIcon";
import Tooltip from "../../ui/Tooltip";
import { habitatColors } from "../../../utils/habitatConstants";

export default function ItemThumbnail({
  image,
  name,
  habitat,
  size = 55,
  category,
  tooltip = true,
}) {
  const habitatKey = (habitat?.name || "standard").toLowerCase();

  const thumbnail = (
    <StyledThumbnail $habitat={habitatKey} $size={size}>
      <GameIcon
        type={category}
        fileName={image}
        size={size - 10}
        bordercolor="transparent"
      />
    </StyledThumbnail>
  );

  if (tooltip && name) {
    return (
      <Tooltip text={name} align="top">
        {thumbnail}
      </Tooltip>
    );
  }

  return thumbnail;
}

const StyledThumbnail = styled.div`
  position: relative;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-white);
  flex-shrink: 0;

  /* Dynamischer Rahmen basierend auf dem Habitat */
  border: 3px solid
    ${({ $habitat }) => habitatColors[$habitat]?.main || "#8dbd5b"};

  transition:
    transform 0.2s ease-in-out,
    box-shadow 0.2s,
    border-color 0.2s;
  cursor: pointer;
  z-index: 1;

  &:hover {
    transform: scale(1.6);
    z-index: 100;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
    border-color: ${(props) =>
      habitatColors[props.$habitat]?.light || "#a8d384"};
  }
`;
