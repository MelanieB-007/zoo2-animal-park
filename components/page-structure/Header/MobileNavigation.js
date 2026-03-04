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
  font-size: 2rem;
  color: white;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 2px 2px 0 var(--color-petrol);
  transition: all 0.2s ease;

  &:hover,
  &:active {
    color: var(--color-green);
    transform: scale(1.1);
  }
`;

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;

  & > div {
    align-items: center;
    text-align: center;
  }

  button {
    padding: 1rem 2rem;
    font-size: 1.1rem;
    min-width: 150px;
  }
`;

const Divider = styled.div`
  width: 100px;
  height: 3px;
  background: var(--glass-border);
  border-radius: 2px;
  margin: 10px 0;
`;

const Overlay = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: var(--color-zoo-orange);
  z-index: 5000;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  
  transform: ${({ $isOpen }) =>
    $isOpen ? "translateX(0)" : "translateX(100%)"};
  transition: transform 0.4s cubic-bezier(0.77, 0, 0.175, 1);

  /* Verhindert, dass man durch das Menü hindurchklicken kann */
  pointer-events: ${({ $isOpen }) => ($isOpen ? "all" : "none")};
`;

const MenuContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
`;