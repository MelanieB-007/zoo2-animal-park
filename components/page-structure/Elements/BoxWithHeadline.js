import styled from "styled-components";
import StatBox from "./StatBox";

export default function BoxWithHeadline({children, translations}){
  return (
    <EnclosureBox>
      <label>{translations.tableEnclosure}</label>
      <IconRow>
        {children}
      </IconRow>
    </EnclosureBox>
  );
}

const EnclosureBox = styled(StatBox)`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* Auf Desktop soll sie die Höhe der zwei anderen Boxen einnehmen */
  @media (min-width: 768px) {
    height: 100%;
  }
`;

const IconRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 10px;
  width: 100%;
  flex: 1;
  padding: 10px 0;
  
  /* Verhindert das Verzerren der Bilder */
  & > * {
    flex-shrink: 0;
  }
`;