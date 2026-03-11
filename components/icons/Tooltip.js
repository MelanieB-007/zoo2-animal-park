import React from "react";
import styled from "styled-components";

export default function Tooltip({
  text,
  children,
  align = "center",
  position = "top",
}) {
  if (!text) return children;

  return (
    <TooltipContainer
      $text={text}
      $align={align}
      $position={position}
    >
      {children}
    </TooltipContainer>
  );
}


const TooltipContainer = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;

  &::after {
    content: "${(props) => props.$text}";
    position: absolute;
    z-index: 9999; 
    
    ${(props) =>
      props.$position === "bottom"
        ? "top: 140%; bottom: auto;"
        : "bottom: 140%; top: auto;"}

    ${(props) => {
      if (props.$align === "left")
        return "right: 0; left: auto; transform: none;";
      
      if (props.$align === "right")
        return "left: 0; right: auto; transform: none;";
      
      return "left: 50%; transform: translateX(-50%);";
    }}

    background-color: var(--color-petrol-darker);
    color: var(--color-white);
    
    box-shadow:
            0 4px 6px -1px rgba(0, 0, 0, 0.3),
            0 2px 4px -1px rgba(0, 0, 0, 0.2),
            0 10px 15px -3px rgba(0, 0, 0, 0.4);
    
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 8px 12px;
    border-radius: 8px;
    font-size: 0.8rem;
    white-space: nowrap;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.2s ease;
    pointer-events: none;
  }

  &::before {
    content: "";
    position: absolute;
    z-index: 9999;
    left: 50%;
    transform: translateX(-50%);
    border: 6px solid transparent;

    ${(props) =>
      props.$position === "bottom"
        ? "top: 110%; border-bottom-color: var(--color-petrol-darker);"
        : "bottom: 110%; border-top-color: var(--color-petrol-darker);"}

    opacity: 0;
    visibility: hidden;
  }

  &:hover::after,
  &:hover::before {
    opacity: 1;
    visibility: visible;
  }
`;