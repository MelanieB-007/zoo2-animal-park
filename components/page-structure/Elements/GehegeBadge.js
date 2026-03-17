import styled from "styled-components";
import NextImage from "next/image";
import { habitatColors } from "../../../utils/habitatConstants";
import Tooltip from "../../ui/Tooltip";

export default function GehegeBadge({ type, size = 20 }) {
  const safeType = type?.toLowerCase() || "default";

  return (
    <Tooltip text={`${type} Gehege`}>
      <BadgeWrapper $type={safeType}>
        <NextImage
          src={`/images/gehege/icons/${safeType}.webp`}
          alt={type}
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
  border-radius: var(--border-radius-icon);
  background-color: ${(props) =>
    (habitatColors[props.$type]?.main || "var(--color-grey)") + "33"};
  border: 2px solid ${(props) => habitatColors[props.$type]?.main || "var(--color-grey)"};
  font-weight: 800;
  font-size: 0.8rem;
  text-transform: uppercase;
`;