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
              signIn("github")}>Login</HeaderButton>
        ) : (
          <UserImageWrapper onClick={() =>
              signOut()} title="Abmelden">
            <UserImage src={session.user.image} alt="Profil" />
          </UserImageWrapper>
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

const UserImageWrapper = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const UserImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid var(--color-green);
  box-shadow: var(--shadow-soft);
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
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;

  text-shadow: 1px 1px 3px var(--color-black);

  margin-top: 2px;
  display: block;

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