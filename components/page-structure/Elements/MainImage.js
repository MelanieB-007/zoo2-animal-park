import styled from "styled-components";
import NextImage from "next/image";

export default function MainImage({ animal }) {
  let imagePath =
    animal.bild === "placeholder.png"
      ? `/images/placeholder.jpg`
      : `/images/tiere/${animal.gehege.name}/${animal.bild}`;

  // 2. Sicherheits-Check: Doppelte Slashes (außer bei http://) zu einfachen Slashes machen
  const cleanPath = imagePath.replace(/([^:]\/)\/+/g, "$1");

  return (
    <ImageContainer>
      <StyledMainImage
        src={cleanPath}
        alt={animal.name}
        width={400}
        height={400}
        priority
      />
    </ImageContainer>
  );
}

const ImageContainer = styled.div`
  /* Wir nutzen ein festes Seitenverhältnis (1:1), damit es quadratisch ist */
  width: 100%;
  aspect-ratio: 1 / 1; // Erzwingt ein Quadrat
  max-width: 400px;
  margin: 0 auto; // Zentriert

  // Der Zoo-Look:
  border-radius: 20px;
  border: 2px solid #004d4d; // Sehr dezenter Grauton
  background: white; // Wichtig für den Schatten
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.06); // Weicher Schatten

  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden; // Beschneidet das Bild auf die runden Ecken

  // Medienquery: Für Desktop etwas kleiner
  @media (min-width: 768px) {
    width: 240px;
    height: 240px;
  }
`;

const StyledMainImage = styled(NextImage)`
  /* Das Bild füllt den Container komplett aus, ohne ihn zu verformen */
  width: 100%;
  height: 100%;
  object-fit: cover; // Füllt das Quadrat aus
  object-position: center; // Zentriert das Tier im Bild
`;