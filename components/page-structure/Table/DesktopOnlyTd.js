import React from "react";
import styled from "styled-components";

export default function DesktopOnlyTd({children}){
  return (
    <StyledDesktopOnlyTd>
      {children}
    </StyledDesktopOnlyTd>
  );
}

const StyledDesktopOnlyTd = styled.td`
  text-align: right;
  padding-right: 20px !important;
  
  @media (max-width: 1024px) {
    display: none;
  }
`;