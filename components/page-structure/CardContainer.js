import styled from "styled-components";

export default function CardContainer({children}){

  return (
    <StyledCardContainer>
      {children}
    </StyledCardContainer>
  );
}

const StyledCardContainer = styled.div`
  background: #fdfdfd; 
  border: 1.5px solid #d1e2a5;
  border-radius: 20px;
  padding: 24px;
  display: flex;
  gap: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;