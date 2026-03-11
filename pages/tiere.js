import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";

import XPIcon from "../components/icons/XPIcon";
import PriceDisplay from "../components/icons/PriceDisplay";
import ZoodollarIcon from "../components/icons/ZoodollarIcon";
import GameIcon from "../components/icons/GameIcon";
import EditButton from "../components/icons/EditIcon";
import DeleteButton from "../components/icons/DeleteIcon";
import PageHeader from "../components/page-structure/PageHeader";
import PageWrapper from "../components/page-structure/PageWrapper";
import LoadingWrapper from "../components/page-structure/Elements/LoadingWrapper";
import { NameDE } from "../components/page-structure/Elements/Name";
import FilterBar from "../components/page-structure/Elements/FilterBar";
import Tooltip from "../components/ui/Tooltip";
import EmptyState from "../components/page-structure/Elements/EmptyState";
import PaginationSignpost from "../components/ui/PaginationSignpost";
import StallLevelBadge from "../components/page-structure/Elements/StallLevelBadge";
import GehegeBadge from "../components/page-structure/Elements/GehegeBadge";
import { habitatColors } from "../utils/habitatConstants";
import ResultsInfo from "../components/page-structure/Elements/ResultsInfo";
import { translations } from "../utils/translations";
import { AnimalService } from "../services/AnimalService";
import { SortIcon } from "../components/icons/SortIcon";
import { calculateTotalXP } from "../services/AnimalService";


export default function TiereUebersicht() {
  const [sortBy, setSortBy] = useState("name"); // Standard: Name
  const [sortDirection, setSortDirection] = useState("asc");

  const [lang, setLang] = useState("de");
  const translationsAnimals = translations[lang].animals;
  const translationsCommon = translations[lang].common;

  const [tiere, setTiere] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGehege, setSelectedGehege] = useState("Alle");
  const [selectedLevel, setSelectedLevel] = useState("Alle");

  const itemsPerPage = 10;

  useEffect(() => {
    // Daten von der API abrufen
    fetch("/api/tiere")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setTiere(data);
        } else {
          console.error("Erwartete Array, erhielt:", data);
          setTiere([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fehler beim Laden:", err);
        setTiere([]);
        setLoading(false);
      });
  }, []);

  const filteredTiere = useMemo(() => {
    return AnimalService.filterAnimals(tiere, {
      searchTerm,
      selectedGehege,
      selectedLevel
    });
  }, [tiere, searchTerm, selectedGehege, selectedLevel]);

  const sortedTiere = useMemo(() => {
    return AnimalService.sortAnimals(filteredTiere, { sortBy, sortDirection });
  }, [filteredTiere, sortBy, sortDirection]);

  const currentItems = useMemo(() => {
    return AnimalService.paginate(sortedTiere, currentPage, itemsPerPage);
  }, [sortedTiere, currentPage]);

  const totalPages = Math.ceil(filteredTiere.length / itemsPerPage);

  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(totalPages);
  }

  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  if (loading) {
    return <LoadingWrapper>{translationsAnimals.searchPlaceholder} 🐾</LoadingWrapper>;
  }

  const toggleSort = (key) => {
    if (sortBy === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortDirection("asc");
    }
  };

  return (
    <PageWrapper>
      <PageHeader />

      <FilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedGehege={selectedGehege}
        setSelectedGehege={setSelectedGehege}
        selectedLevel={selectedLevel}
        setSelectedLevel={setSelectedLevel}
        setCurrentPage={setCurrentPage}
        tiere={tiere}
        translation={translationsAnimals}
      />

      <ResultsInfo
        currentCount={currentItems.length}
        totalCount={filteredTiere.length}
        labelShown={translationsCommon.resultsShow}
        labelOf={translationsCommon.resultsOf}
        labelUnit={translationsAnimals.resultsUnit}
      />

      {currentItems.length > 0 ? (
        <TableFrame>
          <ZooTable>
            <thead>
              <tr>
                <SortableTh onClick={() => toggleSort("name")}>
                  {translationsAnimals.tableSpecies}
                  <SortIcon columnKey="name" currentSortBy={sortBy} direction={sortDirection} />
                </SortableTh>

                <SortableTh onClick={() => toggleSort("gehege.name")}>
                  {translationsAnimals.tableEnclosure}
                  <SortIcon columnKey="gehege.name" currentSortBy={sortBy} direction={sortDirection} />
                </SortableTh>

                <RightAlignedSortableTh onClick={() => toggleSort("preis")}>
                  {translationsAnimals.tablePrice}
                  <SortIcon columnKey="preis" currentSortBy={sortBy} direction={sortDirection} />
                </RightAlignedSortableTh>

                <StyledTh onClick={() => toggleSort("stalllevel")}>
                  <Tooltip text="Welches Level wird für dieses Tier benötigt?">
                    {translationsAnimals.tableStall}
                  </Tooltip>
                  <SortIcon columnKey="stalllevel" currentSortBy={sortBy} direction={sortDirection} />
                </StyledTh>

                <DesktopOnlyTh onClick={() => toggleSort("xp")}>
                  <Tooltip text="XP insgesamt - Füttern, Putzen, Spielen">
                    XP
                  </Tooltip>
                  <SortIcon columnKey="xp" currentSortBy={sortBy} direction={sortDirection} />
                </DesktopOnlyTh>

                <DesktopOnlyTh onClick={() => toggleSort("verkaufswert")}>
                  <Tooltip text="Preis beim Verkaufen des Tieres">
                    {translationsAnimals.tableSell}
                  </Tooltip>
                  <SortIcon columnKey="verkaufswert" currentSortBy={sortBy} direction={sortDirection} />
                </DesktopOnlyTh>

                <DesktopOnlyTh onClick={() => toggleSort("auswildern")} style={{cursor: 'pointer'}}>
                  <Tooltip text="XP beim Auswildern des Tieres">
                    {translationsAnimals.tableRelease}
                  </Tooltip>
                  <SortIcon columnKey="auswildern" currentSortBy={sortBy} direction={sortDirection} />
                </DesktopOnlyTh>

                <th style={{ textAlign: "center" }}>
                  {translationsCommon.actions}
                </th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((tier) => (
                  <AnimalRow key={tier.id}>
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
                      <Tooltip text={`${tier.gehege.name} Gehege`}>
                        <GehegeBadge type={tier.gehege?.name} />
                      </Tooltip>
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
                      <XPIcon label={AnimalService.calculateTotalXP(tier)} />
                    </DesktopOnlyTd>
                    <DesktopOnlyTd>
                      <ZoodollarIcon value={tier.verkaufswert} />
                    </DesktopOnlyTd>
                    <DesktopOnlyTd>
                      <XPIcon label={tier.auswildern} />
                    </DesktopOnlyTd>
                    <td>
                      <ActionGroup>
                        <EditButton tooltip="Tier bearbeiten" />
                        <DeleteButton tooltip="Tier löschen" align="left" />
                      </ActionGroup>
                    </td>
                  </AnimalRow>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    style={{ textAlign: "center", padding: "20px" }}
                  >
                    {translationsAnimals.noResults} 🐾
                  </td>
                </tr>
              )}
            </tbody>
          </ZooTable>
        </TableFrame>
      ) : (
        <EmptyState
          title="Oje, kein Tier da!"
          message="Uppy hat überall gesucht, konnte aber nichts finden."
          buttonText="Suche neu starten"
          onReset={() => {
            setSearchTerm("");
            setSelectedGehege("Alle");
            setSelectedLevel("Alle");
            setCurrentPage(1);
          }}
        />
      )}

      {totalPages > 1 && (
        <PaginationSignpost
          currentPage={currentPage}
          totalPages={totalPages}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}
    </PageWrapper>
  );
}

