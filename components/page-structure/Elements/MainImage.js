import styled from "styled-components";
import NextImage from "next/image";

export default function MainImage({animal}){
  return (
    <StyledMainImage
      src={`/images/tiere/${animal.gehege.name}/${animal.bild}`}
      alt={animal.name}
      width={50}
      height={50}
    />
  );
}

const StyledMainImage = styled(NextImage)`
  width: 220px;
  height: 220px;
  border-radius: 15px;
  object-fit: cover;
  border: 1px solid #eee;
`;
