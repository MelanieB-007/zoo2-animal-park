import styled from "styled-components";
import { useTranslation } from "next-i18next";

import GameIcon from "../../icons/GameIcon";
import Tooltip from "../../ui/Tooltip";

export default function StallLevelBadge({ level, habitat, showTooltip, size = 64 }) {
  const { t } = /** @type {any} */ (useTranslation(["animals", "common"]));

  // Der Inhalt der Komponente (Icon + Level-Kreis)
  const BadgeContent = (
    <StallContainer $size={size}>
      <GameIcon
        fileName="Stall.png"
        type={`gehege/${habitat?.toLowerCase() || "gras"}`}
        size={size}
      />
      <LevelBadgeCircle $size={size}>
        {level}
      </LevelBadgeCircle>
    </StallContainer>
  );

  // Wenn showTooltip explizit false ist (z.B. im Filter), nur den Content zurückgeben
  if (showTooltip === false) {
    return BadgeContent;
  }

  // Standardmäßig mit Tooltip (z.B. in der Tabelle)
  return (
    <Tooltip
      text={`${t("animals:tooltips.level")}: ${level}`}
      position="bottom"
    >
      {BadgeContent}
    </Tooltip>
  );
}

// --- Styles ---

const StallContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  
  /* Nutzt die übergebene size für die Box */
  width: ${props => props.$size}px;
  height: ${props => props.$size}px;

  /* GANZ WICHTIG: Erlaubt dem Level-Kreis, über den Rand zu ragen */
  overflow: visible !important; 

  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.1);
    z-index: 10;
  }
`;

const LevelBadgeCircle = styled.div`
  position: absolute;
  
  /* Positionierung leicht über den rechten unteren Rand hinaus */
  bottom: -5px; 
  right: -5px;

  /* Dynamische Größe: ca. 45% vom Stall, aber mindestens 22px für Lesbarkeit */
  ${props => {
  const dynamicSize = Math.max(props.$size * 0.45, 22);
  return `
      width: ${dynamicSize}px;
      height: ${dynamicSize}px;
    `;
}}

  display: flex;
  align-items: center;
  justify-content: center;

  /* Styling des Kreises */
  background: #4ca64c;
  border: 2px solid var(--color-white);
  border-radius: 50%; /* Erzwingt die Kreisform */
  
  color: var(--color-white);
  font-weight: 900;
  
  /* Schriftgröße skaliert mit, mindestens aber 11px */
  font-size: ${props => Math.max(props.$size * 0.25, 11)}px;
  font-family: var(--font-text), sans-serif;

  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  
  /* Stellt sicher, dass die Zahl immer oben liegt */
  z-index: 5;
`;