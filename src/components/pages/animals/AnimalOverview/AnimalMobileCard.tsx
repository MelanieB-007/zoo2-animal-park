"use client";

import React from "react";
import styled from "styled-components";
import { useTranslations, useLocale } from "next-intl";
import { useSession } from "next-auth/react";

import GameIcon from "@/components/icons/GameIcon";

import BiomeBadge from "@/components/pageStructure/ui/BiomeBadge";
import PriceDisplay from "@/components/pageStructure/ui/PriceDisplay";
import StallLevelBadge from "@/components/pageStructure/ui/StallLevelBadge";
import { getTranslatedName } from "@/utils/TranslationHelper";
import ActionGroup from "@/components/pageStructure/ui/ActionGroup";
import { AnimalWithRelations } from "@/interfaces/animal";
import Name from "@/components/pageStructure/ui/Name";
import { theme } from "@/styles/theme";

interface AnimalMobileCardProps {
  animal: AnimalWithRelations;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function AnimalMobileCard({
  animal,
  onClick,
  onEdit,
  onDelete,
}: AnimalMobileCardProps) {
  const t = useTranslations("animals");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const { data: session } = useSession();

  // Dank der neuen styled.d.ts und NextAuth Erweiterung ist das jetzt sicher
  const isAdmin = session?.user?.role === "Direktor";

  const habitatId = animal.gehege?.name?.toLowerCase() || "standard";
  const displayName = getTranslatedName(animal, locale) || t("unknown_animal");

  return (
    <CardContainer onClick={onClick}>
      <HeaderRow>
        <Name>{displayName}</Name>
        {isAdmin && (
          <ActionGroup
            localeFile="animals"
            onEdit={onEdit}
            onDelete={onDelete}
          />
        )}
      </HeaderRow>

      <Divider />

      <StatsRow>
        <PriceRow>
          <PriceDisplay
            value={animal.preis}
            type={animal.preisart?.name?.toLowerCase() || "gold"}
          />
        </PriceRow>

        <IconsRow>
          {/* Das Tier-Icon */}
          <GameIcon
            type={`tiere/${habitatId}`}
            fileName={animal.bild}
            size={50}
          />

          {/* Das Biom-Icon */}
          <BiomeBadge
            biome={animal.gehege}
            size={35}
          />

          {/* Das Stall-Level */}
          <StallLevelBadge
            level={animal.stalllevel}
            habitat={animal.gehege?.name}
          />
        </IconsRow>
      </StatsRow>
    </CardContainer>
  );
}

// --- Styles ---

const CardContainer = styled.div`
  background: ${theme.colors.ui.surface};
  border-radius: 12px;
  padding: 16px;
  width: 100%; /* Nutzt den Platz im MobileListView Container */
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
  border: 1px solid ${theme.colors.ui.border};
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: transform 0.1s ease;

  &:active {
    transform: scale(0.98); /* Kleines Feedback beim Tippen */
  }
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const Divider = styled.div`
  height: 1px;
  background-color: ${theme.colors.ui.border};
  margin-bottom: 12px;
  opacity: 0.6;
`;

const StatsRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
`;

const PriceRow = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const IconsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding-top: 4px;
`;
