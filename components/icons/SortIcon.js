import styled from "styled-components";

export const SortIcon = ({ columnKey, currentSortBy, direction }) => {
  if (currentSortBy !== columnKey) {
    return <StyledIcon>↕</StyledIcon>;
  }
  return (
    <StyledSortIcon>
      {direction === 'asc' ? '▲' : '▼'}
    </StyledSortIcon>
  );
};

const StyledIcon = styled.span`
  color: var(--color-white);
  margin-left: 8px;
  font-size: 0.8rem;
`;

const StyledSortIcon = styled.span`
  color: var(--color-green-darker);
  margin-left: 8px;
  font-weight: bold;
`;