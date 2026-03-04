import styled from "styled-components";
import {IoChevronDown} from "react-icons/io5";
import {useEffect, useRef, useState} from "react";

export default function LangSwitcher() {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <LangSwitcherContainer ref={wrapperRef}>
            <CurrentLanguage onClick={() => setIsOpen(!isOpen)} $isOpen={isOpen}>
                <span className="fi fi-de"></span>
                <StyledChevron $isOpen={isOpen} />
            </CurrentLanguage>

            <LangDropdown $show={isOpen}>
                <LangOption onClick={() => setIsOpen(false)}>
                    <span className="fi fi-de"></span> DE
                </LangOption>
                <LangOption onClick={() => setIsOpen(false)}>
                    <span className="fi fi-dk"></span> DK
                </LangOption>
                <LangOption onClick={() => setIsOpen(false)}>
                    <span className="fi fi-gb"></span> EN
                </LangOption>
            </LangDropdown>
        </LangSwitcherContainer>
    );
}


const LangSwitcherContainer = styled.div`
  position: relative;
  cursor: pointer;
`;

const CurrentLanguage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0.6rem 1.2rem;
  background: ${({ $isOpen }) => ($isOpen ? "rgba(255, 255, 255, 0.25)" : "rgba(255, 255, 255, 0.1)")};
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--border-radius);
  transition: all 0.3s ease;

  &:active {
    transform: scale(0.98); /* Kleiner Klick-Effekt */
  }
`;

const StyledChevron = styled(IoChevronDown)`
  width: 14px;
  height: 14px;
  transition: transform 0.3s ease;
  /* Dreht den Pfeil nach oben, wenn offen */
  transform: ${({ $isOpen }) => ($isOpen ? "rotate(180deg)" : "rotate(0deg)")};
`;

const LangDropdown = styled.div`
  position: absolute;
  top: 120%; /* Etwas mehr Abstand */
  right: 0;
  background: white;
  border-radius: 10px;
  padding: 5px;
  box-shadow: var(--shadow-soft);
  min-width: 100px; /* Etwas breiter für bessere Klickbarkeit */
  display: flex;
  flex-direction: column;
  gap: 5px;
  z-index: 3000;

  /* Sichtbarkeit basierend auf State */
  opacity: ${({ $show }) => ($show ? 1 : 0)};
  visibility: ${({ $show }) => ($show ? "visible" : "hidden")};
  transform: ${({ $show }) => ($show ? "translateY(0)" : "translateY(10px)")};
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
`;

const LangOption = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px; /* Mehr Platz für Finger auf Mobile */
  color: var(--color-petrol);
  font-size: 0.9rem;
  font-weight: bold;
  border-radius: 5px;
  transition: background 0.2s;

  &:hover {
    background: #f0f0f0;
    color: var(--color-green);
  }
`;