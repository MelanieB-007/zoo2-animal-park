import styled from "styled-components";
import { useTranslation } from "next-i18next";

import Tooltip from "./Tooltip";

export default function PaginationSignpost({
  currentPage,
  totalPages,
  onNext,
  onPrev,
}) {
  const { t } = useTranslation('common');


  return (
    <SignpostAssembly>
      <Tooltip
        text={t('back')}
      >
        <SignpostButton
          direction="prev"
          onClick={onPrev}
          disabled={currentPage === 1}
        />
      </Tooltip>

      <PageIndicator>
        <div>
          {currentPage} <small>/</small> {totalPages}
        </div>
      </PageIndicator>

      <Tooltip
        text={t('next')}
      >
        <SignpostButton
          direction="next"
          onClick={onNext}
          disabled={currentPage === totalPages}
        />
      </Tooltip>
    </SignpostAssembly>
  );
}

const SignpostAssembly = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 40px;
  margin-top: 40px;
  margin-bottom: 20px; 

  @media (max-width: 768px) {
    gap: 10px; 
    margin-top: 20px;
    transform: scale(0.85); 
  }
`;

const SignpostButton = styled.button`
  position: relative;
  width: 160px;
  height: 65px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease-in-out;

  background-color: transparent;
  background-image: url("/images/icons/wegweiser-rechts.png");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  filter: saturate(1.2) contrast(1.1);

  ${(props) =>
    props.direction === "prev" &&
    `
    transform: scaleX(-1);
  `}
  &:hover:not(:disabled) {
    filter: saturate(1.4) contrast(1.1)
      drop-shadow(0 5px 15px var(--black));
    transform: translateY(-5px)
      ${(props) => 
              (props.direction === "prev" ? "scaleX(-1)" : "scale(1.05)")};
  }

  &:disabled {
    filter: grayscale(1) opacity(0.4);
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    width: 110px;
    height: 45px;
  }
`;

const PageIndicator = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  background-image: url("/images/icons/Holztafel.png");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;

  width: 150px;
  height: 60px;
  margin-top: -10px;
  padding-bottom: 5px;

  div {
    font-size: 1.2rem;
    font-weight: 900;
    color: var(--color-green-darker);
    font-family: var(--font-heading), serif;
    text-shadow: 1px 1px 0 var(--color-grey-lighter);
  }

  @media (max-width: 768px) {
    width: 100px; // Schmaler auf Mobile
    height: 40px;

    div {
      font-size: 1rem; // Schrift etwas kleiner
    }
  }
`;