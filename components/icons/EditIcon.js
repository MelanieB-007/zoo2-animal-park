import React from "react";
import styled from "styled-components";

export default function EditButton(){
  return (
    <StyledButton  title="Bearbeiten">✏️</StyledButton>
  );
}

const StyledButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  color: #3b82f6;
  transition: transform 0.1s;
  &:hover { transform: scale(1.2); }
`;