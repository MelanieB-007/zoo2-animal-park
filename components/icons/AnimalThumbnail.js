import React from "react";
import styled from "styled-components";
import GameIcon from "./GameIcon";
import Tooltip from "../ui/Tooltip";
import { habitatColors } from "../../utils/habitatConstants";

export default function AnimalThumbnail({ animal, size = 55 }) {
  const habitatKey = (animal.gehege?.name || "standard").toLowerCase();
  const animalName = animal.name || "Unbekanntes Tier";

  const iconPath = `tiere/${habitatKey}`;

  return (
    <Tooltip text={animalName} align="top">
      <StyledThumbnail
        $habitat={habitatKey}
        $size={size}
      >
        <GameIcon
          type={iconPath}
          fileName={animal.bild || "images/placeholder.jpg"}
          size={size - 10}
          bordercolor="transparent"
        />
      </StyledThumbnail>
    </Tooltip>
  );
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
  border: 3px solid ${({ $habitat }) =>
          habitatColors[$habitat]?.main || "#8dbd5b"};
  
  transition: transform 0.2s ease-in-out, box-shadow 0.2s, border-color 0.2s;
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