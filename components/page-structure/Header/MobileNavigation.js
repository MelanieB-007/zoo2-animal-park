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
  font-size: 1.6rem; /* Angenehme Größe */
  color: white;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 2px;
  /* Kleiner Schatten-Trick für Tiefe */
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  margin-bottom: 1.5rem;
  transition: color 0.3s ease;

  &:active {
    color: var(--zoo-orange); /* Beim Klicken leuchtet es kurz orange auf */
  }
`;

const LoginContainer = styled.div`
  width: 100%;
  margin-top: 15px;
  display: flex;
  justify-content: center;

  /* Wir zielen auf den Wrapper innerhalb der Login-Komponente */
  & > div {
    flex-direction: row !important; /* Nebeneinander */
    align-items: center !important; /* Gleiche Mittellinie */
    gap: 15px !important;
  }
`;

const Divider = styled.div`
  width: 60px;
  height: 2px;
  background: rgba(255, 255, 255, 0.2);
  margin: 1.5rem 0;
`;

const Overlay = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;

  /* Ein schönes, tiefes Petrol (passend zu deinem Text-Schatten) */
  background-color: #004d4d;
  /* Alternativ: background: linear-gradient(135deg, #004d4d 0%, #002e2e 100%); */

  z-index: 9999;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  transform: ${({ $isOpen }) => ($isOpen ? "translateX(0)" : "translateX(100%)")};
  transition: transform 0.4s cubic-bezier(0.77, 0, 0.175, 1);

  /* Damit es wirklich blickdicht ist */
  opacity: ${({ $isOpen }) => ($isOpen ? "1" : "0")};
  visibility: ${({ $isOpen }) => ($isOpen ? "visible" : "hidden")};
`;

const MenuContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
`;