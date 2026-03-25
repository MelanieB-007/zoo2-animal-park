import React from "react";
import styled from "styled-components";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useTranslation } from "next-i18next";

export default function OriginTransfer({
                                         available,
                                         selected,
                                         onMoveRight,
                                         onMoveLeft,
                                         maxSelected = null // Standardmäßig kein Limit
                                       }) {
  const { t } = /** @type {any} */ (useTranslation(["animals", "common"]));

  // Nur sperren, wenn ein Limit gesetzt UND erreicht ist
  const isFull = maxSelected !== null && selected.length >= maxSelected;

  return (
    <TransferContainer>
      <Column>
        <ColumnTitle>{t("common:available")}</ColumnTitle>
        <List>
          {available.map((item, index) => (
            <Item
              key={item.id || `avail-${index}`}
              onClick={() => onMoveRight(item)}
              $disabled={isFull} // Greift nur, wenn maxSelected gesetzt ist
            >
              <span>{item.name}</span>
              <ChevronRight size={16} />
            </Item>
          ))}
        </List>
      </Column>

      <Column $highlight>
        <ColumnTitle>{t("common:chosen")}</ColumnTitle>
        <List>
          {selected.map((item, index) => (
            <Item key={item.id || `sel-${index}`} onClick={() => onMoveLeft(item)} $selected>
              <ChevronLeft size={16} />
              <span>{item.name}</span>
            </Item>
          ))}
        </List>
      </Column>
    </TransferContainer>
  );
}


const Item = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  margin: 4px;
  border-radius: 8px;
  background: white;
  border: 1px solid #eef3e2;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;

  /* 3. Logik für das Ausgrauen */
  ${props => props.$disabled && !props.$selected && `
    opacity: 0.4;
    filter: grayscale(1);
    cursor: not-allowed;
    background: #fdfdfd;
    pointer-events: none; /* Verhindert das Klicken komplett */
  `}

  &:hover {
    /* Hover-Effekt nur erlauben, wenn nicht disabled oder wenn es ein ausgewähltes Item ist */
    border-color: ${props => (props.$disabled && !props.$selected) ? "#eef3e2" : "#88a04d"};
    background: ${props => (props.$disabled && !props.$selected) ? "white" : "#f0f4e8"};
    transform: translateX(${props => {
  if (props.$disabled && !props.$selected) return "0";
  return props.$selected ? "-3px" : "3px";
}});
  }

  /* ... restliche Styles (span, svg) ... */
`;

const TransferContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 10px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  background: ${props => props.$highlight ? "#f9fbf5" : "#fff"};
  border: 2px solid ${props => props.$highlight ? "#d1e2a5" : "#eee"};
  border-radius: 12px;
  overflow: hidden;
`;

const ColumnTitle = styled.div`
  background: #f4f7ed;
  padding: 8px 12px;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  color: #5d7a2a;
  border-bottom: 1px solid #eee;
  text-align: center;
`;

const List = styled.div`
  height: 200px;
  overflow-y: auto;
  padding: 5px;

  /* Custom Scrollbar für den Look */
  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-thumb { background: #d1e2a5; border-radius: 10px; }
`;

const EmptyNote = styled.div`
  padding: 20px;
  text-align: center;
  color: #bbb;
  font-size: 0.85rem;
  font-style: italic;
`;