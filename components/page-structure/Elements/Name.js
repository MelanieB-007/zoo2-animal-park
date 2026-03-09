import styled from "styled-components";

export function NameDE({children}){
  return (
    <StyledNameDE>
      {children}
    </StyledNameDE>
  );
}

export function NameEN({children}){
  return (
    <StyledNameEN>
      {children}
    </StyledNameEN>
  );
}

const StyledNameDE = styled.div`
  font-weight: bold;
  color: var(--color-petrol-darker);
  font-size: 1rem;
`;

const StyledNameEN = styled.div`
  font-size: 0.8rem;
  color: var(--color-grey-dark);
  opacity: 0.5;
  font-style: italic;
`;