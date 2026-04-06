import styled from "styled-components";
import NextImage from "next/image";
import Tooltip from "../../../src/components/pageStructure/ui/Tooltip";

export default function OriginBadgeList({ animal }) {
  if (!animal?.tierherkunft) return null;

  return (
    <StyledOriginBadgeList>
      {animal.tierherkunft.map((entry, index) => (
        <Tooltip
          key={entry.herkunft?.id || index}
          text={entry.herkunft?.name}
          position="top"
        >
          <BadgeWrapper>
            <StyledImage
              key={entry.herkunft?.id || index}
              src={`/images/herkunft/${entry.herkunft?.bild}`}
              alt={entry.herkunft?.name}
              width={50}
              height={50}
            />
          </BadgeWrapper>
        </Tooltip>
      ))}
    </StyledOriginBadgeList>
  );
}

const StyledOriginBadgeList = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const BadgeWrapper = styled.div`
  display: flex;
  align-items: center;
  cursor: help;
`;

const StyledImage = styled(NextImage)`
  width: 32px;
  height: 32px;
  object-fit: contain;
  filter: drop-shadow(0px 2px 3px rgba(0, 0, 0, 0.15));
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);
  }
`;