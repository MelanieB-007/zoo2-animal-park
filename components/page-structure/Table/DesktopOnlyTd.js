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
  display: none; /* Standardmäßig ausblenden (Mobile/Tablet) */

  /* Erst ab einer Breite, wo die Tabelle wirklich Platz hat, anzeigen */
  @media (min-width: 1100px) {
    display: table-cell;
  }
`;