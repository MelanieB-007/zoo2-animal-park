import styled from "styled-components";

export default function TwoColumnGrid({children}){
  return (
    <StyledTwoColumnGrid>
      {children}
    </StyledTwoColumnGrid>
  );
}

const StyledTwoColumnGrid = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 20px;
  margin-top: 20px;
  width: 100%; /* Sicherstellen, dass das Grid vollflächig ist */

  @media (max-width: 768px) {
    display: flex; /* Wechsel auf Flexbox für einfache Umkehrung */
    flex-direction: column-reverse; /* Akkordeon (unten im Code) rutscht nach oben */
    align-items: center;
    gap: 15px;
  }
`;
