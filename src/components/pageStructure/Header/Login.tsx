"use client";

import React, { useState, useEffect, useRef } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import styled, { keyframes } from "styled-components";
import { useTranslations } from "next-intl";
import Image from "next/image";

import LangSwitcher from "./LangSwitcher";
import RoleBadge from "../ui/RoleBadge";
import { theme } from "@/styles/theme";

/**
 * Login-Komponente für den Header.
 * Beinhaltet Sprachauswahl, Profil-Avatar und Rollen-Anzeige.
 */
export default function Login() {
  const { data: session } = useSession();
  const user = session?.user;
  // @ts-ignore - Falls role nicht im Standard-Typ von NextAuth ist
  const userRole = user?.role || null;

  const t = useTranslations("common");
  const [showLogout, setShowLogout] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close Logout-Badge bei Klick außerhalb
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowLogout(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <LoginWrapper ref={wrapperRef}>
      <TopRow>
        <LangSwitcher />

        {session ? (
          <AvatarContainer>
            <UserWrapper onClick={() => setShowLogout(!showLogout)}>
              {session.user?.image && (
                <UserImage
                  src={session.user.image}
                  alt="Profil"
                  width={60}
                  height={60}
                />
              )}
              {!showLogout && (
                <AvatarTooltip className="avatar-tooltip">
                  {t("login.open_menu")} 🐾
                </AvatarTooltip>
              )}
            </UserWrapper>

            {showLogout && (
              <LogoutBadge onClick={() => signOut({ callbackUrl: "/" })}>
                {t("login.logout")} 👋
              </LogoutBadge>
            )}
          </AvatarContainer>
        ) : (
          <HeaderButton onClick={() => signIn("discord")}>
            {t("login.login_button")}
          </HeaderButton>
        )}
      </TopRow>

      {session && (
        <BottomRow>
          <FlexContainer>
            <RoleBadge role={userRole} />
            <WelcomeText>
              {t("login.welcome")}, {session.user?.name?.split(" ")[0]}!
            </WelcomeText>
          </FlexContainer>
        </BottomRow>
      )}
    </LoginWrapper>
  );
}

// --- Styles ---

const popIn = keyframes`
  from { opacity: 0; transform: scale(0.8) translateY(-10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
`;

const LoginWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;

  @media (max-width: 768px) {
    align-items: center;
    gap: 12px;
  }
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const BottomRow = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const AvatarContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const UserImage = styled(Image)`
  border-radius: 50%;
  border: 3px solid ${theme.colors.ui.surface};
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  object-fit: cover;
  cursor: pointer;
`;

const AvatarTooltip = styled.span`
  position: absolute;
  top: 115%;
  left: 50%;
  transform: translateX(-50%) translateY(-5px);

  background: ${theme.colors.brand.orange};
  color: ${theme.colors.brand.green};
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  white-space: nowrap;

  box-shadow: 3px 3px 0 rgba(0, 0, 0, 0.2);
  border: 2px solid white;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
  z-index: 1000;
`;

const UserWrapper = styled.div`
  position: relative;
  display: flex;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
    ${AvatarTooltip} {
      opacity: 1;
      visibility: visible;
      transform: translateX(-50%) translateY(0);
    }
  }
`;

const LogoutBadge = styled.div`
  position: absolute;
  top: 70px;
  right: 0;
  background: ${theme.colors.brand.orange};
  color: ${theme.colors.brand.green};
  padding: 6px 12px;
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 800;
  white-space: nowrap;
  cursor: pointer;
  text-transform: uppercase;
  z-index: 1001;
  border: 2px solid white;

  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  animation: ${popIn} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);

  &:hover {
    background: white;
    color: ${theme.colors.brand.orange};
  }
`;

const HeaderButton = styled.button`
  padding: 0.6rem 1.2rem;
  cursor: pointer;
  background: ${theme.colors.brand.orange};
  border: none;
  border-radius: 12px;
  color: ${theme.colors.brand.green};
  font-weight: 800;
  font-size: 0.9rem;
  text-transform: uppercase;
  box-shadow: 0 4px 0 ${theme.colors.brand.petrolDark};
  transition: all 0.1s ease;

  &:hover {
    transform: translateY(2px);
    box-shadow: 0 2px 0 ${theme.colors.brand.petrolDark};
  }

  &:active {
    transform: translateY(4px);
    box-shadow: none;
  }
`;

const FlexContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const WelcomeText = styled.span`
  color: white;
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;
