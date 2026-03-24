import styled from "styled-components";

export default function TableContainer({ children }) {
  return <StyledTableContainer>{children}</StyledTableContainer>;
}

const StyledTableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  height: auto;
`;