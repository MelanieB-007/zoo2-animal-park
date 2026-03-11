import React, { useEffect, useState } from "react";
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

const translations = {
  de: {
    searchPlaceholder: "Nach Tiernamen suchen...",
    allEnclosures: "Alle Gehege",
    allLevels: "Alle Stall-Level",
    level: "Level",
    resultsShow: "Zeige",
    resultsOf: "von",
    resultsAnimals: "Tieren",
    tableSpecies: "Tierart",
    tableEnclosure: "Gehege",
    tablePrice: "Preis",
    tableStall: "Stall-Level",
    tableSell: "Verkauf",
    tableRelease: "Auswil-derung",
    actions: "Aktionen",
    back: "ZURÜCK",
    next: "WEITER",
    loading: "Hole die Tiere aus dem Stall...",
    noResults: "Kein Tier mit diesem Namen gefunden...",
  },
  en: {
    searchPlaceholder: "Search for animal names...",
    allEnclosures: "All Enclosures",
    allLevels: "All Stall Levels",
    level: "Level",
    resultsShow: "Showing",
    resultsOf: "of",
    resultsAnimals: "animals",
    tableSpecies: "Species",
    tableEnclosure: "Enclosure",
    tablePrice: "Price",
    tableStall: "Stall Level",
    tableSell: "Sell",
    tableRelease: "Release",
    actions: "Actions",
    back: "BACK",
    next: "NEXT",
    loading: "Getting animals from the shelter...",
    noResults: "No animal found with this name...",
  },
};

export default function TiereUebersicht() {
  const [lang, setLang] = useState("de");
  const [tiere, setTiere] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGehege, setSelectedGehege] = useState("Alle");
  const [selectedLevel, setSelectedLevel] = useState("Alle");
  const itemsPerPage = 10;

  const t = translations[lang];

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

  // Filtern basierend auf der Suche
  const filteredTiere = (tiere || []).filter((tier) => {
    const matchesSearch = tier.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesGehege =
      selectedGehege === "Alle" || tier.gehege?.name === selectedGehege;
    const matchesLevel =
      selectedLevel === "Alle" || String(tier.stalllevel) === selectedLevel;

    return matchesSearch && matchesGehege && matchesLevel;
  });

  const totalPages = Math.ceil(filteredTiere.length / itemsPerPage);

  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(totalPages);
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTiere.slice(indexOfFirstItem, indexOfLastItem);

  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  if (loading) {
    return <LoadingWrapper>{t.searchPlaceholder} 🐾</LoadingWrapper>;
  }

  return (
    <PageWrapper>
      <PageHeader />

      <FilterBar>
        <SearchInput
          type="text"
          placeholder={t.searchPlaceholder}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />

        <GehegeSelect
          value={selectedGehege}
          onChange={(e) => {
            setSelectedGehege(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="Alle">
            {t.allEnclosures} ({tiere.length})
          </option>

          {[...new Set(tiere.map((t) => t.gehege?.name))]
            .filter(Boolean)
            .map((name) => {
              const count = tiere.filter((t) => t.gehege?.name === name).length;

              return (
                <option key={name} value={name}>
                  {name} ({count})
                </option>
              );
            })}
        </GehegeSelect>

        <GehegeSelect
          value={selectedLevel}
          onChange={(e) => {
            setSelectedLevel(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="Alle">{t.allLevels}</option>
          {[...new Set(tiere.map((t) => t.stalllevel))]
            .filter((lvl) => lvl !== undefined && lvl !== null)
            .sort((a, b) => a - b)
            .map((lvl) => (
              <option key={lvl} value={String(lvl)}>
                Level {lvl}
              </option>
            ))}
        </GehegeSelect>
      </FilterBar>

      <ResultsInfo>
        {t.resultsShow} <strong>{currentItems.length}</strong> {t.resultsOf}
        <strong> {filteredTiere.length}</strong> {t.resultsAnimals}
      </ResultsInfo>

      {currentItems.length > 0 ? (
        <TableFrame>
          <ZooTable>
            <thead>
              <tr>
                <th>{t.tableSpecies}</th>
                <th>{t.tableEnclosure}</th>
                <RightAlignedTh>{t.tablePrice}</RightAlignedTh>
                <StyledTh>
                  <Tooltip text="Welches Level wird für dieses Tier benötigt?">
                    {t.tableStall}
                  </Tooltip>
                </StyledTh>
                <DesktopOnlyTh>
                  <Tooltip text="XP insgesamt - Füttern, Putzen, Spielen">
                    XP
                  </Tooltip>
                </DesktopOnlyTh>
                <DesktopOnlyTh>
                  <Tooltip text="Preis beim Verkaufen des Tieres">
                    {t.tableSell}
                  </Tooltip>
                </DesktopOnlyTh>
                <DesktopOnlyTh>
                  <Tooltip text="XP beim Auswildern des Tieres">
                    {t.tableRelease}
                  </Tooltip>
                </DesktopOnlyTh>
                <th style={{ textAlign: "center" }}>{t.actions}</th>
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
                      <XPIcon
                        label={
                          (tier.xpfuettern || 0) +
                          (tier.xpspielen || 0) +
                          (tier.xpputzen || 0)
                        }
                      />
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
                    {t.noResults} 🐾
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

const DesktopOnlyTh = styled.th`
  text-align: right !important;
  padding-right: 20px !important;

  @media (max-width: 1024px) {
    display: none;
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

const SearchInput = styled.input`
  width: 100%;
  max-width: 400px;
  padding: 12px 16px;
  font-size: 1rem;
  border: 2px solid #e0e7d5;
  border-radius: 12px;
  background-color: white;
  color: #333;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  &:focus {
    outline: none;
    border-color: #8dbd5b;
    box-shadow: 0 0 0 4px rgba(141, 189, 91, 0.1);
    transform: translateY(-1px);
  }

  &::placeholder {
    color: #a0a0a0;
  }
`;

const GehegeSelect = styled.select`
  padding: 12px 40px 12px 16px;
  font-size: 1rem;
  border: 2px solid #e0e7d5;
  border-radius: 12px;
  background-color: white;
  color: #333;
  cursor: pointer;
  min-width: 220px;
  transition: all 0.2s;

  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%238dbd5b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;

  &:focus {
    outline: none;
    border-color: #8dbd5b;
    box-shadow: 0 0 0 4px rgba(141, 189, 91, 0.1);
  }
`;

const ResultsInfo = styled.p`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto 10px auto;
  padding: 0 10px;
  font-size: 0.9rem;
  color: #666;
  font-family: "Inter", sans-serif;

  strong {
    color: #2d5a27;
  }
`;

const RightAlignedTh = styled.th`
  text-align: right !important;
  width: 120px;
  padding-right: 20px !important;
`;

const RightAlignedTd = styled.td`
  text-align: right;
`;

const StyledTh = styled.th`
  position: relative;
  overflow: visible !important;
  z-index: 1;
`;
