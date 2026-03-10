import styled from "styled-components";

export default function Main({ children }) {
  return (
    <StyledMain>
      {children}
    </StyledMain>
);
}

const StyledMain = styled.main`
  position: relative;
  flex: 1 1 auto;
  margin: 0 auto;
  width: 100%;
  max-width: var(--width-page);
  padding: 2rem;
  min-height: calc(100vh - 300px);
  z-index: 1;
  overflow: visible;

  background-color: var(--color-yellow-light);
  backdrop-filter: var(--glass-blur);
  border: var(--glass-border);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-soft);

  & > * {
    margin-bottom: 3rem;
  }
  
  & > *:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 1200px) {
    padding: 1.5rem 1rem 1rem 1rem;
  }

  @media (max-width: 768px) {
    padding: 1.5rem 1rem 1rem 1rem;
    margin: 8px auto;
    min-height: auto;
  }
`;