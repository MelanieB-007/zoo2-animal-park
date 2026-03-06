import styled from "styled-components";
import Link from "next/link";

import Login from "./Login";

export const MobileNavigation = ({ isOpen, onClose }) => {
  return (
    <Overlay $isOpen={isOpen}>
      <MenuContent>
        <MobileNavLink href="/zoo" onClick={onClose}>
          Zoo
        </MobileNavLink>

        <MobileNavLink href="/tiere" onClick={onClose}>
          Tiere
        </MobileNavLink>

        <MobileNavLink href="/klub" onClick={onClose}>
          Klub
        </MobileNavLink>

        <Divider />

        <LoginContainer>
          <Login />
        </LoginContainer>
      </MenuContent>
    </Overlay>
  );
};

const MobileNavLink = styled(Link)`
  font-family: var(--font-headline);
  font-size: 1.6rem; 
  color: white;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 2px 2px 4px var(--color-black);
  margin-bottom: 1.5rem;
  transition: color 0.3s ease;

  &:active {
    color: var(--color-zoo-orange); 
  }
`;

const LoginContainer = styled.div`
  width: 100%;
  margin-top: 2rem;
  padding: 2rem 1rem;
  display: flex;
  justify-content: center;
  /* Eine feine Linie zur optischen Trennung vom Menü */
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.2); /* Etwas dunklerer Bereich für den User-Teil */
`;

const Divider = styled.div`
  width: 60px;
  height: 2px;
  background: var(--color-grey-0-2);
  margin: 1.5rem 0;
`;

const Overlay = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: var(--color-petrol-darker);
  z-index: 9999;

  display: flex;
  flex-direction: column;
  align-items: center;
  
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;

  scrollbar-width: none; 
  &::-webkit-scrollbar {
    display: none;
  }

  transform: ${({ $isOpen }) =>
      ($isOpen ? "translateX(0)" : "translateX(100%)")};
  
  transition: transform 0.4s cubic-bezier(0.77, 0, 0.175, 1);
  
  opacity: ${({ $isOpen }) => 
      ($isOpen ? "1" : "0")};
  
  visibility: ${({ $isOpen }) => 
      ($isOpen ? "visible" : "hidden")};
`;

const MenuContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
  padding: 100px 0 80px 0; 
  width: 100%;
`;