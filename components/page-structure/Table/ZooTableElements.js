import styled from "styled-components";

export const TableFrame = styled.div`
  background: var(--color-white);
  border: 2px solid var(--color-green);
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
    background: var(--color-white);
    padding: 15px;
    text-align: left;
    color: var(--color-green);
    border-bottom: 2px solid var(--color-white);
  }

  td {
    padding: 12px 15px;
    border-bottom: 1px solid var(--color-white);
  }

  tr:hover td {
    background: var(--color-white);
  }

  /* Abrundung der Ecken */
  th:first-child { border-top-left-radius: calc(var(--border-radius) - 2px); }
  th:last-child { border-top-right-radius: calc(var(--border-radius) - 2px); }
  tr:last-child td:first-child { border-bottom-left-radius: calc(var(--border-radius) - 2px); }
  tr:last-child td:last-child { border-bottom-right-radius: calc(var(--border-radius) - 2px); }
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


