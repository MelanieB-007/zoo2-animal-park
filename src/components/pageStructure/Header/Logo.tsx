"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import styled from "styled-components";

/**
 * Das Haupt-Logo des Klubs.
 * Nutzt next/image für optimierte Ladezeiten und Styled-Components für Effekte.
 */
export default function Logo() {
  return (
    <Link href="/" passHref legacyBehavior>
      <LogoLink aria-label="Zur Startseite">
        <LogoWrapper>
          <StyledImage
            src="/images/logo.png"
            alt="Klub der tollen Tiere Logo"
            width={120}
            height={120} // Die tatsächliche Höhe deines Bildes für das Seitenverhältnis
            priority // Das Logo sollte immer sofort geladen werden
          />
        </LogoWrapper>
      </LogoLink>
    </Link>
  );
}

const LogoLink = styled.a`
  text-decoration: none;
  display: block;
`;

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  /* Die Grid-Positionierung übernimmt bereits der Header-Parent */
`;

const StyledImage = styled(Image)`
  width: 120px;
  height: auto;
  object-fit: contain;

  /* Nutzt den Drop-Shadow aus deinem Theme oder einen sanften Standard */
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);

  &:hover {
    /* Ein verspielter "Wackel-Effekt", passend zum Zoo-Thema */
    transform: scale(1.08) rotate(-3deg);
  }

  @media (max-width: 767px) {
    width: 70px; /* Etwas kleiner auf Mobile, passend zum kompakten Header */
  }
`;
