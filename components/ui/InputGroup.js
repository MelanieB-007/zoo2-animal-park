import styled from "styled-components";

export default function InputGroup({ children, unit, icon }) {
  return (
    <GroupWrapper>
      {children}
      {unit && <Unit>{unit}</Unit>}
      {icon && <IconWrapper>{icon}</IconWrapper>}
    </GroupWrapper>
  );
}

const GroupWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  background: #fff;
`;

const Unit = styled.strong`
  font-size: 0.9rem;
  color: var(--color-petrol, #88a04d);
  min-width: 15px;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;