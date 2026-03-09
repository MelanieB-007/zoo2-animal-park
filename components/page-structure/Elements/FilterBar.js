import styled from "styled-components";

export default function FilterBar({children}){
  return (
    <StyledFilterBar>
      {children}
    </StyledFilterBar>
  );
}

const StyledFilterBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto 20px auto;
  padding: 0 10px;
  gap: 15px;
`;