"use client";

import React from "react";
import styled, { keyframes } from "styled-components";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { theme } from "@/styles/theme";

// Die Zuordnung der Zoo-Charaktere zu den Rollen
const ROLE_IMAGES: Record<string, string> = {
  Direktor: "/images/roles/Grandpa.webp",
  Guide: "/images/roles/Lucy.webp",
  Besucher: "/images/roles/Vicky.webp",
};

interface RoleBadgeProps {
  role: string | null;
}

export default function RoleBadge({ role }: RoleBadgeProps) {
  const t = useTranslations("common");

  // Fallback auf Besucher, falls die Rolle unbekannt oder null ist
  const activeRole = role || "Besucher";
  const imageSrc = ROLE_IMAGES[activeRole] || ROLE_IMAGES.Besucher;

  return (
    <BadgeContainer>
      <RoleIconWrapper>
        <Image
          src={imageSrc}
          alt={activeRole}
          width={45}
          height={45}
          priority
        />
      </RoleIconWrapper>

      <Tooltip className="tooltip">
        {/* Nutzt die Übersetzung für Rollen, z.B. roles.Direktor */}
        {t(`roles.${activeRole}`, { defaultValue: activeRole })}
      </Tooltip>
    </BadgeContainer>
  );
}

// --- Animationen ---

const popIn = keyframes`
  0% { transform: scale(0) rotate(-20deg); }
  70% { transform: scale(1.2) rotate(10deg); }
  100% { transform: scale(1) rotate(0deg); }
`;

const hoverBounce = keyframes`
  0% { transform: scale(1) translateY(0); }
  50% { transform: scale(1.1) translateY(-5px); }
  100% { transform: scale(1.05) translateY(-3px); }
`;

// --- Styles ---

const BadgeContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &:hover .tooltip {
    opacity: 1;
    visibility: visible;
    transform: translateX(-50%) translateY(0);
  }
`;

const Tooltip = styled.span`
  position: absolute;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%) translateY(10px);

  background: ${theme.colors.brand.petrol};
  color: ${theme.colors.ui.surface};
  padding: 6px 12px;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  white-space: nowrap;
  letter-spacing: 0.05em;

  box-shadow: 3px 3px 0 rgba(0, 0, 0, 0.2);
  border: 2px solid white;

  opacity: 0;
  visibility: hidden;
  transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  pointer-events: none;
  z-index: 1000;

  &::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -6px;
    border-width: 6px;
    border-style: solid;
    border-color: white transparent transparent transparent;
  }
`;

const RoleIconWrapper = styled.div`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  border: 3px solid ${theme.colors.brand.green};
  overflow: hidden;
  background: linear-gradient(135deg, #fceabb 0%, #f8b500 100%);
  box-shadow: 2px 2px 0 ${theme.colors.brand.petrolDark};
  cursor: help;

  animation: ${popIn} 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transition: all 0.3s ease;

  &:hover {
    animation: ${hoverBounce} 0.4s forwards;
    border-color: ${theme.colors.brand.orange};
  }

  img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
`;
