import styled from "styled-components";
import NextImage from "next/image";
import { habitatColors } from "../../../utils/habitatConstants";


export default function GehegeBadge({ type }) {
  const safeType = type?.toLowerCase() || "default";
  return (
    <BadgeWrapper $type={safeType}>
      <NextImage
        src={`/images/gehege/icons/${safeType}.webp`}
        alt={type}
        width={20}
        height={20}
      />
    </BadgeWrapper>
  );
}

const BadgeWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 6px 14px;
  border-radius: 20px;
  background-color: ${props => (habitatColors[props.$type]?.main || "#666") + "33"};
  border: 2px solid ${props => habitatColors[props.$type]?.main || "#666"};
  font-weight: 800;
  font-size: 0.8rem;
  text-transform: uppercase;
`;