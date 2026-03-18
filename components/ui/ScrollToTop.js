import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { useTranslation } from "next-i18next";

// Animation außerhalb, um den Call-Stack-Error zu vermeiden
const popIn = keyframes`
  from { transform: scale(0) rotate(-45deg); opacity: 0; }
  to { transform: scale(1) rotate(0); opacity: 1; }
`;

export default function ScrollToTop() {
    const { t } = /** @type {any} */ (useTranslation(["common"]));
    const [isVisible, setIsVisible] = useState(false);

    useEffect(function () {
        function handleScroll() {
            // Erscheint nach 400px Scroll-Weg
            setIsVisible(window.scrollY > 400);
        }
        window.addEventListener("scroll", handleScroll);
        return function () {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

   if (!isVisible) return null;

    return (
      <ScrollButton
        onClick={scrollToTop}
        title={t("common:scroll_to_top")}
        type="button"
      >
          🐾
      </ScrollButton>
    );
}

const ScrollButton = styled.button`
    position: fixed;
    bottom: 25px;
    right: 25px;
    z-index: 999; 

    width: 56px;
    height: 56px;

    display: flex;
    align-items: center;
    justify-content: center;

    background-color: var(--color-zoo-orange, #f39c12);
    color: var(--color-white);
    border: 3px solid var(--color-white);
    border-radius: 50%;
    font-size: 1.8rem;
    cursor: pointer;

    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);

    /* Animation beim Erscheinen */
    animation: ${popIn} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    transition: all 0.2s ease-in-out;

    &:hover {
        transform: scale(1.1) translateY(-3px);
        background-color: var(--color-orange-light, #ffb347);
        box-shadow: 0 6px 15px rgba(0, 0, 0, 0.4);
    }

    &:active {
        transform: scale(0.9);
    }

    @media (max-width: 768px) {
        width: 50px;
        height: 50px;
        bottom: 20px;
        right: 20px;
        font-size: 1.5rem;
    }
`;