import { useTranslation } from "next-i18next";

import {
  DesktopOnlyTd, RightAlignedTd, Table
} from "../page-structure/Table/ZooTableElements";
import Tooltip from "../ui/Tooltip";
import { TierThumbnail } from "../icons/TierThumbnail";
import GameIcon from "../icons/GameIcon";
import { NameDE } from "../page-structure/Elements/Name";
import GehegeBadge from "../page-structure/Elements/GehegeBadge";
import PriceDisplay from "../icons/PriceDisplay";
import StallLevelBadge from "../page-structure/Elements/StallLevelBadge";
import XPIcon from "../icons/XPIcon";
import { calculateTotalXP } from "../../services/AnimalService";
import ZoodollarIcon from "../icons/ZoodollarIcon";
import EditButton from "../icons/EditIcon";
import DeleteButton from "../icons/DeleteIcon";
import { useSort } from "../../hooks/useSort";
import SortableTableHeader from "../page-structure/Table/SortableTableHeader";
import ActionsHeadline from "../page-structure/Table/ActionsHeadline";
import styled from "styled-components";
import { useRouter } from "next/router";

export default function AnimalTable ({animals}){
  const { t } = useTranslation(['common','animal']);
  const { sortBy, sortDirection, toggleSort, sortData } = useSort("name");
  const sortedAnimals = sortData(animals);
  const router = useRouter();

  return (
    <Table>
      <thead>
      <tr>
        <SortableTableHeader
          text={t('species', { ns: 'animal' })}
          onSort={() => toggleSort("name")}
          columnKey="name"
          currentSortBy={sortBy}
          direction={sortDirection}
        />

        <SortableTableHeader
          text={t('binomes', { ns: 'common' })}
          onSort={() => toggleSort("gehege.name")}
          columnKey="gehege.name"
          currentSortBy={sortBy}
          direction={sortDirection}
        />

        <SortableTableHeader
          text={t('price', { ns: 'common' })}
          onSort={() => toggleSort("preis")}
          columnKey="preis"
          currentSortBy={sortBy}
          direction={sortDirection}
          align="right"
        />

        <SortableTableHeader
          text={t('shelter', { ns: 'animal' })}
          onSort={() => toggleSort("stalllevel")}
          columnKey="stalllevel"
          currentSortBy={sortBy}
          direction={sortDirection}
          tooltipText={t('shelter-level', { ns: 'animal' })}
        />

        <SortableTableHeader
          text="XP"
          tooltipText={t('tooltipXP', { ns: 'animal' })}
          onSort={() => toggleSort("xp")}
          columnKey="xp"
          currentSortBy={sortBy}
          direction={sortDirection}
          desktopOnly={true}
        />

        <SortableTableHeader
          text={t('sell', { ns: 'animal' })}
          tooltipText={t('tooltipSell', { ns: 'animal' })}
          onSort={() => toggleSort("verkaufswert")}
          columnKey="verkaufswert"
          currentSortBy={sortBy}
          direction={sortDirection}
          desktopOnly={true}
          align="right"
        />

        <SortableTableHeader
          text={t('release', { ns: 'animal' })}
          tooltipText={t('tooltipRelease', { ns: 'animal' })}
          onSort={() => toggleSort("auswildern")}
          columnKey="auswildern"
          currentSortBy={sortBy}
          direction={sortDirection}
          desktopOnly={true}
          align="right"
        />

        <ActionsHeadline
          text ={t('actions', { ns: 'common' })}
        />
      </tr>
      </thead>

      <tbody>
      {sortedAnimals.length > 0 ? (
        sortedAnimals.map((tier) => (
          <AnimalRow
            key={tier.id}
            onClick={() => router.push(`/tiere/${tier.id}`)}
            style={{ cursor: "pointer" }}
          >
            <td>
              <TierInfoCell>
                <TierThumbnail $type={tier.gehege?.name}>
                  <GameIcon
                    type={`tiere/${(tier.gehege?.name || "standard").toLowerCase()}`}
                    fileName={tier.bild || "default.jpg"}
                    bordercolor="transparent"
                  />
                </TierThumbnail>

                <div>
                  <NameDE>{tier.name}</NameDE>
                </div>
              </TierInfoCell>
            </td>

            <td>
                <GehegeBadge type={tier.gehege?.name} />
            </td>

            <RightAlignedTd>
              <PriceDisplay
                value={tier.preis}
                type={tier.preisart?.name.toLowerCase() || "gold"}
              />
            </RightAlignedTd>

            <td>
              <Tooltip
                text={`Benötigtes Stall-Level: ${tier.stalllevel}`}
                position="bottom"
              >
                <StallLevelBadge
                  level={tier.stalllevel}
                  habitatName={tier.gehege?.name}
                />
              </Tooltip>
            </td>

            <DesktopOnlyTd>
              <XPIcon label={calculateTotalXP(tier)} />
            </DesktopOnlyTd>

            <DesktopOnlyTd>
              <ZoodollarIcon value={tier.verkaufswert} />
            </DesktopOnlyTd>

            <DesktopOnlyTd>
              <XPIcon label={tier.auswildern} />
            </DesktopOnlyTd>

            <td>
              <ActionGroup onClick={(e) => e.stopPropagation()}>
                <EditButton
                  tooltip={t('edit', { ns: 'common' })}
                />
                <DeleteButton
                  tooltip={t('delete', { ns: 'common' })}
                  align="left"
                />
              </ActionGroup>
            </td>
          </AnimalRow>
        ))
      ) : (
        <tr>
          <NoResult colSpan="8">
            {t('noResults', { ns: 'animal' })} 🐾
          </NoResult>
        </tr>
      )}
      </tbody>
    </Table>
  );
}

const TierInfoCell = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const AnimalRow = styled.tr`
  border-bottom: 1px solid var(--color-white);

  &:hover {
    background: var(--color-white);
  }

  td {
    padding: 12px 15px;
  }
`;

const ActionGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const NoResult = styled.td`
  text-align: center;
  padding: 20px;
`;