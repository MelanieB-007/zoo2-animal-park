import styled from "styled-components";

export default function PageWrapper({ children }) {
  return <StyledPageWrapper>{children}</StyledPageWrapper>;
}

const StyledPageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding: 40px 20px;
  
  background-color: var(--color-lime);
  border: 2px solid var(--color-petrol-darker);
  border-radius: var(--border-radius);

  @media (min-width: 768px) {
    padding: 40px;
  }
`;