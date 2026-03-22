import React from "react";
import styled from "styled-components";
import { useTranslation } from "next-i18next";

import GameIcon from "../icons/GameIcon";
import { NameDE } from "../page-structure/Elements/Name";
import GehegeBadge from "../ui/GehegeBadge";
import PriceDisplay from "../icons/PriceDisplay";
import StallLevelBadge from "../ui/StallLevelBadge";
import EditButton from "../icons/EditIcon";
import DeleteButton from "../icons/DeleteIcon";
import { getTranslatedName } from "../ui/TranslationHelper";

export default function AnimalMobileCard({
  animal,
  onClick,
  onEdit,
  onDelete,
}) {
  const { t, i18n } = /** @type {any} */ (
    useTranslation(["animals", "common"])
  );
  const habitatId = animal.gehege?.name?.toLowerCase() || "standard";

  const displayName =
    getTranslatedName(animal, i18n.language) || t("animals:unknown_animal");

  return (
    <CardContainer onClick={onClick}>
      <HeaderRow>
        <NameDE>{displayName}</NameDE>
        <ActionGroup onClick={(e) => e.stopPropagation()}>
          <EditButton onClick={onEdit} />
          <DeleteButton onClick={onDelete} />
        </ActionGroup>
      </HeaderRow>

      <Divider />

      <StatsRow>
        <PriceRow>
          <PriceDisplay
            value={animal.preis}
            type={animal.preisart?.name?.toLowerCase() || "gold"}
            altTextDiamond={t("common:payment:diamonds")}
            altTextZoodollar={t("common:payment:zoodollar")}
          />
        </PriceRow>

        <IconsRow>
          <GameIcon
            type={`tiere/${habitatId}`}
            fileName={animal.bild}
            size={50}
          />

          <GehegeBadge gehege={animal.gehege} size={35} />

          <StallLevelBadge
            level={animal.stalllevel}
            habitat={animal.gehege?.name}
          />
        </IconsRow>
      </StatsRow>
    </CardContainer>
  );
}

const CardContainer = styled.div`
  background: var(--color-white);
  border-radius: 12px;
  padding: 12px 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const Divider = styled.div`
  height: 1px;
  background-color: #eee;
  margin-bottom: 12px;
`;

const StatsRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

const PriceRow = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-right: 4px;
`;

const IconsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const ActionGroup = styled.div`
  display: flex;
  gap: 16px;

  button {
    background: none;
    border: none;
    padding: 8px;
    cursor: pointer;
  }
`;
