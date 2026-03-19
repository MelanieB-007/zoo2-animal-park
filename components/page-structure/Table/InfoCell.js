import styled from "styled-components";

export default function InfoCell({children}){
  return (
    <StyledInfoCell>
      {children}
    </StyledInfoCell>
  );
}

const StyledInfoCell = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;