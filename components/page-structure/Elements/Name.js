import styled from "styled-components";

export function NameDE({children}){
  return (
    <StyledNameDE>
      {children}
    </StyledNameDE>
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