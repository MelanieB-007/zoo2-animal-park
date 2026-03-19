import React from "react";
import styled from "styled-components";

export default function NoResult({ text }) {
  return (
    <tr>
      <StyledNoResult>
        {text}
      </StyledNoResult>
    </tr>
  );
}

const StyledNoResult = styled.td.attrs({
  colSpan: 8,
})`
  text-align: center;
  padding: 20px;
`;