import {useEffect, useState} from "react";
import { IoMenu, IoClose } from "react-icons/io5";
import styled from "styled-components";

import Logo from "./Logo";
import Navigation from "./Navigation";
import Login from "./Login";
import { MobileNavigation } from "./MobileNavigation";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    }, [isMenuOpen]);

    return (
        <StyledHeader>
            <LogoWrapper>
                <Logo />
            </LogoWrapper>

            <TitleSection>
                <MainTitle>
                    Klub der tollen Tiere
                </MainTitle>
            </TitleSection>

            <MobileMenuButton onClick={toggleMenu}>
                {isMenuOpen ? <IoClose size={32} /> : <IoMenu size={32} />}
            </MobileMenuButton>

            {/* Mobile Navigation Overlay */}
            <MobileNavigation isOpen={isMenuOpen} onClose={toggleMenu} />

            {/* Desktop Navigation */}
            <NavSection>
                <Navigation />
            </NavSection>

            {/* Desktop Login/Language Bereich */}
            <RightSection>
                <Login />
            </RightSection>
        </StyledHeader>
    );
}

const StyledHeader = styled.header`
  display: grid;
  /* Desktop: Logo | Titel/Nav | Login */
  grid-template-columns: 140px 1fr 140px;
  grid-template-rows: 80px 50px;
  column-gap: 1.5rem;

  padding: 10px 1.5rem;
  margin: 10px auto 5px auto;
  width: 100%;
  max-width: var(--width-page);

  background: var(--color-zoo-orange);
  backdrop-filter: var(--glass-blur);
  border: var(--glass-border);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-soft);
  position: relative;
  z-index: 2000;

  @media (max-width: 768px) {
    /* Mobile: Logo | Titel | Burger */
    grid-template-columns: 70px 1fr 60px;
    grid-template-rows: 70px;
    column-gap: 0.5rem;
    padding: 5px 1rem;
    align-items: center;
  }
`;

const LogoWrapper = styled.div`
  grid-column: 1;
  grid-row: 1 / span 2;
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    grid-row: 1;
    
    & svg, & img {
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
  font-family: var(--font-club);
  font-size: clamp(1.2rem, 5vw, 2.4rem); 
  color: var(--color-green);
  margin: 0;
  line-height: 1.1;
  
  text-shadow:
          2px 2px 0 var(--color-petrol),
          4px 4px 0 var(--color-petrol-dark),
          6px 6px 0 var(--color-black);
  
  letter-spacing: 0.15em;
  white-space: nowrap;

  @media (max-width: 768px) {
    letter-spacing: 0.05em;
    text-shadow: 
            1px 1px 0 var(--color-petrol), 
            2px 2px 0 --color-black;
  }
`;

const NavSection = styled.div`
  grid-column: 2;
  grid-row: 2;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding-bottom: 5px;

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
  z-index: 10000;
  background: transparent;
  border: none;
  color: var(--color-white) !important;
  cursor: pointer;

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