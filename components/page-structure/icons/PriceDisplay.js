import React from "react";
import styled from "styled-components";
import DiamondIcon from './DiamondIcon';
import ZoodollarIcon from "./ZoodollarIcon";

export default function PriceDisplay({ value, type, altTextDiamond, altTextZoodollar }) {
  return (
    <PriceWrapper>
      {type === 'diamanten' ? (
        <DiamondIcon
          value={value}
          altText={altTextDiamond}
        />
      ) : (
        <ZoodollarIcon
          value={value}
          altText={altTextZoodollar}
        />
      )}
    </PriceWrapper>
  );
}

const PriceWrapper = styled.div`
  display: flex;
  justify-content: flex-end; 
  align-items: center;
  width: 100%;
  padding-right: 5px; 
`;