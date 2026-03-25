import styled from "styled-components";

export function NameDE({children, className}){
  return (
    <StyledNameDE className={className}>
      {children}
    </StyledNameDE>
  );
}

const StyledNameDE = styled.span`
  font-weight: bold;
  font-size: 0.9rem;
  display: inline-block; 

  /* Worttrennung */
  hyphens: auto;
  -webkit-hyphens: auto;
  -ms-hyphens: auto;
  
  overflow-wrap: break-word;
  word-wrap: break-word;

  max-width: 100%;
`;