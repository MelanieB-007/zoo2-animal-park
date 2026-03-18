import React from "react";
import styled from "styled-components";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";


import { SortIcon } from "../icons/SortIcon";
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
import SortableTableHeader from "../page-structure/Table/SortableTableHeader";
import ActionsHeadline from "../page-structure/Table/ActionsHeadline";


export default function AnimalDesktopTable({
  animals,
  sortBy,
  sortDirection,
  onSort,
}) {
  const { t, i18n } =  /** @type {any} */(useTranslation(["animals", "common"]));
  const router = useRouter();

  return (
    <DesktopView>
      <TableFrame>
        <Table>
          <thead>
            <tr>
              <SortableTableHeader
                text={t("animals:table.species")}
                onSort={() => toggleSort("name")}
                columnKey="name"
                currentSortBy={sortBy}
                direction={sortDirection}
              />

              <SortableTableHeader
                text={t("animals:table.enclosure")}
                onSort={() => toggleSort("gehege.name")}
                columnKey="gehege.name"
                currentSortBy={sortBy}
                direction={sortDirection}
              />

              <SortableTableHeader
                text={t("animals:table.price")}
                onSort={() => toggleSort("preis")}
                columnKey="preis"
                currentSortBy={sortBy}
                direction={sortDirection}
                align="right"
              />

              <SortableTableHeader
                text= {t("animals:table.stall")}
                onSort={() => toggleSort("stalllevel")}
                columnKey="stalllevel"
                currentSortBy={sortBy}
                direction={sortDirection}
                tooltipText={t("animals:tooltips.level")}
              />

              <SortableTableHeader
                text="XP"
                tooltipText={t("animals:tooltips.xp")}
                onSort={() => toggleSort("xp")}
                columnKey="xp"
                currentSortBy={sortBy}
                direction={sortDirection}
                desktopOnly={true}
              />

              <SortableTableHeader
                text={t("animals:table.sell")}
                tooltipText={t("animals:tooltips.sell")}
                onSort={() => toggleSort("verkaufswert")}
                columnKey="verkaufswert"
                currentSortBy={sortBy}
                direction={sortDirection}
                desktopOnly={true}
                align="right"
              />

              <SortableTableHeader
                text={t("animals:table.release")}
                tooltipText={t("animals:tooltips.release")}
                onSort={() => toggleSort("auswildern")}
                columnKey="auswildern"
                currentSortBy={sortBy}
                direction={sortDirection}
                desktopOnly={true}
                align="right"
              />

              <ActionsHeadline
                text ={t("common:actions")}
              />
            </tr>
          </thead>
          <tbody>
            {animals.length > 0 ? (
              animals.map((animal) => {

                const displayName =
                  i18n.language === "en"
                    ? animal.name_en || animal.name
                    : animal.name || animal.name_en;

                return (
                  <AnimalRow
                    key={animal.id}
                    onClick={() => router.push(`/tiere/${animal.id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>
                      <TierInfoCell>
                        <TierThumbnail $type={animal.gehege?.name}>
                          <GameIcon
                            type={`tiere/${(animal.gehege?.name || "standard").toLowerCase()}`}
                            fileName={animal.bild || "default.jpg"}
                            bordercolor="transparent"
                          />
                        </TierThumbnail>
                        <div>
                          <NameDE>{displayName}</NameDE>
                        </div>
                      </TierInfoCell>
                    </td>

                    <td>
                      <Tooltip
                        text={`${animal.gehege?.name} ${t("animals:table.enclosure")}`}
                      >
                        <GehegeBadge type={animal.gehege?.name} />
                      </Tooltip>
                    </td>

                    <RightAlignedTd>
                      <PriceDisplay
                        value={animal.preis}
                        type={animal.preisart?.name.toLowerCase() || "gold"}
                      />
                    </RightAlignedTd>

                    <td>
                      <Tooltip
                        text={`${t("animals:tooltips.level")}: ${animal.stalllevel}`}
                        position="bottom"
                      >
                        <StallLevelBadge
                          level={animal.stalllevel}
                          habitat={animal.gehege?.name}
                        />
                      </Tooltip>
                    </td>

                    <DesktopOnlyTd>
                      <XPIcon label={calculateTotalXP(animal)} />
                    </DesktopOnlyTd>

                    <DesktopOnlyTd>
                      <ZoodollarIcon value={animal.verkaufswert} />
                    </DesktopOnlyTd>
                    <DesktopOnlyTd>
                      <XPIcon label={animal.auswildern} />
                    </DesktopOnlyTd>
                    <td>
                      <ActionGroup onClick={(e) => e.stopPropagation()}>
                        <EditButton tooltip={t("animals:tooltips.edit")} />
                        <DeleteButton
                          tooltip={t("animals:tooltips.delete")}
                          align="left"
                        />
                      </ActionGroup>
                    </td>
                  </AnimalRow>
                );
              })
            ) : (
              <tr>
                <NoResult colSpan="8">{t("animals:empty.title")} 🐾</NoResult>
              </tr>
            )}
          </tbody>
        </Table>
      </TableFrame>
    </DesktopView>
  );
}

const TierInfoCell = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const AnimalRow = styled.tr`
  border-bottom: 1px solid #eee;

  &:hover {
    background: #f0fff0;
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

const DesktopView = styled.div`
  display: block;
  @media (max-width: 1024px) {
    display: none;
  }
`;

export const TableFrame = styled.div`
  background: var(--color-white);
  border: 2px solid var(--color-green);
  border-radius: var(--border-radius);
  overflow: visible;
  position: relative;
  margin-top: 10px;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  min-width: 600px;

  th {
    background: var(--color-white);
    padding: 15px;
    text-align: left;
    color: var(--color-green);
    border-bottom: 2px solid var(--color-white);
  }

  td {
    padding: 12px 15px;
    border-bottom: 1px solid var(--color-white);
  }

  tr:hover td {
    background: var(--color-white);
  }

  /* Abrundung der Ecken */
  th:first-child { border-top-left-radius: calc(var(--border-radius) - 2px); }
  th:last-child { border-top-right-radius: calc(var(--border-radius) - 2px); }
  tr:last-child td:first-child { border-bottom-left-radius: calc(var(--border-radius) - 2px); }
  tr:last-child td:last-child { border-bottom-right-radius: calc(var(--border-radius) - 2px); }
`;

export const RightAlignedTd = styled.td`
  text-align: right;
`;

export const DesktopOnlyTd = styled.td`
  text-align: right;
  padding-right: 20px !important;
  
  @media (max-width: 1024px) {
    display: none;
  }
`;