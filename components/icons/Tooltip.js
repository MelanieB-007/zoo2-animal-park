import React from 'react';
import styled from 'styled-components';

export default function Tooltip({ text, children, align = 'center', position = 'top' }) {
  if (!text) return children;

  return (
    <TooltipContainer $text={text} $align={align} $position={position}>
      {children}
    </TooltipContainer>
  );
}

/* In deiner Tooltip.js */

const TooltipContainer = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;

  &::after {
    content: "${(props) => props.$text}";
    position: absolute;
    z-index: 9999; /* Extrem hoch */

    /* Absolute Position-Resets */
    ${(props) => props.$position === 'bottom'
            ? 'top: 140%; bottom: auto;'
            : 'bottom: 140%; top: auto;'}

    ${(props) => {
      if (props.$align === 'left') return 'right: 0; left: auto; transform: none;';
      if (props.$align === 'right') return 'left: 0; right: auto; transform: none;';
      return 'left: 50%; transform: translateX(-50%);';
    }}

    /* Styling */
    background-color: var(--color-petrol-darker);
    color: white;
    padding: 8px 12px;
    border-radius: 8px;
    font-size: 0.8rem;
    white-space: nowrap;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.2s ease;
    pointer-events: none;
    box-shadow: 0 4px 12px rgba(0,0,0,0.4);
  }

  /* Der Pfeil */
  &::before {
    content: "";
    position: absolute;
    z-index: 9999;
    left: 50%;
    transform: translateX(-50%);
    border: 6px solid transparent;

    ${(props) => props.$position === 'bottom'
            ? 'top: 110%; border-bottom-color: var(--color-petrol-darker);'
            : 'bottom: 110%; border-top-color: var(--color-petrol-darker);'}

    opacity: 0;
    visibility: hidden;
  }

  &:hover::after, &:hover::before {
    opacity: 1;
    visibility: visible;
  }
`;