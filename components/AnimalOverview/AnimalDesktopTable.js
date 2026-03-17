import React from "react";
import styled from "styled-components";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import {
  DesktopOnlyTd,
  DesktopOnlyTh,
  RightAlignedSortableTh,
  RightAlignedTd,
  SortableTh,
  StyledTh,
  Table,
  TableFrame,
} from "../page-structure/Elements/ZooTableElements";
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
              <SortableTh onClick={() => onSort("name")}>
                {t("animals:table.species")}
                <SortIcon
                  columnKey="name"
                  currentSortBy={sortBy}
                  direction={sortDirection}
                />
              </SortableTh>

              <SortableTh onClick={() => onSort("gehege.name")}>
                {t("animals:table.enclosure")}
                <SortIcon
                  columnKey="gehege.name"
                  currentSortBy={sortBy}
                  direction={sortDirection}
                />
              </SortableTh>

              <RightAlignedSortableTh onClick={() => onSort("preis")}>
                {t("animals:table.price")}
                <SortIcon
                  columnKey="preis"
                  currentSortBy={sortBy}
                  direction={sortDirection}
                />
              </RightAlignedSortableTh>

              <StyledTh onClick={() => onSort("stalllevel")}>
                <Tooltip text={t("animals:tooltips.level")}>
                  {t("animals:table.stall")}
                </Tooltip>
                <SortIcon
                  columnKey="stalllevel"
                  currentSortBy={sortBy}
                  direction={sortDirection}
                />
              </StyledTh>

              <DesktopOnlyTh onClick={() => onSort("xp")}>
                <Tooltip text={t("animals:tooltips.xp")}>XP</Tooltip>
                <SortIcon
                  columnKey="xp"
                  currentSortBy={sortBy}
                  direction={sortDirection}
                />
              </DesktopOnlyTh>

              <DesktopOnlyTh onClick={() => onSort("verkaufswert")}>
                <Tooltip text={t("animals:tooltips.sell")}>
                  {t("animals:table.sell")}
                </Tooltip>
                <SortIcon
                  columnKey="verkaufswert"
                  currentSortBy={sortBy}
                  direction={sortDirection}
                />
              </DesktopOnlyTh>

              <DesktopOnlyTh onClick={() => onSort("auswildern")}>
                <Tooltip text={t("animals:tooltips.release")}>
                  {t("animals:table.release")}
                </Tooltip>
                <SortIcon
                  columnKey="auswildern"
                  currentSortBy={sortBy}
                  direction={sortDirection}
                />
              </DesktopOnlyTh>

              <ActionText>{t("common:actions")}</ActionText>
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
                          habitatName={animal.gehege?.name}
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

const ActionText = styled.th`
  text-align: center;
`;

const NoResult = styled.td`
  text-align: center;
  padding: 20px;
`;

const DesktopView = styled.div`
  display: block;
  @media (max-width: 768px) {
    display: none;
  }
`;
