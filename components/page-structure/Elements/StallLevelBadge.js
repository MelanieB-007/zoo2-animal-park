import styled from "styled-components";
import { useTranslation } from "next-i18next";

import GameIcon from "../../icons/GameIcon";
import Tooltip from "../../ui/Tooltip";

export default function StallLevelBadge({ level, habitat }) {
  const { t } = /** @type {any} */ (useTranslation(["animals", "common"]));

  return (
    <Tooltip
      text={`${t("animals:tooltips.level")}: ${level}`}
      position="bottom"
    >
      <StallContainer>
        <GameIcon
          fileName="Stall.png"
          type={`gehege/${habitat?.toLowerCase() || "gras"}`}
        />
        <LevelBadgeCircle>{level}</LevelBadgeCircle>
      </StallContainer>
    </Tooltip>
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
  border: 2px solid var(--color-white);
  border-radius: 50%;

  color: var(--color-white);
  font-weight: 900;
  font-size: 0.85rem;
  font-family: var(--font-text), sans-serif;

  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  z-index: 2;
`;