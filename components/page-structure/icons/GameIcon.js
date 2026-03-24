import React from 'react';
import styled from 'styled-components';

export default function GameIcon({ type, fileName, size = 50, bordercolor = "#4ca64c" }) {
  const name = fileName?.trim();

  let imagePath = fileName === "placeholder.png"
    ? `/images/placeholder.jpg`
    : `/images/${type}/${name}`;

  // 2. Sicherheits-Check: Doppelte Slashes (außer bei http://) zu einfachen Slashes machen
  const cleanPath = imagePath.replace(/([^:]\/)\/+/g, "$1");

  return (
    <IconFrame
      size={size}
      bordercolor={bordercolor}>
      <StyledImage
        src={cleanPath}
        alt={fileName}
        onError={(e) => {
          console.error("Bild nicht gefunden:", imagePath);
          e.target.src = "/images/placeholder.png"; // Absoluter Notfall-Fallback
        }}
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