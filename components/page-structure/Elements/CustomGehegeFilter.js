import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { useTranslation } from "next-i18next";
import GehegeBadge from "./GehegeBadge";
import { getTranslatedName } from "../../ui/TranslationHelper";

export default function CustomGehegeFilter({ animals = [], selectedGehege, onSelect }) {
  const { t, i18n } = useTranslation(['animals', 'common']);

  // Diese beiden Zeilen MÜSSEN am Anfang der Komponente stehen:
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

  // Einzigartige Gehege aus den Tieren extrahieren
  const uniqueGehegeObjects = animals
    .map((a) => a.gehege)
    .filter((g, index, self) =>
      g && self.findIndex(t => t?.name === g.name) === index
    );

  return (
    <SelectWrapper ref={wrapperRef}>
      <SelectHeader onClick={() => setIsOpen(!isOpen)}>
        {selectedGehege === "Alle" ? (
          <span>{t('animals:filter.all_enclosures')}</span>
        ) : (
          <SelectedValue>
            <GehegeBadge
              type={selectedGehege}
              gehege={uniqueGehegeObjects.find(g => g.name === selectedGehege)}
            />
            <Label>
              {getTranslatedName(uniqueGehegeObjects.find(g => g.name === selectedGehege), i18n.language) || selectedGehege}
            </Label>
          </SelectedValue>
        )}
        <Chevron $isOpen={isOpen}>▼</Chevron>
      </SelectHeader>

      {/* Hier war der Fehler: isOpen muss innerhalb des Returns verfügbar sein */}
      {isOpen && (
        <OptionsList>
          <Option onClick={() => { onSelect("Alle"); setIsOpen(false); }}>
            {t('animals:filter.all_enclosures')}
          </Option>

          {uniqueGehegeObjects.map((g) => (
            <Option key={g.name} onClick={() => { onSelect(g.name); setIsOpen(false); }}>
              <GehegeBadge type={g.name} gehege={g} />
              <Label>{getTranslatedName(g, i18n.language)}</Label>
            </Option>
          ))}
        </OptionsList>
      )}
    </SelectWrapper>
  );
}

const SelectedValue = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Label = styled.span`
  font-weight: 600;
  color: var(--color-petrol);
`;

const Option = styled.div`
  padding: 8px 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #f8faf5;
    & > div { border-color: var(--color-zoo-orange); }
  }
`;

const SelectWrapper = styled.div`
  position: relative;
  min-width: 220px;
  font-family: var(--font-text);
`;

const SelectHeader = styled.div`
  padding: 12px 16px;
  border: 2px solid #e0e7d5;
  border-radius: 12px;
  background: var(--color-white);
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const OptionsList = styled.div`
  position: absolute;
  top: 110%;
  left: 0;
  right: 0;
  background: white;
  border: 2px solid #4ca64c;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  z-index: 100;
  max-height: 300px;
  overflow-y: auto;
`;

const Chevron = styled.span`
  font-size: 0.8rem;
  transition: transform 0.3s;
  transform: ${({ $isOpen }) => ($isOpen ? "rotate(180deg)" : "rotate(0)")};
  color: var(--color-green-lighter);
`;