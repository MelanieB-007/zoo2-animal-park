import React from 'react';
import styled from 'styled-components';

export default function GameIcon({ type, fileName, size = 50, bordercolor = "#4ca64c" }) {
  const imagePath = `/images/${type}/${fileName}`;

  return (
    <IconFrame
      size={size}
      bordercolor={bordercolor}>
      <StyledImage
        src={imagePath}
        alt={fileName}
      />
    </IconFrame>
  );
}


const IconFrame = styled.div`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  background: #eee; 
  
  border: 2px solid ${props => props.bordercolor};
  border-radius: 10px; 
  
  padding: 0;           
  display: flex;        
  overflow: hidden;     
  
  box-shadow: 2px 2px 6px rgba( 0, 0, 0, 0.15);
`;

const StyledImage = styled.img`
  width: 100%;          
  height: 100%;         
  
  object-fit: cover;    
  object-position: center; 
  
  -webkit-backface-visibility: hidden;
`;