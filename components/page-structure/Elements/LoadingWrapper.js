import styled from "styled-components";

export default function LoadingWrapper ({ children }) {
  return (
    <StyledLoadingWrapper>
      {children}
    </StyledLoadingWrapper>
  );
}

const StyledLoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #d6efc0;
  font-weight: bold;
  color: #4ca64c;
`;