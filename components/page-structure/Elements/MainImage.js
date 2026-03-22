import styled from "styled-components";
import NextImage from "next/image";

export default function MainImage({animal}){
  let imagePath = animal.bild === "placeholder.png"
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
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledMainImage = styled(NextImage)`
  width: 100%;
  max-width: 400px;
  height: auto; 
  
  border-radius: 15px;
  border: 1px solid #eee;
  
  object-fit: cover; 

  @media (min-width: 768px) {
    width: 220px;
    height: 220px;
  }
`;