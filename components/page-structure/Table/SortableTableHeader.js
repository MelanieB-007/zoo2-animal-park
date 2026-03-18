import styled, { css } from "styled-components";

import { SortIcon } from "../../icons/SortIcon";
import Tooltip from "../../ui/Tooltip";

export default function SortableTableHeader(
  {text,
    columnKey,
    onSort,
    currentSortBy,
    sortDirection,
    align="left",
    tooltipText,
    desktopOnly = false
  }){
  const headerText = tooltipText ? (
    <Tooltip text={tooltipText}>{text}</Tooltip>
  ) : (
    text
  );

  return (
    <SortableTh
      onClick={onSort}
      $align={align}
      $desktopOnly={desktopOnly}
      $isActive={currentSortBy === columnKey}
    >
      <HeaderWrapper
        $align={align}
      >
        {headerText}

        <SortIcon
          columnKey={columnKey}
          currentSortBy={currentSortBy}
          direction={sortDirection}
        />
      </HeaderWrapper>
    </SortableTh>
  );
}

export const SortableTh = styled.th`
  cursor: pointer;
  user-select: none;
  transition: all 0.2s;
  white-space: nowrap;
  text-align: ${({ $align }) => $align};
  
  background-color: ${({ $isActive }) =>
  $isActive ? 'var(--color-khaki-green-darker)' : 'transparent'};
  color: ${({ $isActive }) =>
  $isActive ? 'var(--color-khaki-green)' : 'inherit'};
  
  ${({ $desktopOnly }) => $desktopOnly && css`
    display: none;
    @media (min-width: 1024px) {
      display: table-cell;
    }
  `}
  
  &:hover {
    background-color: var(--color-khaki-green-darker) !important;
    color: var(--color-khaki-green);
  }
`;

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  justify-content: ${({ $align }) =>
  $align === "right" ? "flex-end" : "flex-start"};
`;