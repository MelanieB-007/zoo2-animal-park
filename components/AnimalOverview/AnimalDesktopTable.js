import React from "react";
import { useTranslation } from "next-i18next";

import { NameDE } from "../page-structure/Elements/Name";
import GehegeBadge from "../page-structure/Elements/GehegeBadge";
import PriceDisplay from "../icons/PriceDisplay";
import StallLevelBadge from "../page-structure/Elements/StallLevelBadge";
import XPIcon from "../icons/XPIcon";
import { calculateTotalXP } from "../../services/AnimalService";
import ZoodollarIcon from "../icons/ZoodollarIcon";
import SortableTableHeader from "../page-structure/Table/SortableTableHeader";
import ActionsHeadline from "../page-structure/Table/ActionsHeadline";
import ActionGroupIcons from "../page-structure/Table/ActionGroupIcons";
import DesktopOnlyTd from "../page-structure/Table/DesktopOnlyTd";
import RightAlignedTd from "../page-structure/Table/RightAlignedTd";
import InfoCell from "../page-structure/Table/InfoCell";
import Table from "../page-structure/Table/Table";
import LinkedRow from "../page-structure/Table/LinkedRow";
import NoResult from "../page-structure/Table/NoResult";
import AnimalThumbnail from "../icons/AnimalThumbnail";
import { getTranslatedName } from "../ui/TranslationHelper";

export default function AnimalDesktopTable({
  animals,
  sortBy,
  sortDirection,
  onSort,
  onEdit,
  onDelete,
}) {
  const { t, i18n } = /** @type {any} */ (
    useTranslation(["animals", "common"])
  );

  return (
    <Table>
      <thead>
        <tr>
          <SortableTableHeader
            text={t("animals:table.species")}
            onSort={() => onSort("name")}
            columnKey="name"
            currentSortBy={sortBy}
            sortDirection={sortDirection}
          />

          <SortableTableHeader
            text={t("animals:table.enclosure")}
            onSort={() => onSort("gehege.name")}
            columnKey="gehege.name"
            currentSortBy={sortBy}
            sortDirection={sortDirection}
          />

          <SortableTableHeader
            text={t("animals:table.price")}
            onSort={() => onSort("preis")}
            columnKey="preis"
            currentSortBy={sortBy}
            sortDirection={sortDirection}
            align="right"
          />

          <SortableTableHeader
            text={t("animals:table.stall")}
            onSort={() => onSort("stalllevel")}
            columnKey="stalllevel"
            currentSortBy={sortBy}
            sortDirection={sortDirection}
            tooltipText={t("animals:tooltips.level")}
          />

          <SortableTableHeader
            text="XP"
            tooltipText={t("animals:tooltips.xp")}
            onSort={() => onSort("xp")}
            columnKey="xp"
            currentSortBy={sortBy}
            sortDirection={sortDirection}
            desktopOnly={true}
          />

          <SortableTableHeader
            text={t("animals:table.sell")}
            tooltipText={t("animals:tooltips.sell")}
            onSort={() => onSort("verkaufswert")}
            columnKey="verkaufswert"
            currentSortBy={sortBy}
            sortDirection={sortDirection}
            desktopOnly={true}
            align="right"
          />

          <SortableTableHeader
            text={t("animals:table.release")}
            tooltipText={t("animals:tooltips.release")}
            onSort={() => onSort("auswildern")}
            columnKey="auswildern"
            currentSortBy={sortBy}
            sortDirection={sortDirection}
            desktopOnly={true}
            align="right"
          />

          <ActionsHeadline text={t("common:actions")} />
        </tr>
      </thead>
      <tbody>
        {animals.length > 0 ? (
          animals.map((animal) => {
            const displayName = getTranslatedName(animal, i18n.language) ||
              t("animals:unknown_animal");

            return (
              <LinkedRow key={animal.id} path={`/animals/${animal.id}`}>
                <td>
                  <InfoCell>
                    <AnimalThumbnail animal={animal} />
                    <div>
                      <NameDE>{displayName}</NameDE>
                    </div>
                  </InfoCell>
                </td>

                <td>
                  <GehegeBadge
                    gehege={animal.gehege}
                  />
                </td>

                <RightAlignedTd>
                  <PriceDisplay
                    value={animal.preis}
                    type={animal.preisart?.name.toLowerCase() || "gold"}
                    altTextDiamond={t("common:payment:diamonds")}
                    altTextZoodollar={t("common:payment:zoodollar")}
                  />
                </RightAlignedTd>

                <td>
                  <StallLevelBadge
                    level={animal.stalllevel}
                    habitat={animal.gehege?.name}
                  />
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
                  <ActionGroupIcons
                    onEdit={function () {
                      onEdit(animal.id);
                    }}
                    onDelete={function () {
                      onDelete(animal.id);
                    }}
                  />
                </td>
              </LinkedRow>
            );
          })
        ) : (
          <NoResult text={`${t("animals:empty.title")} 🐾`} />
        )}
      </tbody>
    </Table>
  );
}
