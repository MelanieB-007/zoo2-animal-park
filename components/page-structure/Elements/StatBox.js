import styled from "styled-components";

export default function StatBox({children}){
  return (
    <StyledStatBox>
      {children}
    </StyledStatBox>
  );
}

const StyledStatBox = styled.div`
  background: var(--color-white);
  border: 1px solid var(--color-white);
  border-radius:var(--border-radius-icon);
  padding: 8px 12px;
  
  label {
    display: block;
    font-size: 0.7rem;
    color: var(--color-grey-lighter);
    text-transform: uppercase;
    font-weight: bold;
    margin-bottom: 4px;
  }
  
  .value {
    display: flex;
    align-items: center;
    font-weight: bold;
    font-size: 1.1rem;
    color: var(--color-grey-0-1);
    gap: 5px;
  }
`;