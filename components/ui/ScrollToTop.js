import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { useTranslation } from "next-i18next";

import Tooltip from "./Tooltip";

export default function ScrollToTop() {
    const { t } = useTranslation('common');
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);
        return () =>
          window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
      <Tooltip
      text={t('on_top')}
      >
        <ScrollButton
          $visible={isVisible}
          onClick={scrollToTop}
        >
            🐾
        </ScrollButton>
      </Tooltip>
    );
}

const popIn = keyframes`
  from { transform: scale(0) rotate(-45deg); opacity: 0; }
  to { transform: scale(1) rotate(0); opacity: 1; }
`;

const ScrollButton = styled.button`
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
  
  display: flex;
  align-items: center;
  justify-content: center;
  
  background: var(--color-zoo-orange);
  color: var(--color-green);
  border: 3px solid var(--color-white);
  border-radius: 50%;
  font-size: 2rem;
  cursor: pointer;
  z-index: 5000;
  
  box-shadow: 4px 4px 0 var(--color-black);
  
  /* Sichtbarkeit & Animation */
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  visibility: ${props => (props.$visible ? "visible" : "hidden")};
  opacity: ${props => (props.$visible ? "1" : "0")};
  transform: ${props => (props.$visible ? "scale(1)" : "scale(0) rotate(-45deg)")};

  &:hover {
    transform: scale(1.1) translateY(-5px);
    background: var(--color-orange-light);
    box-shadow: 6px 6px 0 var(--color-black);
  }

  &:active {
    transform: scale(0.9);
  }
`;