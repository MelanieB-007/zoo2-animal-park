import styled from "styled-components";
import StatBox from "./StatBox";
import { useTranslation } from "next-i18next";

export default function BoxWithHeadline({children}){
  const { t } = useTranslation('common');

  return (
    <EnclosureBox>
      <label>
        {t('binomes')}
      </label>
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
  
  & > * {
    flex-shrink: 0;
  }
`;