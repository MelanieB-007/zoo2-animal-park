import styled from "styled-components";

export default function ContentWrapper({children}){
  return (
    <StyledContentWrapper>
      {children}
    </StyledContentWrapper>
  );
}

const StyledContentWrapper = styled.div`
  max-width: 1000px;
  width: 100%;
  padding: 0 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;