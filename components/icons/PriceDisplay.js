import React from "react";
import styled from "styled-components";
import DiamandIcon from './DiamandIcon';
import ZoodollarIcon from "./ZoodollarIcon";

export default function PriceDisplay({ value, type }) {
  return (
    <PriceWrapper>
      {type === 'diamanten' ? (
        <DiamandIcon value={value} />
      ) : (
        <ZoodollarIcon value={value} />
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