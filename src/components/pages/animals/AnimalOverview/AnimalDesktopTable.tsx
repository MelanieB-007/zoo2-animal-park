import React from "react";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";

// Tabellen-Struktur
import TableContainer from "@/components/pageStructure/table/TableContainer";
import Table from "@/components/pageStructure/table/Table";
import SortableTableHeader from "@/components/pageStructure/table/SortableTableHeader";
import DesktopOnlyTd from "@/components/pageStructure/table/DesktopOnlyTd";
import RightAlignedTd from "@/components/pageStructure/table/RightAlignedTd";
import InfoCell from "@/components/pageStructure/table/TableInfoCell";
import LinkedRow from "@/components/pageStructure/table/TableLinkedRow";
import TableNoResult from "@/components/pageStructure/table/TableNoResult";

// Utils & Typen
import { AnimalWithRelations } from "@/interfaces/animal";
import { calculateTotalXP } from "@/utils/AnimalHelper";

import BiomeBadge from "@/components/pageStructure/ui/BiomeBadge";
import StallLevelBadge from "@/components/pageStructure/ui/StallLevelBadge";
import PriceDisplay from "@/components/pageStructure/ui/PriceDisplay";

import ZoodollarIcon from "@/components/icons/ZoodollarIcon";
import XPIcon from "@/components/icons/XPIcon";
import ItemThumbnail from "@/components/pageStructure/ui/ItemThumbnail";
import ActionGroup from "@/components/pageStructure/ui/ActionGroup";
import ActionsHeadline from "@/components/pageStructure/ui/ActionsHeadline";


interface AnimalDesktopTableProps {
  animals: AnimalWithRelations[];
  sortBy: string;
  sortDirection: "asc" | "desc";
  onSort: (column: string) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function AnimalDesktopTable({
  animals,
  sortBy,
  sortDirection,
  onSort,
  onEdit,
  onDelete,
}: AnimalDesktopTableProps) {
  const t = useTranslations();
  const { data: session } = useSession();

  // Rollen-Check für Admin-Aktionen
  const isAdmin = session?.user?.role === "Direktor";

  return (
    <TableContainer>
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

            {isAdmin && <ActionsHeadline text={t("common:actions")} />}
          </tr>
        </thead>
        <tbody>
          {animals.length > 0 ? (
            animals.map((animal) => (
              <LinkedRow key={animal.id} path={`/animals/${animal.id}`}>
                <td>
                  <InfoCell>
                    <ItemThumbnail
                      image={animal.bild}
                      name={animal.name}
                      habitat={{ name: animal.gehege?.name || "standard" }}
                      category={`tiere/${(animal.gehege?.name || "standard").toLowerCase()}`}
                    />
                    <div>
                      <strong>{animal.name}</strong>
                    </div>
                  </InfoCell>
                </td>

                <td>
                  <BiomeBadge biome={animal.gehege} showTooltip={false} />
                </td>

                <RightAlignedTd>
                  <PriceDisplay
                    value={animal.preis}
                    type={animal.preisart?.name.toLowerCase() || "gold"}
                  />
                </RightAlignedTd>

                <td>
                  <StallLevelBadge
                    level={animal.stalllevel}
                    habitat={animal.gehege?.name}
                    showTooltip={false}
                    size={45}
                  />
                </td>

                <DesktopOnlyTd>
                  <XPIcon label={calculateTotalXP(animal).toString()} />
                </DesktopOnlyTd>

                <DesktopOnlyTd>
                  <ZoodollarIcon value={animal.verkaufswert} />
                </DesktopOnlyTd>

                <DesktopOnlyTd>
                  <XPIcon label={animal.auswildern?.toString() || "0"} />
                </DesktopOnlyTd>

                {isAdmin && (
                  <td onClick={(e) => e.stopPropagation()}>
                    <ActionGroup
                      localeFile="animals"
                      onEdit={() => onEdit(animal.id)}
                      onDelete={() => onDelete(animal.id)}
                    />
                  </td>
                )}
              </LinkedRow>
            ))
          ) : (
            <TableNoResult text={`${t("animals:empty.title")} 🐾`} />
          )}
        </tbody>
      </Table>
    </TableContainer>
  );
}