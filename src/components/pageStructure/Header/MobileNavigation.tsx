"use client";

import React, { useState } from "react";
import styled from "styled-components";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { IoChevronDown } from "react-icons/io5";
import { useSession } from "next-auth/react";

import Login from "./Login";
import { theme } from "@/styles/theme";

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

type SubMenuKey = "animals" | "contests" | null;

export const MobileNavigation = ({
  isOpen,
  onClose,
}: MobileNavigationProps) => {
  const t = useTranslations("common");
  const { data: session } = useSession();
  const [openSubMenu, setOpenSubMenu] = useState<SubMenuKey>(null);

  const toggleSubMenu = (menu: SubMenuKey) => {
    setOpenSubMenu(openSubMenu === menu ? null : menu);
  };

  return (
    <Overlay $isOpen={isOpen}>
      <MenuContent>
        {/* Home */}
        <MobileNavLink href="/" onClick={onClose}>
          {t("navigation.home")}
        </MobileNavLink>

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
          </SubMenu>
        </MobileMenuWrapper>

        {/* KLUB SECTION */}
        <MobileMenuWrapper>
          <MenuHeader onClick={() => toggleSubMenu("contests")}>
            {t("navigation.club")}
            <StyledChevron $isRotated={openSubMenu === "contests"} />
          </MenuHeader>

          <SubMenu $isOpen={openSubMenu === "contests"}>
            <SubNavLink href="/contests/statues" onClick={onClose}>
              {t("navigation.club_statues")}
            </SubNavLink>

            {session && (
              <>
                <SubNavLink href="/contests" onClick={onClose}>
                  {t("navigation.club_contests")}
                </SubNavLink>
                <SubNavLink href="/contests/create" onClick={onClose}>
                  {t("navigation.club_create_contest")}
                </SubNavLink>
              </>
            )}
          </SubMenu>
        </MobileMenuWrapper>

        <Divider />

        {/* Login am Ende der Liste */}
        <LoginContainer>
          <Login />
        </LoginContainer>
      </MenuContent>
    </Overlay>
  );
};

// --- Styles ---

const Overlay = styled.nav<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  /* Nutzt ein sehr dunkles Petrol für den Vollbild-Look */
  background-color: ${theme.colors.brand.petrolDark};
  z-index: 9999;

  display: flex;
  flex-direction: column;
  align-items: center;

  overflow-y: auto;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }

  /* Slide-Effekt von rechts nach links */
  transform: ${({ $isOpen }) =>
    $isOpen ? "translateX(0)" : "translateX(100%)"};
  transition: transform 0.4s cubic-bezier(0.77, 0, 0.175, 1);
  opacity: ${({ $isOpen }) => ($isOpen ? "1" : "0")};
  visibility: ${({ $isOpen }) => 
    ($isOpen ? "visible" : "hidden")};
`;

const MenuContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: center;
  padding: 100px 0 120px 0;
  width: 100%;
`;

const MobileMenuWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const MenuHeader = styled.div`
  font-size: 1.6rem;
  color: ${theme.colors.ui.surface};
  text-transform: uppercase;
  font-weight: 800;
  letter-spacing: 2px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
`;

const StyledChevron = styled(IoChevronDown)<{ $isRotated: boolean }>`
  transition: transform 0.3s ease;
  transform: ${({ $isRotated }) =>
    $isRotated ? "rotate(180deg)" : "rotate(0deg)"};
`;

const SubMenu = styled.div<{ $isOpen: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  /* Dynamische Höhe für die Animation */
  max-height: ${({ $isOpen }) => 
    ($isOpen ? "300px" : "0")};
  transition: all 0.3s ease-in-out;
  background: rgba(255, 255, 255, 0.03);
  width: 100%;
`;

const SubNavLink = styled(Link)`
  font-size: 1.2rem;
  color: ${theme.colors.brand.orange};
  text-decoration: none;
  padding: 12px 0;
  font-weight: 700;
  width: 100%;
  text-align: center;

  &:active {
    background: rgba(255, 255, 255, 0.1);
    color: ${theme.colors.ui.surface};
  }
`;

const MobileNavLink = styled(Link)`
  font-size: 1.6rem;
  color: ${theme.colors.ui.surface};
  text-decoration: none;
  text-transform: uppercase;
  font-weight: 800;
  letter-spacing: 2px;
  margin: 1rem 0;
`;

const LoginContainer = styled.div`
  width: 100%;
  margin-top: 1rem;
  padding: 2.5rem 1rem;
  display: flex;
  justify-content: center;
  background: rgba(0, 0, 0, 0.15);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
`;

const Divider = styled.div`
  width: 40px;
  height: 3px;
  background: ${theme.colors.brand.green};
  margin: 1rem 0;
  border-radius: 2px;
`;
