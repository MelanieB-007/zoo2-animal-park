import Link from "next/link";
import styled from "styled-components";

export default function Logo() {
  return (
    <Link href="/" passHref style={{ textDecoration: "none" }}>
      <LogoWrapper>
        <StyledImage src="/images/logo.png" alt="Klub der tollen Tiere Logo" />
      </LogoWrapper>
    </Link>
  );
}

const LogoWrapper = styled.div`
  grid-column: 1;
  grid-row: 1 / span 2; 
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledImage = styled.img`
  width: 120px;
  height: auto;
  object-fit: contain;
  filter: drop-shadow(var(--shadow-header-button));
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05) rotate(-2deg);
  }

  @media (max-width: 767px) {
    width: 80px;
  }
`;