import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { IoChevronDown } from "react-icons/io5";
import { useRouter } from "next/router";

export default function LangSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  const router = useRouter();
  const { pathname, asPath, query, locale } = router;

  const handleLocaleChange = (newLocale) => {
    router.push({ pathname, query }, asPath, { locale: newLocale });
    setIsOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const flagMap = {
    de: "fi-de",
    en: "fi-gb",
    dk: "fi-dk",
    nl: "fi-nl",
    be: "fi-be"
  };

  return (
    <LangSwitcherContainer ref={wrapperRef}>
      <CurrentLanguage onClick={() => setIsOpen(!isOpen)} $isOpen={isOpen}>
        <span className={`fi ${flagMap[locale] || "fi-de"}`}></span>
        <StyledChevron $isOpen={isOpen} />
      </CurrentLanguage>

      <LangDropdown $show={isOpen}>
        <LangOption onClick={() => handleLocaleChange("de")}>
          <span className="fi fi-de"></span> DE
        </LangOption>
        <LangOption onClick={() => handleLocaleChange("dk")}>
          <span className="fi fi-dk"></span> DK
        </LangOption>
        <LangOption onClick={() => handleLocaleChange("en")}>
          <span className="fi fi-gb"></span> EN
        </LangOption>
        <LangOption onClick={() => handleLocaleChange("nl")}>
          <span className="fi fi-nl"></span> NL
        </LangOption>
        {/* Falls du BE (Belgien) wirklich als Sprache hast: */}
        <LangOption onClick={() => handleLocaleChange("be")}>
          <span className="fi fi-be"></span> BE
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

  background: ${({ $isOpen }) =>
    $isOpen ? "var(--color-grey-0-25)" : "var(--color-grey-0-1)"};
  border: 1px solid var(--color-grey-0-2);
  border-radius: var(--border-radius);
  transition: all 0.3s ease;

  &:hover {
    background: var(--color-grey-0-2);
  }
`;

const StyledChevron = styled(IoChevronDown)`
  width: 14px;
  height: 14px;
  transition: transform 0.3s ease;
  transform: ${({ $isOpen }) => 
      ($isOpen ? "rotate(180deg)" : "rotate(0deg)")};
`;

const LangDropdown = styled.div`
  position: absolute;
  top: 120%;
  right: 0;
  background: var(--color-white);
  border-radius: 10px;
  padding: 5px;
  box-shadow: var(--shadow-soft);
  min-width: 100px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  z-index: 3000;

  max-height: 130px;
  overflow-y: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  &::after {
    content: "";
    display: block;
    min-height: 15px; 
    width: 100%;
  }

  opacity: ${({ $show }) => ($show ? 1 : 0)};
  visibility: ${({ $show }) => ($show ? "visible" : "hidden")};
  transform: ${({ $show }) => ($show ? "translateY(0)" : "translateY(10px)")};
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
`;

const LangOption = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  color: var(--color-petrol);
  font-size: 0.9rem;
  font-weight: bold;
  border-radius: 5px;

  &:hover {
    background: var(--color-white);
    color: var(--color-green);
  }

  .fi {
    font-size: 1rem;
  }
`;