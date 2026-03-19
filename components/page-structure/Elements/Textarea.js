import styled from "styled-components";

export default function Textarea ({label, text}){
  return (
    <DetailBox>
      <LabelDescription>
        {label}
      </LabelDescription>
      <p>{text}</p>
    </DetailBox>
  );
}

const DetailBox = styled.div`
  background: var(--color-white);
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  
  height: auto;          
  min-height: 203px;    

  p {
    line-height: 1.6;   
    margin: 0;          
    color: #333;
    white-space: pre-wrap;
  }

  h3 {
    display: flex;
    align-items: center;
    margin-top: 0;
    margin-bottom: 1.2rem;
    font-size: 1.25rem;
    color: #2c3e50;
    border-bottom: 2px solid #f1f2f6;
    padding-bottom: 0.8rem;

    span {
      margin-right: 12px;
    }
  }
`;

const LabelDescription = styled.label`
  font-weight: bold;
  font-size: 1rem;
  color: #2d5a27;
`;