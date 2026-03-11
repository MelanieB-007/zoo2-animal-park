import React from "react";
import styled from "styled-components";

export default function ResultsInfo({ currentCount, totalCount, labelShown, labelOf, labelUnit }) {
  return (
    <StyledInfo>
      {labelShown} <strong>{currentCount}</strong> {labelOf}
      <strong> {totalCount}</strong> {labelUnit}
    </StyledInfo>
  );
}

const StyledInfo = styled.p`
  width: 100%;
  text-align: center; 
  margin: 0 auto 15px auto;
  font-size: 0.95rem;
  color: #666;
  font-family: "Inter", sans-serif;

  strong {
    color: #2d5a27; 
    font-weight: 800;
  }
`;