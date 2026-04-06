"use client";

import React from "react";
import styled from "styled-components";

interface MobileListViewProps<T> {
  currentItems: T[];
  /** * Eine Funktion, die entscheidet, wie eine einzelne Karte aussieht.
   * Übergibt das Item und die Event-Handler (Navigation, Edit, Delete).
   */
  renderCard: (
    item: T,
    handlers: {
      onClick: () => void;
      onEdit: () => void;
      onDelete: () => void;
    }
  ) => React.ReactNode;
  onItemClick?: (id: string | number) => void;
  onEdit?: (id: string | number) => void;
  onDelete?: (id: string | number) => void;
}

/**
 * Container für die mobile Ansicht.
 * Nutzt Generics <T>, damit sie für jeden Datentyp (Tier, User, etc.) funktioniert.
 */
export default function MobileListView<T extends { id: string | number }>({
  currentItems,
  renderCard,
  onItemClick,
  onEdit,
  onDelete,
}: MobileListViewProps<T>) {
  return (
    <StyledMobileView>
      {currentItems.map((item) => (
        <React.Fragment key={item.id}>
          {renderCard(item, {
            onClick: () => onItemClick?.(item.id),
            onEdit: () => onEdit?.(item.id),
            onDelete: () => onDelete?.(item.id),
          })}
        </React.Fragment>
      ))}
    </StyledMobileView>
  );
}

const StyledMobileView = styled.div`
  /* Standardmäßig auf Desktop ausblenden */
  display: none;

  /* Sichtbar auf Mobilgeräten bis 768px */
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding: 10px;
    width: 100%;
  }
`;
