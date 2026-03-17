import React from 'react';
import styled from 'styled-components';

export default function GameIcon({ type, fileName, size = 50, bordercolor = "var(--color-green)" }) {
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
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background: var(--color-white); 
  
  border: 2px solid ${props => props.bordercolor};
  border-radius: var(--border-radius-icon); 
  
  padding: 0;           
  display: flex;        
  overflow: hidden;     
  
  box-shadow: 2px 2px 6px var(--color-black);
`;

const StyledImage = styled.img`
  width: 100%;          
  height: 100%;         
  
  object-fit: cover;    
  object-position: center; 
  
  -webkit-backface-visibility: hidden;
`;