import styled, { keyframes } from "styled-components";
import Image from "next/image";
import { useTranslation } from "next-i18next";

const ROLE_IMAGES = {
  Direktor: "/images/roles/Grandpa.webp",
  Guide: "/images/roles/Lucy.webp",
  Besucher: "/images/roles/Vicky.webp",
};

export default function RoleBadge({ role }) {
  const { t } = /** @type {any} */ (useTranslation("common"));
  const imageSrc = ROLE_IMAGES[role] || ROLE_IMAGES.Besucher;

  return (
    <BadgeContainer>
      <RoleIconWrapper>
        <Image src={imageSrc} alt={role} width={45} height={45} priority />
      </RoleIconWrapper>

      <Tooltip className="tooltip">
        {t(`roles.${role}`, role)}
      </Tooltip>
    </BadgeContainer>
  );
}

const hoverBounce = keyframes`
  0% {
    transform: scale(1) translateY(0);
  }
  50% {
    transform: scale(1.1) translateY(-5px);
  }
  100% {
    transform: scale(1.05) translateY(-3px);
  }
`;

const popIn = keyframes`
  0% {
    transform: scale(0);
    rotate: -20deg;
  }
  70% {
    transform: scale(1.2);
    rotate: 10deg;
  }
  100% {
    transform: scale(1);
    rotate: 0deg;
  }
`;

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
  bottom: 120%;
  left: 50%;
  transform: translateX(-50%) translateY(10px);

  background: var(--color-petrol);
  color: var(--color-white);
  padding: 5px 12px;
  border-radius: var(--border-radius);
  font-family: var(--font-text);
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  white-space: nowrap;
  letter-spacing: 0.05em;

  box-shadow: 3px 3px 0 var(--color-black);
  border: 2px solid var(--color-white);

  opacity: 0;
  visibility: hidden;
  transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  pointer-events: none;
  z-index: 1000;

  &::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: var(--color-white) transparent transparent transparent;
  }
`;

const RoleIconWrapper = styled.div`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  border: 3px solid var(--color-green);
  overflow: hidden;
  background-color: #fceabb;
  box-shadow: 2px 2px 0 var(--color-petrol);
  cursor: help;

  animation: ${popIn} 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transition: all 0.3s ease;

  &:hover {
    animation: ${hoverBounce} 0.4s forwards;
  }

  img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
`;