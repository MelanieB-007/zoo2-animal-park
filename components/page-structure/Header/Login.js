import { signIn, signOut, useSession } from "next-auth/react";
import styled from "styled-components";

import LangSwitcher from "./LangSwitcher";

export default function Login() {
  const { data: session } = useSession();

  return (
    <LoginWrapper>
      <TopRow>
        <LangSwitcher />
        {!session ? (
          <HeaderButton onClick={() =>
              signIn("discord")}>Login</HeaderButton>
        ) : (
          <UserWrapper onClick={() =>
              signOut()} title="Abmelden">
            <UserImage src={session.user.image} alt="Profil" />
          </UserWrapper>
        )}
      </TopRow>

      {session && (
        <BottomRow>
          <WelcomeText>
              Hej, {session.user.name.split(" ")[0]}!
          </WelcomeText>
        </BottomRow>
      )}
    </LoginWrapper>
  );
}

const TopRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
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

const UserWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const UserImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 3px solid white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
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
    box-shadow: inset 2px 2px 5px var( --color-black);
  }
`;

const WelcomeText = styled.span`
  color: var(--color-white);
  font-family: var(--font-text);
  font-size: 1.1rem;
  font-weight: 800;
  letter-spacing: 1px;
  text-transform: uppercase;
  text-align: center;

  text-shadow: 0 2px 4px var(--color-black);
  margin-bottom: 10px;
  margin-top: 20px;
  display: block;

  span {
    color: var(--color-green); /* Falls du eine Akzentfarbe hast */
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