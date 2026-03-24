import { useTranslation } from "next-i18next";
import React from "react";

import Table from "../../page-structure/Table/Table";
import SortableTableHeader from "../../page-structure/Table/SortableTableHeader";

import InfoCell from "../../page-structure/Table/InfoCell";
import AnimalThumbnail from "../../page-structure/icons/ItemThumbnail";
import { NameDE } from "../../page-structure/Elements/Name";
import LinkedRow from "../../page-structure/Table/LinkedRow";
import NoResult from "../../page-structure/Table/NoResult";
import GehegeBadge from "../../ui/GehegeBadge";
import StallLevelBadge from "../../ui/StallLevelBadge";
import ItemThumbnail from "../../page-structure/icons/ItemThumbnail";

export default function StatueDesktopTable({
  statues,
  sortBy,
  sortDirection,
  onSort,
}) {
  const { t } = /** @type {any} */ (useTranslation(["animals", "common"]));

  return (
    <Table>
      <thead>
        <tr>
          {/* 1. Statuen-Bild & Tiername */}
          <SortableTableHeader
            text={t("animals:statues.species")}
            onSort={() => onSort("tier.name")}
            columnKey="tier.name"
            currentSortBy={sortBy}
            sortDirection={sortDirection}
          />

          {/* 2. Gehege */}
          <SortableTableHeader
            text={t("animals:table.enclosure")}
            onSort={() => onSort("tier.gehege.name")}
            columnKey="gehege.name"
            currentSortBy={sortBy}
            sortDirection={sortDirection}
          />

          {/* 3. Stalllevel */}
          <SortableTableHeader
            text={t("animals:table.stall")}
            onSort={() => onSort("tier.stalllevel")}
            columnKey="tier.stalllevel"
            currentSortBy={sortBy}
            sortDirection={sortDirection}
            tooltipText={t("animals:tooltips.level")}
          />
        </tr>
      </thead>

      <tbody>
        {statues.length > 0 ? (
          statues.map((statue) => {
            const tier = statue.tier;
            const tiername = tier?.texte?.[0]?.name || "Unbekannt";

            return (
              // <LinkedRow key={statue.id} path={`/statue/${statue.id}`}>
              <tr key={statue.id}>

                {/* Spalte 1: Bild der Statue + Tiername */}
                <td>
                  <InfoCell>
                    <ItemThumbnail
                      image={statue.bild}
                      name={tiername}
                      habitat={tier?.gehege}
                      category="statues"
                    />
                    <div>
                      <NameDE>{statue.name}</NameDE>
                    </div>
                  </InfoCell>
                </td>

                {/* Spalte 2: Gehege */}
                <td>
                  <GehegeBadge gehege={tier?.gehege} />
                </td>

                {/* Spalte 3: Stalllevel */}
                <td>
                  <StallLevelBadge
                    level={tier?.stalllevel}
                    habitat={gehege?.name}
                  />
                </td>
              </tr>
              //</LinkedRow>
            );
          })
        ) : (
          <NoResult text={`${t("statue:empty.title")} 🐾`} />
        )}
      </tbody>
    </Table>
  );
}
