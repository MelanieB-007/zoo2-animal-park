import styled from "styled-components";

export default function PageHeader() {
  return (
    <StyledHeader className="page-header">
      <Headline>
        Übersicht über alle Tiere
      </Headline>
    </StyledHeader>
  );
}

const StyledHeader = styled.header`
  width: 100%;
  max-width: 1200px; 
  margin-bottom: 40px;
  text-align: center;
`;

const Headline = styled.h1`
  font-family: 'Playfair Display', serif;
  font-size: clamp(2rem, 5vw, 3rem);
  color: #1a4332;
  letter-spacing: -0.02em;
  margin: 0;
  
  &::after {
    content: '';
    display: block;
    width: 60px;
    height: 3px;
    background-color: #8dbd5b; 
    margin: 15px auto 0;
    border-radius: 2px;
  }
`;