import React from "react";
import styled from "styled-components";

export default function DeleteButton(){
  return (
    <StyledButton title="Delete">🗑️</StyledButton>
  );
}


const StyledButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  color: #ef4444;
  transition: transform 0.1s;
  &:hover { transform: scale(1.2); }
`;