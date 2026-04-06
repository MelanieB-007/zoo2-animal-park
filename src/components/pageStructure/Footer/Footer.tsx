"use client";

import React from "react";
import styled from "styled-components";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { theme } from "@/styles/theme";

/**
 * Der globale Footer der Anwendung.
 * Nutzt Glass-Morphismus und das zentrale Theme für Branding-Farben.
 */
export default function Footer() {
  const t = useTranslations("common");

  return (
    <StyledFooter>
      <FooterContent>
        <p>
          © 2026 -{" "}
          {t("footer.clubName", { defaultValue: "Klub der tollen Tiere" })} |{" "}
          <Link href="/imprint">
            {t("footer.imprint", { defaultValue: "Impressum" })}
          </Link>
        </p>
      </FooterContent>
    </StyledFooter>
  );
}

const StyledFooter = styled.footer`
  position: relative;
  flex-shrink: 0;
  padding: 1rem 0;
  margin: 20px auto 10px; 
  width: 95%;
  max-width: 1200px;
  min-height: 70px;
  z-index: 10;
  text-align: center;

  /* Glass-Morphismus aus dem Theme */
  background-color: ${theme.colors.brand.petrol}CC; /* CC für leichte Transparenz */
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);

  /* Der markante Glow-Effekt am oberen Rand */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 60%;
    height: 2px;
    background: ${theme.colors.brand.orange || "#ff9800"};
    box-shadow: 0 0 15px
      ${theme.colors.brand.orange || "#ff9800"};
  }

  p {
    margin: 0.5rem 0;
    font-size: 0.875rem;
    color: ${theme.colors.ui.surface}; /* Weißer Text auf Petrol */
    font-weight: 500;
    letter-spacing: 0.02em;
  }

  a {
    color: ${theme.colors.ui.surface};
    text-decoration: none;
    margin-left: 5px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.3);
    transition: all 0.3s ease;

    &:hover {
      color: ${theme.colors.brand.orange};
      border-bottom-color: ${theme.colors.brand.orange};
      text-shadow: 0 0 8px ${theme.colors.brand.orange}66;
    }
  }

  @media (max-width: 768px) {
    width: 100%;
    border-radius: 0; /* Auf Mobile oft schöner, wenn er abschließt */
    margin-bottom: 0;

    p {
      font-size: 0.8rem;
    }
  }
`;

const FooterContent = styled.div`
  padding: 0.5rem 0;
  opacity: 0.95;
`;
