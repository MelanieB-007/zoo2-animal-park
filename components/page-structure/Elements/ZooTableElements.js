import styled from "styled-components";

export const TableFrame = styled.div`
  background: white;
  border: 2px solid #4ca64c;
  border-radius: var(--border-radius);
  overflow: visible;
  position: relative;
  margin-top: 10px;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  min-width: 600px;

  th {
    background: #f9fbf9;
    padding: 15px;
    text-align: left;
    color: #4ca64c;
    border-bottom: 2px solid #eef2ee;
  }

  td {
    padding: 12px 15px;
    border-bottom: 1px solid #eee;
  }

  tr:hover td {
    background: #f0fff0;
  }

  /* Abrundung der Ecken */
  th:first-child { border-top-left-radius: calc(var(--border-radius) - 2px); }
  th:last-child { border-top-right-radius: calc(var(--border-radius) - 2px); }
  tr:last-child td:first-child { border-bottom-left-radius: calc(var(--border-radius) - 2px); }
  tr:last-child td:last-child { border-bottom-right-radius: calc(var(--border-radius) - 2px); }
`;

export const SortableTh = styled.th`
  cursor: pointer;
  user-select: none;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover {
    background-color: rgba(76, 166, 76, 0.08) !important;
    color: #2d5a27;
  }
`;

export const RightAlignedTd = styled.td`
  text-align: right;
`;

export const DesktopOnlyTd = styled.td`
  text-align: right;
  padding-right: 20px !important;
  @media (max-width: 1024px) {
    display: none;
  }
`;

export const DesktopOnlyTh = styled(SortableTh)`
  @media (max-width: 1024px) {
    display: none;
  }
`;

export const RightAlignedSortableTh = styled(SortableTh)`
  text-align: right;
`;

export const StyledTh = styled(SortableTh)`
  
`;