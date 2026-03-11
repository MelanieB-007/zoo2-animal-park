import styled from "styled-components";
import { habitatColors } from "../../utils/habitatConstants";

export const TierThumbnail = styled.div`
  position: relative;
  width: 55px;
  height: 55px;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  border: 3px solid
    ${(props) => habitatColors[props.$type?.toLowerCase()]?.main || "#8dbd5b"};

  transition: all 0.2s ease-in-out;
  cursor: pointer;
  z-index: 1;

  &:hover {
    transform: scale(1.5);
    z-index: 10;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  }

  img {
    display: block;
    width: 100%;
    height: auto;
    object-fit: contain;
  }
`;