const TableFrame = styled.div`
  background: white;
  border: 2px solid #4ca64c;
  border-radius: var(--border-radius);
  overflow: visible;
  position: relative;
`;

const ZooTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  min-width: 600px;

  th:first-child {
    border-top-left-radius: calc(var(--border-radius) - 2px);
  }

  th:last-child {
    border-top-right-radius: calc(var(--border-radius) - 2px);
  }

  tr:last-child td:first-child {
    border-bottom-left-radius: calc(var(--border-radius) - 2px);
  }

  tr:last-child td:last-child {
    border-bottom-right-radius: calc(var(--border-radius) - 2px);
  }

  th {
    background: #f9fbf9;
    padding: 15px;
    text-align: left;
    color: #4ca64c;
    border-bottom: 2px solid #eef2ee;
  }
`;

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

const TierThumbnail = styled.div`
  position: relative;
  width: 55px;
  height: 55px;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  border: 3px solid
    ${(props) => habitatColors[props.$type?.toLowerCase()]?.main || "#8dbd5b"};

  transition: all 0.2s ease-in-out;
  cursor: pointer;
  z-index: 1;

  &:hover {
    transform: scale(1.5);
    z-index: 10;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  }

  img {
    display: block;
    width: 100%;
    height: auto;
    object-fit: contain;
  }
`;


const DesktopOnlyTd = styled.td`
  text-align: right;
  padding-right: 20px !important;

  @media (max-width: 1024px) {
    display: none;
  }
`;

const ActionGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const RightAlignedTd = styled.td`
  text-align: right;
`;

const SortableTh = styled.th`
  cursor: pointer;
  user-select: none;
  transition: background-color 0.2s;
  white-space: nowrap;

  &:hover {
    background-color: rgba(76, 166, 76, 0.05);
    color: #2d5a27;
  }
`;

const RightAlignedSortableTh = styled(SortableTh)`
  text-align: right;
`;

// Desktop-Only übernimmt jetzt die Sortier-Styles
const DesktopOnlyTh = styled(SortableTh)`
  @media (max-width: 768px) {
    display: none;
  }
`;

// Wenn du ein StyledTh hast, lass es auch von SortableTh erben
const StyledTh = styled(SortableTh)`
  /* Deine zusätzlichen Styles für normale Spalten */
`;