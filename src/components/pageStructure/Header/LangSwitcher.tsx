"use client";

import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { IoChevronDown } from "react-icons/io5";
import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { flagMap } from "@/constants/FlagMap";
import { theme } from "@/styles/theme";

// Importiere deine externe FlagMap


export default function LangSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLocaleChange = (newLocale: string) => {
    // Ersetzt den aktuellen Sprach-Präfix im Pfad (z.B. /de/... -> /en/...)
    const segments = (pathname ?? "").split("/");
    segments[1] = newLocale;
    const newPath = segments.join("/");

    router.push(newPath);
    setIsOpen(false);
  };

  return (
    <LangSwitcherContainer ref={wrapperRef}>
      <CurrentLanguage onClick={() => setIsOpen(!isOpen)} $isOpen={isOpen}>
        {/* Nutzt die Klasse aus deiner FlagMap */}
        <span className={`fi ${flagMap[locale] || "fi-de"}`}></span>
        <StyledChevron $isOpen={isOpen} />
      </CurrentLanguage>

      <LangDropdown $show={isOpen}>
        {Object.keys(flagMap).map((langCode) => (
          <LangOption
            key={langCode}
            onClick={() => handleLocaleChange(langCode)}
          >
            <span className={`fi ${flagMap[langCode]}`}></span>
            {langCode.toUpperCase()}
          </LangOption>
        ))}
      </LangDropdown>
    </LangSwitcherContainer>
  );
}

// --- Styles ---

const LangSwitcherContainer = styled.div`
  position: relative;
  z-index: 3100;
`;

const CurrentLanguage = styled.div<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 0.5rem 1rem;
  cursor: pointer;

  background: ${({ $isOpen }) =>
    $isOpen ? "rgba(255, 255, 255, 0.2)" : "rgba(255, 255, 255, 0.1)"};
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: ${theme.colors.brand.green};
  }

  .fi {
    border-radius: 2px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  }
`;

const StyledChevron = styled(IoChevronDown)<{ $isOpen: boolean }>`
  width: 14px;
  height: 14px;
  color: white;
  transition: transform 0.3s ease;
  transform: ${({ $isOpen }) => ($isOpen ? "rotate(180deg)" : "rotate(0deg)")};
`;

const LangDropdown = styled.div<{ $show: boolean }>`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;

  background: ${theme.colors.ui.surface};
  border-radius: 12px;
  padding: 6px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
  min-width: 120px;

  display: flex;
  flex-direction: column;
  gap: 4px;

  opacity: ${({ $show }) => ($show ? 1 : 0)};
  visibility: ${({ $show }) => ($show ? "visible" : "hidden")};
  transform: ${({ $show }) => ($show ? "translateY(0)" : "translateY(8px)")};
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.1);
`;

const LangOption = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  color: ${theme.colors.brand.petrol};
  font-size: 0.9rem;
  font-weight: 800;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${theme.colors.brand.greenLight}20;
    color: ${theme.colors.brand.green};
  }

  .fi {
    font-size: 1.1rem;
    border-radius: 2px;
  }
`;
