import { signIn, signOut, useSession } from "next-auth/react";
import styled, { keyframes } from "styled-components";

import LangSwitcher from "./LangSwitcher";
import { useEffect, useRef, useState } from "react";
import RoleBadge from "./RoleBadge";

export default function Login() {
  const { data: session } = useSession();
  const [showLogout, setShowLogout] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowLogout(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <LoginWrapper>
      <TopRow>
        <LangSwitcher />
        {!session ? (
          <HeaderButton onClick={() => signIn("discord")}>
            Login
          </HeaderButton>
        ) : (
            <AvatarContainer>
              <UserWrapper
                  onClick={() => setShowLogout(!showLogout)}
              >
                <UserImage src={session.user.image} alt="Profil" />

                {!showLogout && (
                    <AvatarTooltip>
                      Menü öffnen 🐾
                    </AvatarTooltip>
                )}
              </UserWrapper>

              {showLogout && (
                  <LogoutBadge onClick={() => signOut()}>
                    Abmelden 👋
                  </LogoutBadge>
              )}
            </AvatarContainer>
        )}
      </TopRow>

      {session && (
        <BottomRow>
          <FlexContainer>
            <RoleBadge role={session.user.role} />

            <WelcomeText>
              Hej, {session.user.name.split(" ")[0]}!
            </WelcomeText>
          </FlexContainer>
        </BottomRow>
      )}
    </LoginWrapper>
  );
}

const popIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.8) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
`;

const LogoutBadge = styled.div`
  position: absolute;
  top: 60px;
  right: -25px;
  background: var(--color-zoo-orange);
  color: var(--color-green);
  border: var(--border-header-button);
  padding: 4px 10px;
  border-radius: var(--border-radius);
  font-family: var(--font-text);
  font-size: 0.7rem;
  font-weight: 800;
  white-space: nowrap;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  z-index: 100;

  text-shadow:
    1px 1px 0 var(--color-petrol),
    2px 2px 0 var(--color-petrol-dark);

  box-shadow: var(--shadow-header-button);

  animation: ${popIn} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transition: all 0.2s ease;

  &:hover {
    background: var(--color-orange-light);
    transform: translateY(-2px) scale(1.05);
    box-shadow: var(--shadow-header-button-hover);
    filter: brightness(1.1);
  }

  &:active {
    transform: translateY(0);
    box-shadow: inset 2px 2px 5px var(--color-black);
  }
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
`;

const BottomRow = styled.div`
  padding-right: 5px;
`;

const LoginWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
`;

const AvatarTooltip = styled.span`
  position: absolute;
  top: 110%; 
  left: 50%;
  transform: translateX(-50%) translateY(-10px);
  
  background: var(--color-zoo-orange); 
  color: var(--color-green);
  padding: 5px 12px;
  border-radius: var(--border-radius);
  font-family: var(--font-text);
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  white-space: nowrap;
  
  box-shadow: 3px 3px 0 var(--color-black);
  border: 2px solid var(--color-white);

  opacity: 0;
  visibility: hidden;
  transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  pointer-events: none;
  z-index: 1000;

  &::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: var(--color-white) transparent transparent transparent;
  }
`;


const UserWrapper = styled.div`
  position: relative; 
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-2px);

    ${AvatarTooltip} {
      opacity: 1;
      visibility: visible;
      transform: translateX(-50%) translateY(0);
    }
  }
`;

const UserImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 3px solid var(--color-white);
  box-shadow: 0 4px 10px var(--color-black);
  object-fit: cover;
`;

const HeaderButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.6rem 1.2rem;
  cursor: pointer;

  background: var(--color-zoo-orange);
  border: var(--border-header-button);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-header-button);

  color: var(--color-green);
  font-family: var(--font-text);
  font-weight: 800;
  font-size: 0.9rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;

  text-shadow:
    1px 1px 0 var(--color-petrol),
    2px 2px 0 var(--color-petrol-dark),
    3px 3px 0 var(--color-grey-dark);

  transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-header-button-hover);
    background: var(--color-orange-light);
    filter: brightness(1.1);
  }

  &:active {
    transform: translateY(0);
    box-shadow: inset 2px 2px 5px var(--color-black);
  }
`;

const FlexContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end; 
  gap: 15px; 
  margin-top: 10px;
  width: 100%; 
  white-space: nowrap; 
  padding-right: 10px; 
`;

const WelcomeText = styled.span`
  color: var(--color-white);
  font-family: var(--font-text);
  font-size: 1.1rem;
  font-weight: 800;
  letter-spacing: 1px;
  text-transform: uppercase;
  text-shadow: 0 2px 4px var(--color-black);

  margin: 0; 
  display: inline-block;
  
  span {
    color: var(--color-green);
    filter: brightness(1.2);
  }

  animation: fadeIn 0.5s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-5px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const AvatarContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;