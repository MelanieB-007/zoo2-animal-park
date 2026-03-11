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
  font-weight: 700;
  color: #3e2723;
  font-size: 1.1rem;
  line-height: 1.2;
  word-wrap: break-word;
  max-width: 250px;
`;

const StyledNameEN = styled.div`
  font-size: 0.85rem;
  color: #777;
  font-style: italic;
  margin-top: 2px;
`;