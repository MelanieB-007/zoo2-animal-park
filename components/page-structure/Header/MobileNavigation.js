import { useState } from "react";
import styled from "styled-components";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { IoChevronDown } from "react-icons/io5";

import Login from "./Login";
import { useSession } from "next-auth/react";

export const MobileNavigation = ({ isOpen, onClose }) => {
  const { t } = /** @type {any} */ (useTranslation("common"));
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const { data: session } = useSession();

  const toggleSubMenu = (menu) => {
    setOpenSubMenu(openSubMenu === menu ? null : menu);
  };

  return (
    <Overlay $isOpen={isOpen}>
      <MenuContent>
        {/* Home */}
        <MobileNavLink href="/" onClick={onClose}>
         Home
        </MobileNavLink>

        {/* ZOO SECTION */}
       {/* <MobileMenuWrapper>
          <MenuHeader onClick={() => toggleSubMenu("zoo")}>
            {t("navigation.zoo")}
            <StyledChevron $isRotated={openSubMenu === "zoo"} />
          </MenuHeader>
          <SubMenu $isOpen={openSubMenu === "zoo"}>
            <SubNavLink href="/zoo/areas" onClick={onClose}>
              {t("navigation.zoo_areas")}
            </SubNavLink>
            <SubNavLink href="/zoo/biomes" onClick={onClose}>
              {t("navigation.zoo_enclosures")}
            </SubNavLink>
          </SubMenu>
        </MobileMenuWrapper>*/}

        {/* TIERE SECTION */}
        <MobileMenuWrapper>
          <MenuHeader onClick={() => toggleSubMenu("animals")}>
            {t("navigation.animals")}
            <StyledChevron $isRotated={openSubMenu === "animals"} />
          </MenuHeader>
          <SubMenu $isOpen={openSubMenu === "animals"}>
            <SubNavLink href="/animals" onClick={onClose}>
              {t("navigation.animal_overview")}
            </SubNavLink>

            {session && (
            <SubNavLink href="/animals/create" onClick={onClose}>
              {t("navigation.animal_create")}
            </SubNavLink>
            )}

            {/*<SubNavLink href="/animals/varianten" onClick={onClose}>
              {t("navigation.animal_variants")}
            </SubNavLink>*/}
          </SubMenu>
        </MobileMenuWrapper>

        {/* KLUB */}
        <MobileMenuWrapper>
          <MenuHeader onClick={() => toggleSubMenu("contests")}>
            {t("navigation.club", "Klub")}
            <StyledChevron $isRotated={openSubMenu === "contests"} />
          </MenuHeader>

          <SubMenu $isOpen={openSubMenu === "contests"}>
            {/* 1. Statuen */}
            <SubNavLink href="/contests/statues" onClick={onClose}>
              {t("navigation.club_statues", "Statuen")}
            </SubNavLink>

            {/* 2. Wettbewerbe Übersicht */}
            {session && (
            <SubNavLink href="/contests" onClick={onClose}>
              {t("navigation.club_contests", "Wettbewerbe")}
            </SubNavLink>
            )}

            {/* 3. Wettbewerb anlegen (Nur wenn eingeloggt) */}
            {session && (
              <SubNavLink href="/contests/create" onClick={onClose}>
                {t("navigation.club_create_contest", "Wettbewerb anlegen")}
              </SubNavLink>
            )}
          </SubMenu>
        </MobileMenuWrapper>

        <Divider />

        <LoginContainer>
          <Login />
        </LoginContainer>
      </MenuContent>
    </Overlay>
  );
};

const MobileMenuWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const MenuHeader = styled.div`
  font-family: var(--font-headline);
  font-size: 1.6rem;
  color: white;
  text-transform: uppercase;
  letter-spacing: 2px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 0.5rem;
`;

const StyledChevron = styled(IoChevronDown)`
  transition: transform 0.3s ease;
  transform: ${({ $isRotated }) => 
          ($isRotated ? "rotate(180deg)" : "rotate(0deg)")};
`;

const SubMenu = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  max-height: ${({ $isOpen }) => ($isOpen ? "200px" : "0")};
  transition: max-height 0.3s ease-in-out;
  background: rgba(255, 255, 255, 0.05);
  width: 100%;
  padding: ${({ $isOpen }) => ($isOpen ? "10px 0" : "0")};
`;

const SubNavLink = styled(Link)`
  font-family: var(--font-text);
  font-size: 1.1rem;
  color: var(--color-zoo-orange);
  text-decoration: none;
  padding: 10px 0;
  font-weight: bold;
  
  &:active {
    color: var(--color-white);
  }
`;

const MobileNavLink = styled(Link)`
  font-family: var(--font-headline);
  font-size: 1.6rem;
  color: var(--color-white);
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin: 1rem 0;
`;

const LoginContainer = styled.div`
  width: 100%;
  margin-top: 2rem;
  padding: 2rem 1rem;
  display: flex;
  justify-content: center;
  
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.2); 
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
  padding: 100px 0 120px 0; 
  width: 100%;
`;