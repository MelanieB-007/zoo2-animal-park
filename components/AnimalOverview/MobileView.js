import React from "react";
import styled from "styled-components";

import AnimalMobileCard from "./AnimalMobileCard";

export default function MobileView({
  currentItems,
  handleAnimalClick,
  handleEdit,
  handleDelete,
}) {
  return (
    <StyledMobileView>
      {currentItems.map(function (animal) {
        return (
          <AnimalMobileCard
            key={animal.id}
            animal={animal}
            onClick={function() {
              handleAnimalClick(animal.id);
            }}
            onEdit={function() {
              handleEdit(animal.id);
            }}
            onDelete={function() {
              handleDelete(animal.id);
            }}
          />
        );
      })}
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