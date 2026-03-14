import NextImage from "next/image";
import styled from "styled-components";

export default function PopularityDisplay({popularity, translation}) {
  return (
    <StyledWrapper>
        {popularity}
        <NextImage
          src="/images/icons/besucher.jpg"
          alt={translation.popularity}
          width={25}
          height={16}
        />
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 5px;
  font-weight: bold;
  width: 100%;
`;