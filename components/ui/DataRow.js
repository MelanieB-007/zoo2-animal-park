import styled from "styled-components";

export default function DataRow({ label, children, border = true }) {
  return (
    <StyledRow $hasBorder={border}>
      {label && <Label>{label}</Label>}
      <Content $hasLabel={!!label}>{children}</Content>
    </StyledRow>
  );
}

const StyledRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  gap: 12px;
  border-bottom: ${props => props.$hasBorder ? "1px solid #f5f5f5" : "none"};

  &:last-child {
    border-bottom: none;
  }
`;

const Label = styled.span`
  font-size: 0.9rem;
  color: #666;
  white-space: nowrap;
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${props => props.$hasLabel ? "flex-end" : "flex-start"};
  flex-grow: 1;
  gap: 8px;
`;