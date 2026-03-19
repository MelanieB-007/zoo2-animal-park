import React from "react";
import styled from "styled-components";

export default function RightAlignedTd({children}){
  return (
    <StyledRightAlignedTd>
      {children}
    </StyledRightAlignedTd>
  );
}

export const StyledRightAlignedTd = styled.td`
  text-align: right;
`;