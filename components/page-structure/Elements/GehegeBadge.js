import styled from "styled-components";
import NextImage from "next/image";
import { useTranslation } from "next-i18next";

import { habitatColors } from "../../../utils/habitatConstants";
import Tooltip from "../../ui/Tooltip";
import { getTranslatedName } from "../../ui/TranslationHelper";

export default function GehegeBadge({ gehege, size = 20 }) {
  const { t, i18n } = useTranslation(["animals", "common"]);

  const safeType = gehege?.name?.toLowerCase() || "default";

  const displayName = gehege
    ? getTranslatedName(gehege, i18n.language)
    : gehege?.name;

  return (
    <Tooltip
      text={`${displayName} ${t("animals:table.enclosure")}`}
    >
      <BadgeWrapper $type={safeType}>
        <NextImage
          src={`/images/gehege/icons/${safeType}.webp`}
          alt={displayName}
          width={size}
          height={size}
        />
      </BadgeWrapper>
    </Tooltip>
  );
}

const BadgeWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 6px 14px;
  border-radius: 20px;
  background-color: ${props => 
          (habitatColors[props.$type]?.main || "#666") + "33"};
  border: 2px solid ${props => 
          habitatColors[props.$type]?.main || "#666"};
  font-weight: 800;
  font-size: 0.8rem;
  text-transform: uppercase;
`;