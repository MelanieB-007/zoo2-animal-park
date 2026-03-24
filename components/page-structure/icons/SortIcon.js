import styled from "styled-components";

export default function SortIcon ({ columnKey, currentSortBy, direction }) {
  if (currentSortBy !== columnKey) {
    return <StyledIcon>↕</StyledIcon>;
  }
  return (
    <StyledDirection>
      {direction === 'asc' ? '▲' : '▼'}
    </StyledDirection>
  );
};

const StyledIcon = styled.span`
  color: #ccc;
  margin-left: 8px;
  font-size: 0.8rem;
`;

const StyledDirection = styled.span`
  color: #4ca64c;
  margin-left: 8px;
  font-weight: bold;
`;