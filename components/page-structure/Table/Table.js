import styled from "styled-components";

export default function Table({children}){
  return (
    <DesktopView>
      <TableFrame>
        <StyledTable>
          {children}
        </StyledTable>
      </TableFrame>
    </DesktopView>
  );
}

const DesktopView = styled.div`
  display: block;
  @media (max-width: 767px) {
    display: none;
  }
`;

export const TableFrame = styled.div`
  background: var(--color-white);
  border: 2px solid var(--color-green);
  border-radius: var(--border-radius);
  overflow-x: auto;  
  overflow-y: hidden;
  position: relative;
  margin-top: 10px;
`;

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  min-width: 800px;

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