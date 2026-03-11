import styled from "styled-components";
import NextImage from "next/image";

const habitatColors = {
  gras: { main: "#47610d" }, steppe: { main: "#924722" },
  wald: { main: "#224c0b" }, berg: { main: "#39525e" },
  savanne: { main: "#c66f12" }, dschungel: { main: "#4c7c07" },
  eis: { main: "#066eb8" }, wasser: { main: "#4634c1" },
  blattdickicht: { main: "#779d59" }, felsenwüste: { main: "#dcbc5d" },
  süsswasser: { main: "#71fef8" }, salzwasser: { main: "#603bde" },
  noctarium: { main: "#a540a2" }, default: { main: "#666666" },
};


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