import React from "react";
import styled from "styled-components";


export default function MobileListView({
  currentItems,
  renderCard,
  onItemClick,
  onEdit,
  onDelete,
}) {
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
  display: none;
  @media (max-width: 768px) {
    display: block;
    padding: 0 10px;
  }
`;
