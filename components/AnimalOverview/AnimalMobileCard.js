import styled from "styled-components";
import { TierThumbnail } from "../icons/TierThumbnail";
import GameIcon from "../icons/GameIcon";
import { NameDE } from "../page-structure/Elements/Name";
import GehegeBadge from "../page-structure/Elements/GehegeBadge";
import PriceDisplay from "../icons/PriceDisplay";
import StallLevelBadge from "../page-structure/Elements/StallLevelBadge";
import EditButton from "../icons/EditIcon";
import DeleteButton from "../icons/DeleteIcon";

export default function AnimalMobileCard({ tier, translations, onClick }) {
  const habitatId = tier.gehege?.name?.toLowerCase() || "standard";

  return (
    <CardContainer onClick={onClick}>
      <HeaderRow>
        <NameDE style={{ fontSize: '1.15rem', margin: 0 }}>{tier.name}</NameDE>
        <ActionGroup onClick={(e) => e.stopPropagation()}>
          <EditButton />
          <DeleteButton />
        </ActionGroup>
      </HeaderRow>

      <Divider />

      <StatsRow>
      <PriceRow>
        <PriceDisplay
          value={tier.preis}
          type={tier.preisart?.name?.toLowerCase()}
        />
      </PriceRow>

      {/* Zeile 2: Die visuellen Merkmale */}
      <IconsRow>
        <GameIcon
          type={`tiere/${habitatId}`}
          fileName={tier.bild || "default.jpg"}
          size={50}
        />

        <GehegeBadge
          type={tier.gehege?.name}
          size={35}
        />

        <StallLevelBadge
          level={tier.stalllevel}
          habitatName={tier.gehege?.name}
        />
      </IconsRow>
    </StatsRow>
    </CardContainer>
  );
}

const CardContainer = styled.div`
  background: white;
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
  flex-direction: column; // Wir stapeln Preis und Icons
  gap: 8px;
  width: 100%;
`;

const PriceRow = styled.div`
  display: flex;
  justify-content: flex-end; // Preis klebt rechts unter der Linie
  padding-right: 4px;
`;

const IconsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between; // Bild, Gehege und Stall verteilen sich
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