import React from "react";
import styled from "styled-components";
import { useTranslation } from "next-i18next";
import GameIcon from "../icons/GameIcon";
import { NameDE } from "../page-structure/Elements/Name";
import GehegeBadge from "../page-structure/Elements/GehegeBadge";
import PriceDisplay from "../icons/PriceDisplay";
import StallLevelBadge from "../page-structure/Elements/StallLevelBadge";
import EditButton from "../icons/EditIcon";
import DeleteButton from "../icons/DeleteIcon";


export default function AnimalMobileCard({ animal, onClick }) {
  const { i18n } = useTranslation();
  const habitatId = animal.gehege?.name?.toLowerCase() || "standard";

  const displayName = i18n.language === "en"
    ? (animal.name_en || animal.name)
    : (animal.name || animal.name_en);

  function handleActionClick(e) {
    e.stopPropagation();
  }

  return (
    <CardContainer onClick={onClick}>
      <HeaderRow>
        <NameDE>{displayName}</NameDE>
        <ActionGroup onClick={handleActionClick}>
          <EditButton />
          <DeleteButton />
        </ActionGroup>
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
          <GameIcon
            type={`tiere/${habitatId}`}
            fileName={animal.bild || "default.jpg"}
            size={50}
          />

          <GehegeBadge
            type={animal.gehege?.name}
            size={35}
          />

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
  gap: 12px;

  svg {
    width: 20px;
    height: 20px;
  }
`;