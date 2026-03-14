import styled from "styled-components";
import NextImage from "next/image";

export default function MainImage({animal}){
  return (
    <ImageContainer>
      <StyledMainImage
        src={`/images/tiere/${animal.gehege.name}/${animal.bild}`}
        alt={animal.name}
        // Wir geben hier größere Werte für die Basis-Qualität an
        width={400}
        height={400}
        priority // Lädt das Hauptbild schneller
      />
    </ImageContainer>
  );
}
const ImageContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledMainImage = styled(NextImage)`
  /* Auf Mobile: Volle Breite bis maximal 400px */
  width: 100%;
  max-width: 400px;
  height: auto; /* Ganz wichtig für das Seitenverhältnis! */
  
  border-radius: 15px;
  border: 1px solid #eee;
  
  /* Wechsel von 'cover' zu 'contain', falls das ganze Pferd drauf soll, 
     oder 'cover' lassen, wenn der Container quadratisch bleiben soll */
  object-fit: cover; 

  @media (min-width: 768px) {
    /* Auf Desktop: Zurück zur kompakten Größe */
    width: 220px;
    height: 220px;
  }
`;