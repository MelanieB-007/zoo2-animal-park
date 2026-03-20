import React from "react";
import styled from "styled-components";
import { ChevronRight, ChevronLeft } from "lucide-react";

export default function OriginTransfer({ available, selected, onMoveRight, onMoveLeft }) {
  return (
    <TransferContainer>
      {/* Linke Seite: Verfügbar */}
      <Column>
        <ColumnTitle>Verfügbar</ColumnTitle>
        <List>
          {available.length > 0 ? (
            available.map((item) => (
              <Item key={item.id} onClick={() => onMoveRight(item)}>
                <span>{item.name}</span>
                <ChevronRight size={16} />
              </Item>
            ))
          ) : (
            <EmptyNote>Keine weiteren Quellen</EmptyNote>
          )}
        </List>
      </Column>

      {/* Rechte Seite: Ausgewählt */}
      <Column $highlight>
        <ColumnTitle>Ausgewählt</ColumnTitle>
        <List>
          {selected.length > 0 ? (
            selected.map((item) => (
              <Item key={item.id} onClick={() => onMoveLeft(item)} $selected>
                <ChevronLeft size={16} />
                <span>{item.name}</span>
              </Item>
            ))
          ) : (
            <EmptyNote>Bitte wählen...</EmptyNote>
          )}
        </List>
      </Column>
    </TransferContainer>
  );
}

// --- STYLED COMPONENTS ---

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

  &:hover {
    border-color: #88a04d;
    background: #f0f4e8;
    transform: translateX(${props => props.$selected ? "-3px" : "3px"});
  }

  span {
    flex: 1;
    margin: 0 8px;
  }

  svg {
    color: #88a04d;
  }
`;

const EmptyNote = styled.div`
  padding: 20px;
  text-align: center;
  color: #bbb;
  font-size: 0.85rem;
  font-style: italic;
`;