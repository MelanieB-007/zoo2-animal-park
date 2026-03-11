import styled from "styled-components";
import GameIcon from "../../icons/GameIcon";

export default function StallLevelBadge({ level, habitat }) {
  return (
    <StallContainer>
      <GameIcon
        type="gehege/stall"
        fileName={`${habitat?.toLowerCase() || "gras"}.png`}
      />
      <LevelBadgeCircle>{level}</LevelBadgeCircle>
    </StallContainer>
  );
}


const StallContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 64px;
  height: 64px;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.1);
    z-index: 5;
  }
`;

const LevelBadgeCircle = styled.div`
  position: absolute;
  bottom: -2px;
  right: -2px;

  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;

  background: #4ca64c;
  border: 2px solid white;
  border-radius: 50%;

  color: white;
  font-weight: 900;
  font-size: 0.85rem;
  font-family: "Arial", sans-serif;

  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  z-index: 2;
`;