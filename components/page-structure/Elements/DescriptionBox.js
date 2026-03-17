import { useTranslation } from "next-i18next";
import styled from "styled-components";

export default function DescriptionBox({animal}){
  const { t } = useTranslation(['common', 'animals']);


  return (
    <DetailBox>
      <LabelDescription>
        {t('description"', { ns: 'common' })}
      </LabelDescription>
      <p>{animal.beschreibung}</p>
    </DetailBox>
  );
}

const DetailBox = styled.div`
  background: var(--color-white);
  border: 1px solid var(--color-white-border);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  
  height: auto;         
  min-height: 203px;     

  p {
    line-height: 1.6;   
    margin: 0;         
    color: var(--color-grey-0-1);
  }

  h3 {
    display: flex;
    align-items: center;
    margin-top: 0;
    margin-bottom: 1.2rem;
    font-size: 1.25rem;
    color: var(--color-petrol-grey);
    border-bottom: 2px solid var(--color-white);
    padding-bottom: 0.8rem;

    span {
      margin-right: 12px;
    }
  }
`;

const LabelDescription = styled.label`
  font-weight: bold;
  font-size: 1rem;
  color: var(--color-green-label);
`;
