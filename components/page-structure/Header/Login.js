import {signIn, signOut, useSession} from "next-auth/react";
import styled from "styled-components";
import LangSwitcher from "./LangSwitcher";


export default function Login() {
    const { data: session } = useSession();

    return (
        <LoginWrapper>
            <TopRow>
                <LangSwitcher />
                {!session ? (
                    <HeaderButton onClick={() => signIn("github")}>Login</HeaderButton>
                ) : (
                    <UserImageWrapper onClick={() => signOut()} title="Abmelden">
                        <UserImage src={session.user.image} alt="Profil" />
                    </UserImageWrapper>
                )}
            </TopRow>

            {session && (
                <BottomRow>
                    <WelcomeText>Hej, {session.user.name.split(" ")[0]}!</WelcomeText>
                </BottomRow>
            )}
        </LoginWrapper>
    );
}

const TopRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px; /* Abstand zwischen Sprache und Login-Button */
`;

const BottomRow = styled.div`
  /* Die Begrüßung unter den Buttons */
  padding-right: 5px; 
`;

const LoginWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end; /* Richtet alles rechtsbündig aus */
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
  
  /* Dein Zoo-Theme-Look */
  background: var(--color-header-button-bg);
  border: var(--border-header-button);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-header-button);
  
  color: #68B300; /* Dein helles Grün */
  font-family: var(--font-text);
  font-weight: 800;
  font-size: 0.9rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  
  /* Der coole 3D-Text-Effekt */
  text-shadow:
    1px 1px 0 #0e7a4a,
    2px 2px 0 #056d42,
    3px 3px 0 #2f3542;
    
  transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-header-button-hover);
    background: var(--color-header-button-border-hover);
    filter: brightness(1.1);
  }

  &:active {
    transform: translateY(0);
    box-shadow: inset 2px 2px 5px rgba(0, 0, 0, 0.2);
  }
`;

const WelcomeText = styled.span`
  color: white;
  font-family: var(--font-text); /* Nutzt deine Standard-Schrift */
  font-size: 0.75rem; /* Etwas kleiner, da es eine Sub-Information ist */
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  
  /* Ein sanfter Schatten sorgt für Lesbarkeit auf dem Glas-Hintergrund */
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.4);
  
  /* Damit es nicht direkt an den Buttons klebt */
  margin-top: 2px;
  display: block;
  
  /* Ein dezenter Fade-In Effekt, wenn man sich einloggt */
  animation: fadeIn 0.5s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-5px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;