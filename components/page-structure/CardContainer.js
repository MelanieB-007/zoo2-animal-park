import styled from "styled-components";

export default function CardContainer({children}){

  return (
    <StyledCardContainer>
      {children}
    </StyledCardContainer>
  );
}

const StyledCardContainer = styled.div`
  background: #fdfdfd; 
  border: 1.5px solid #d1e2a5;
  border-radius: 20px;
  padding: 24px;
  display: flex;
  gap: 20px;
  width: 100%;
  flex-direction: row;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;    /* Zentriert Bild und Info-Sektion horizontal */
    padding: 15px;          /* Etwas weniger Padding, damit mehr Platz für den Inhalt bleibt */
    gap: 15px;              /* Kleinerer Abstand zwischen Bild und Text */

    /* Falls der Container auf dem Handy zu schmal wirkt: */
    margin: 0;        /* Entfernt seitliche Abstände */
    width: 100%;      /* Erzwingt die gleiche Breite wie die Akkordeons */
    border-radius: 20px;
  }
`;