import styled from "styled-components";

export const SortIcon = ({ columnKey, currentSortBy, direction }) => {
  if (currentSortBy !== columnKey) {
    return <StyledIcon>↕</StyledIcon>;
  }
  return (
    <span style={{ color: '#4ca64c', marginLeft: '8px', fontWeight: 'bold' }}>
      {direction === 'asc' ? '▲' : '▼'}
    </span>
  );
};

const StyledIcon = styled.span`
  color: #ccc;
  margin-left: 8px;
  font-size: 0.8rem;
`;