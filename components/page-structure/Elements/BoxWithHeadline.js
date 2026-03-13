import styled from "styled-components";
import StatBox from "./StatBox";

export default function BoxWithHeadline({children, translations}){
  return (
    <EnclosureBox>
      <label>
        {translations.tableEnclosure}
      </label>
      {children}
    </EnclosureBox>
  );
}

/*geht über 2 Zeilen */
const EnclosureBox = styled(StatBox)`
  grid-row: span 2;
  display: flex;
  flex-direction: column;
`;

export const EnclosureArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 8px;
  flex-wrap: wrap;
`;