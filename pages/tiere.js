import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";

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
import ResultsInfo from "../components/page-structure/Elements/ResultsInfo";
import { translations } from "../utils/translations";
import { AnimalService } from "../services/AnimalService";
import { SortIcon } from "../components/icons/SortIcon";
import { calculateTotalXP } from "../services/AnimalService";

import {
  TableFrame,
  Table,
  SortableTh,
  DesktopOnlyTh,
  DesktopOnlyTd,
  RightAlignedTd,
  RightAlignedSortableTh,
  StyledTh
} from "../components/page-structure/Elements/ZooTableElements";
import { TierThumbnail } from "../components/icons/TierThumbnail";
import Link from "next/link";


export default function TiereUebersicht() {
  const [sortBy, setSortBy] = useState("name");
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
  const router = useRouter();

  useEffect(() => {
    
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

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePrev = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));

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
          <Table>
            <thead>
              <tr>
                <SortableTh
                  onClick={() => toggleSort("name")}
                >
                  {translationsAnimals.tableSpecies}
                  <SortIcon
                    columnKey="name"
                    currentSortBy={sortBy}
                    direction={sortDirection}
                  />
                </SortableTh>

                <SortableTh
                  onClick={() => toggleSort("gehege.name")}
                >
                  {translationsAnimals.tableEnclosure}
                  <SortIcon
                    columnKey="gehege.name"
                    currentSortBy={sortBy}
                    direction={sortDirection}
                  />
                </SortableTh>

                <RightAlignedSortableTh
                  onClick={() => toggleSort("preis")}
                >
                  {translationsAnimals.tablePrice}
                  <SortIcon
                    columnKey="preis"
                    currentSortBy={sortBy}
                    direction={sortDirection}
                  />
                </RightAlignedSortableTh>

                <StyledTh
                  onClick={() => toggleSort("stalllevel")}
                >
                  <Tooltip
                    text={translationsAnimals.tooltipLevel}
                  >
                    {translationsAnimals.tableStall}
                  </Tooltip>
                  <SortIcon
                    columnKey="stalllevel"
                    currentSortBy={sortBy}
                    direction={sortDirection}
                  />
                </StyledTh>

                <DesktopOnlyTh
                  onClick={() => toggleSort("xp")}
                >
                  <Tooltip
                    text={translationsAnimals.tooltipXP}
                  >
                    XP
                  </Tooltip>
                  <SortIcon
                    columnKey="xp"
                    currentSortBy={sortBy}
                    direction={sortDirection}
                  />
                </DesktopOnlyTh>

                <DesktopOnlyTh
                  onClick={() => toggleSort("verkaufswert")}
                >
                  <Tooltip
                    text={translationsAnimals.tooltipVerkaufswert}
                  >
                    {translationsAnimals.tableSell}
                  </Tooltip>
                  <SortIcon
                    columnKey="verkaufswert"
                    currentSortBy={sortBy}
                    direction={sortDirection}
                  />
                </DesktopOnlyTh>

                <DesktopOnlyTh
                  onClick={() => toggleSort("auswildern")}
                >
                  <Tooltip
                    text={translationsAnimals.tooltipAuswildern}
                  >
                    {translationsAnimals.tableRelease}
                  </Tooltip>
                  <SortIcon
                    columnKey="auswildern"
                    currentSortBy={sortBy}
                    direction={sortDirection}
                  />
                </DesktopOnlyTh>

                <ActionText>
                  {translationsCommon.actions}
                </ActionText>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((tier) => (
                  <AnimalRow
                    key={tier.id}
                    onClick={() => router.push(`/tiere/${tier.id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>
                      <TierInfoCell>
                        <TierThumbnail
                          $type={tier.gehege?.name}
                        >
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
                      <Tooltip
                        text={`${tier.gehege.name} Gehege`}
                      >
                        <GehegeBadge
                          type={tier.gehege?.name}
                        />
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
                        label={calculateTotalXP(tier)}
                      />
                    </DesktopOnlyTd>
                    <DesktopOnlyTd>
                      <ZoodollarIcon
                        value={tier.verkaufswert}
                      />
                    </DesktopOnlyTd>
                    <DesktopOnlyTd>
                      <XPIcon
                        label={tier.auswildern}
                      />
                    </DesktopOnlyTd>
                    <td>
                      <ActionGroup onClick={(e) => e.stopPropagation()}>
                        <EditButton
                          tooltip={translationsAnimals.editAnimal}
                        />
                        <DeleteButton
                          tooltip={translationsAnimals.deleteAnimal}
                          align="left"
                        />
                      </ActionGroup>
                    </td>
                  </AnimalRow>
                ))
              ) : (
                <tr>
                  <NoResult colSpan="8">
                    {translationsAnimals.noResults} 🐾
                  </NoResult>
                </tr>

              )}
            </tbody>
          </Table>
        </TableFrame>
      ) : (
        <EmptyState
          title={translationsAnimals.emptyTitle}
          message={translationsAnimals.emptyMessage}
          buttonText={translationsAnimals.emptyButton}
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