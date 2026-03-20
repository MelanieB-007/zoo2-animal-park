import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { useTranslation } from "next-i18next";

import StallLevelBadge from "../../ui/StallLevelBadge";

export default function CustomLevelFilter({ animals, selectedLevel, onSelect }) {
  const { t } =  /** @type {any} */(useTranslation('animals'));
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(function() {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return function() {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const uniqueLevels = [...new Set(animals.map(function(t) { return t.stalllevel; }))]
    .filter(function(lvl) { return lvl !== undefined && lvl !== null; })
    .sort(function(a, b) { return a - b; });

  function handleToggle() {
    setIsOpen(!isOpen);
  }

  return (
    <SelectWrapper ref={wrapperRef}>
      <SelectHeader onClick={handleToggle}>
        {selectedLevel === "Alle" ? (
          <span>{t('animals:filter.all_levels')}</span>
        ) : (
          <SelectedValue>
            <ScaledBadge>
              <StallLevelBadge
                level={selectedLevel}
                habitat="gras"
                showTooltip={false}
                size={60}
              />
            </ScaledBadge>
            <Label>{t('animals:filter.level_label')} {selectedLevel}</Label>
          </SelectedValue>
        )}
        <Chevron $isOpen={isOpen}>▼</Chevron>
      </SelectHeader>

      {isOpen && (
        <OptionsList>
          <Option onClick={function() { onSelect("Alle"); setIsOpen(false); }}>
            {t('animals:filter.all_levels')}
          </Option>
          {uniqueLevels.map(function(lvl) {
            return (
              <Option
                key={lvl}
                onClick={function() { onSelect(String(lvl)); setIsOpen(false); }}>
                <ScaledBadge>
                  <StallLevelBadge
                    level={lvl}
                    habitat="gras"
                    showTooltip={false}
                    size={60}
                  />
                </ScaledBadge>
                <Label>{t('animals:filter.level_label')} {lvl}</Label>
              </Option>
            );
          })}
        </OptionsList>
      )}
    </SelectWrapper>
  );
}


const SelectWrapper = styled.div`
  position: relative;
  min-width: 180px;
  font-family: var(--font-text);
`;

const SelectHeader = styled.div`
  padding: 0 16px;
  overflow: hidden;
  height: 48px;
  border: 2px solid #e0e7d5;
  border-radius: 12px;
  background: var(--color-white);
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ScaledBadge = styled.div`
  transform: scale(0.7);
  margin: -10px; 
`;

const OptionsList = styled.div`
  position: absolute;
  top: 110%;
  left: 0;
  right: 0;
  background: var(--color-white);
  border: 2px solid var(--color-green);
  border-radius: var(--border-radius-icon);
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  z-index: 100;
  max-height: 250px;
  overflow-y: auto;
`;

const Option = styled.div`
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 15px;
  cursor: pointer;
  &:hover { background: #f8faf5; }
`;

const SelectedValue = styled.div`
  display: flex;
  align-items: center;
`;

const Label = styled.span`
  font-weight: 600;
  color: var(--color-petrol);
  margin-left: 5px;
`;

const Chevron = styled.span`
  font-size: 0.8rem;
  transition: transform 0.3s;
  transform: ${function({ $isOpen }) {
    return $isOpen ? "rotate(180deg)" : "rotate(0)";
  }};
  color: var(--color-green);
`;