import styled from "styled-components";

export default function LinkedRow({children, key, path}){
  return (
    <StyledLinkedRow
      key={key}
      onClick={() => router.push({path})}
      style={{ cursor: "pointer" }}
    >
      {children}
    </StyledLinkedRow>
  );
}

const StyledLinkedRow = styled.tr`
  border-bottom: 1px solid #eee;

  &:hover {
    background: #f0fff0;
  }

  td {
    padding: 12px 15px;
  }
`;