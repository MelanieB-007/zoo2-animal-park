import styled from "styled-components";
import { useTranslation } from "next-i18next";

import GameIcon from "../icons/GameIcon";
import { NameDE } from "../page-structure/Elements/Name";
import GehegeBadge from "../page-structure/Elements/GehegeBadge";
import PriceDisplay from "../icons/PriceDisplay";
import StallLevelBadge from "../page-structure/Elements/StallLevelBadge";
import EditButton from "../icons/EditIcon";
import DeleteButton from "../icons/DeleteIcon";

export default function AnimalMobileCard({ tier, onClick }) {
  const { t } = useTranslation(["common", "animal"]);

  const habitatId = tier.gehege?.name?.toLowerCase() || "standard";

  return (
    <CardContainer onClick={onClick}>
      <HeaderRow>
        <StyledNameDE>{tier.name}</StyledNameDE>

        <ActionGroup onClick={(e) => e.stopPropagation()}>
          <EditButton tooltip={t("editAnimal", { ns: "animal" })} />
          <DeleteButton tooltip={t("deleteAnimal", { ns: "animal" })} />
        </ActionGroup>
      </HeaderRow>

      <Divider />

      <StatsRow>
        <PriceRow>
          <PriceDisplay value={tier.preis} type={tier.preisart?.name} />
        </PriceRow>

        <IconsRow>
          <GameIcon
            type={`tiere/${habitatId}`}
            fileName={tier.bild || "default.jpg"}
            size={50}
          />

          <GehegeBadge type={tier.gehege?.name} size={35} />

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
  background: var(--color-white);
  border-radius: 12px;
  padding: 12px 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px var(--color-black);
  border: 1px solid var(--color-white);
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
  background-color: var(--color-grey-200);
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

const StyledNameDE = styled(NameDE)`
  font-size: 1.15rem;
  margin: 0;
`;