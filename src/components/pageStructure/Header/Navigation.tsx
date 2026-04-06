"use client";

import React from "react";
import styled, { css } from "styled-components";
import Link from "next/link";
import { IoChevronDown } from "react-icons/io5";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { theme } from "@/styles/theme";

/**
 * Die Hauptnavigation für Desktop-Geräte.
 * Beinhaltet Dropdowns und aktive Status-Anzeigen mit Pfoten-Icons.
 */
export default function Navigation() {
  const pathname = usePathname();
  const t = useTranslations("common");
  const { data: session } = useSession();

  // Prüft, ob ein Pfad aktiv ist (auch für Unterseiten)
  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(path + "/");

  return (
    <NavContainer>
      <NavList>
        {/* Home */}
        <NavItem>
          <NavLink href="/" $active={pathname === "/"}>
            {t("navigation.home")}
          </NavLink>
        </NavItem>

        {/* Tiere Dropdown */}
        <NavItem>
          <NavButton $active={isActive("/animals")}>
            {t("navigation.animals")} <IoChevronDown className="arrow" />
          </NavButton>
          <Dropdown>
            <li>
              <DropdownLink href="/animals" $active={pathname === "/animals"}>
                {t("navigation.animal_overview")}
              </DropdownLink>
            </li>
            {session && (
              <li>
                <DropdownLink
                  href="/animals/create"
                  $active={pathname === "/animals/create"}
                >
                  {t("navigation.animal_create")}
                </DropdownLink>
              </li>
            )}
          </Dropdown>
        </NavItem>

        {/* Klub Dropdown */}
        <NavItem>
          <NavButton $active={isActive("/contests")}>
            {t("navigation.club")} <IoChevronDown className="arrow" />
          </NavButton>
          <Dropdown>
            <li>
              <DropdownLink
                href="/contests/statues"
                $active={isActive("/contests/statues")}
              >
                {t("navigation.club_statues")}
              </DropdownLink>
            </li>
            {session && (
              <>
                <li>
                  <DropdownLink
                    href="/contests"
                    $active={pathname === "/contests"}
                  >
                    {t("navigation.club_contests")}
                  </DropdownLink>
                </li>
                <li>
                  <DropdownLink
                    href="/contests/create"
                    $active={pathname === "/contests/create"}
                  >
                    {t("navigation.club_create_contest")}
                  </DropdownLink>
                </li>
              </>
            )}
          </Dropdown>
        </NavItem>
      </NavList>
    </NavContainer>
  );
}

// --- Styles ---

const NavContainer = styled.nav`
  display: flex;
  align-items: center;
  @media (max-width: 767px) {
    display: none;
  }
`;

const NavList = styled.ul`
  display: flex;
  list-style: none;
  gap: 1.2rem;
  margin: 0;
  padding: 0;
`;

const NavItem = styled.li`
  position: relative;
  &:hover > ul {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
  &:hover .arrow {
    transform: rotate(180deg);
  }
`;

/** Gemeinsame Styles für Links und Buttons in der Nav */
const NavElementStyles = css<{ $active?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 40px;
  padding: 0 1.2rem;

  background: ${theme.colors.ui.surface}15; /* Subtile Transparenz */
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;

  color: ${({ $active }) =>
    $active ? theme.colors.brand.orange : theme.colors.brand.green};
  font-weight: 800;
  text-decoration: none;
  white-space: nowrap;
  transition: all 0.25s ease;

  &:hover {
    transform: translateY(-2px);
    background: ${theme.colors.brand.greenLight}20;
    color: ${theme.colors.brand.green};
  }

  &::before {
    content: "🐾";
    position: absolute;
    top: -18px;
    left: 50%;
    transform: translateX(-50%);
    display: ${({ $active }) => ($active ? "block" : "none")};
    font-size: 0.9rem;
    filter: drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.5));
  }
`;

const NavLink = styled(Link)<{ $active?: boolean }>`
  ${NavElementStyles}
`;
const NavButton = styled.div<{ $active?: boolean }>`
  ${NavElementStyles}
  cursor: pointer;
`;

const Dropdown = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 200px;
  background: ${theme.colors.ui.surface};
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  list-style: none;
  padding: 0.6rem 0;
  margin-top: 10px;
  z-index: 2002;
  opacity: 0;
  visibility: hidden;
  transform: translateY(10px);
  transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);

  &::after {
    /* Kleiner Pfeil nach oben zum Button */
    content: "";
    position: absolute;
    top: -6px;
    left: 20px;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 6px solid ${theme.colors.ui.surface};
  }
`;

const DropdownLink = styled(Link)<{ $active?: boolean }>`
  display: block;
  padding: 10px 18px;
  color: ${theme.colors.brand.petrol};
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: ${({ $active }) => ($active ? "700" : "500")};
  border-left: 4px solid
    ${({ $active }) =>
      $active ? theme.colors.brand.green : "transparent"};
  transition: all 0.2s ease;

  &:hover {
    background: ${theme.colors.brand.greenLight}15;
    color: ${theme.colors.brand.green};
    padding-left: 22px;
  }
`;
