import React from "react";
import styled from "styled-components";

export default function Loading({ text }) {
  return <StyledLoadingWrapper>
    {text}
  </StyledLoadingWrapper>;
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