"use client";

import React, { useEffect, useState } from "react";
import { IoMenu, IoClose } from "react-icons/io5";
import styled from "styled-components";
import { theme } from "@/styles/theme";

import Logo from "./Logo";
import Navigation from "./Navigation";
import Login from "./Login";
import { MobileNavigation } from "./MobileNavigation";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Verhindert das Scrollen des Bodys, wenn das mobile Menü offen ist
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    // Cleanup beim Unmount
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMenuOpen]);

  return (
    <StyledHeader>
      <LogoWrapper>
        <Logo />
      </LogoWrapper>

      <TitleSection>
        <MainTitle>Klub der tollen Tiere</MainTitle>
      </TitleSection>

      <MobileMenuButton onClick={toggleMenu} aria-label="Menu">
        {isMenuOpen ? <IoClose size={32} /> : <IoMenu size={32} />}
      </MobileMenuButton>

      <MobileNavigation isOpen={isMenuOpen} onClose={toggleMenu} />

      <NavSection>
        <Navigation />
      </NavSection>

      <RightSection>
        <Login />
      </RightSection>
    </StyledHeader>
  );
}

// --- Styles ---

const StyledHeader = styled.header`
  display: grid;
  /* Desktop: Logo (140px) | Titel/Nav (Flexible Mitte) | Login (140px) */
  grid-template-columns: 140px 1fr 140px;
  grid-template-rows: 80px 50px;
  column-gap: 1.5rem;

  padding: 10px 1.5rem;
  margin: 10px auto 5px auto;
  width: 95%;
  max-width: 1200px;

  /* Glass-Morphismus aus deinem Theme */
  background: ${theme.colors.brand.petrol}EE; /* EE für hohe Deckkraft */
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);

  position: relative;
  z-index: 2000;

  @media (max-width: 768px) {
    grid-template-columns: 70px 1fr 60px;
    grid-template-rows: 70px;
    column-gap: 0.5rem;
    padding: 5px 1rem;
    align-items: center;
    border-radius: 10px;
  }
`;

const LogoWrapper = styled.div`
  grid-column: 1;
  grid-row: 1 / span 2;
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    grid-row: 1;
    img,
    svg {
      width: 60px;
      height: auto;
    }
  }
`;

const TitleSection = styled.div`
  grid-column: 2;
  grid-row: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const MainTitle = styled.h1`
  /* Nutzt deine spezielle Club-Schriftart */
  font-family: var(--font-club), sans-serif;
  font-size: clamp(1.2rem, 5vw, 2.4rem);
  color: ${theme.colors.brand.green};
  margin: 0;
  line-height: 1.1;

  /* Dein markanter Retro-Text-Shadow */
  text-shadow:
    2px 2px 0 ${theme.colors.brand.petrolDark},
    4px 4px 0 rgba(0, 0, 0, 0.3);

  letter-spacing: 0.15em;
  white-space: nowrap;
  text-transform: uppercase;

  @media (max-width: 768px) {
    letter-spacing: 0.05em;
    text-shadow: 1px 1px 0 ${theme.colors.brand.petrolDark};
  }
`;

const NavSection = styled.div`
  grid-column: 2;
  grid-row: 2;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding-bottom: 8px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const RightSection = styled.div`
  grid-column: 3;
  grid-row: 1 / span 2;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  gap: 4px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: transparent;
  border: none;
  color: ${theme.colors.ui.surface};
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: rotate(90deg);
  }

  @media (max-width: 768px) {
    display: flex;
    grid-column: 3;
    grid-row: 1;
    align-items: center;
    justify-content: center;
  }
`;
