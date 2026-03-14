import styled from "styled-components";
import NextImage from "next/image";

export default function VariantCard({ variant }) {
  const herkunft = variant.herkunft

  return (
    <StyledVariantCard title={variant.name}>
      <ImageWrapper>
        <NextImage
          src={`/images/farbvarianten/${variant.bild}`}
          alt={variant.name}
          width={200}
          height={200}
          style={{ objectFit: "contain" }}
        />
      </ImageWrapper>
      <VariantName>{variant.farbe}</VariantName>
      <ReleaseDate>
        📅 Release: {variant.release}
      </ReleaseDate>
      {herkunft && (
        <OriginRow title={herkunft.name}>
          <NextImage
            src={`/images/herkunft/${herkunft.bild}`}
            alt={herkunft.name}
            width={20}
            height={20}
          />
        </OriginRow>
      )}
    </StyledVariantCard>
  );
}

const StyledVariantCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f9f9f9;
  border: 2px solid #e0e0e0;
  border-radius: 15px;
  padding: 15px;
  width: 100%;           /* Standard für Handy: Volle Breite */
  max-width: none;      /* Aber maximal 280px breit (etwas breiter als Desktop) */
  margin: 0 auto;        /* Auf Mobile in der Mitte zentrieren */
  
  height: auto;
  min-height: 260px;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);

  @media (min-width: 768px) {
    width: 230px;
    margin: 0;           /* Zentrierung auf Desktop aufheben */
  }
  
  &:hover {
    transform: translateY(-5px);
    border-color: #4a7c2a;
    background: #ffffff;
    box-shadow: 0 8px 15px rgba(0,0,0,0.1);
  }
`;

const ImageWrapper = styled.div`
  width: 100%;
  max-width: 200px;
  aspect-ratio: 1 / 1;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  /* Entferne eventuell overflow: hidden zum Testen, ob der Text dann erscheint */
  border-radius: 10px;
  background: #fff;

  img {
    max-width: 100%;
    height: auto !important;
  }
`;

const VariantName = styled.span`
  margin-top: 15px;
  font-size: 1.1rem;
  font-weight: bold;
  color: #2c3e50;
  text-align: center;
  /* Wichtig: Sicherstellen, dass der Text eine Block-Eigenschaft hat */
  display: block;
  width: 100%;
  word-wrap: break-word; /* Falls der Name sehr lang ist */
`;

const ReleaseDate = styled.div`
  font-size: 0.8rem;
  margin-top: 5px;
`;

// Diese müssen unten in die VariantCard.js zu den anderen Styled Components:

const InfoRow = styled.div`
  margin-top: 8px;
  font-size: 0.85rem;
  color: #666;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const OriginRow = styled.div`
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  background: #f1f8e9; /* Ein ganz zartes Zoo-Grün */
  padding: 6px 12px;
  border-radius: 20px;
  color: #2e7d32;
  border: 1px solid #c8e6c9;
  width: fit-content; /* Damit der Hintergrund nicht über die volle Breite geht */
  
  span {
    font-weight: 600;
  }
`;