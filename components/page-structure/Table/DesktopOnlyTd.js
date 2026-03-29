import React from "react";
import styled from "styled-components";
import RightAlignedTd from "./RightAlignedTd";

export default function DesktopOnlyTd({children}){
  return (
    <StyledDesktopOnlyTd>
      {children}
    </StyledDesktopOnlyTd>
  );
}

const StyledDesktopOnlyTd = styled(RightAlignedTd)`
  display: none;
  
  @media (min-width: 1100px) {
    display: table-cell;
  }
`;