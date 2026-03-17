import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";


import PageHeader from "../../components/page-structure/PageHeader";
import PageWrapper from "../../components/page-structure/PageWrapper";
import LoadingWrapper from "../../components/page-structure/Elements/LoadingWrapper";
import FilterBar from "../../components/page-structure/Elements/FilterBar";
import EmptyState from "../../components/page-structure/Elements/EmptyState";
import PaginationSignpost from "../../components/ui/PaginationSignpost";
import ResultsInfo from "../../components/page-structure/Elements/ResultsInfo";
import { AnimalService } from "../../services/AnimalService";
import AnimalMobileCard from "../../components/AnimalOverview/AnimalMobileCard";
import AnimalDesktopTable from "../../components/AnimalOverview/AnimalDesktopTable";

export default function TiereUebersicht() {
  const { t, i18n } = /** @type {any} */ (useTranslation(['animals', 'common']));
  const router = useRouter();
  const currentLang = i18n.language; // 'de' oder 'en'

  const [sortBy, setSortBy] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");

  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGehege, setSelectedGehege] = useState("Alle");
  const [selectedLevel, setSelectedLevel] = useState("Alle");

  const itemsPerPage = 10;

  useEffect(() => {
    fetch("/api/tiere")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setAnimals(data);
        } else {
          console.error("Erwartete Array, erhielt:", data);
          setAnimals([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fehler beim Laden:", err);
        setAnimals([]);
        setLoading(false);
      });
  }, []);

  const filteredTiere = useMemo(() => {
    return AnimalService.filterAnimals(animals, {
      searchTerm,
      selectedGehege,
      selectedLevel,
    });
  }, [animals, searchTerm, selectedGehege, selectedLevel]);

  const sortedTiere = useMemo(() => {
    return AnimalService.sortAnimals(filteredTiere, { sortBy, sortDirection });
  }, [filteredTiere, sortBy, sortDirection]);

  const currentItems = useMemo(() => {
    return AnimalService.paginate(sortedTiere, currentPage, itemsPerPage);
  }, [sortedTiere, currentPage]);

  const animalName = currentLang === 'en' ? currentItems.name_en : currentItems.name;

  const totalPages = Math.ceil(filteredTiere.length / itemsPerPage);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  if (loading) {
    return (
      <LoadingWrapper>
        {t('animals.search_placeholder')} 🐾
      </LoadingWrapper>
    );
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
      <PageHeader text="{t('animals.overview_title)}" />

      <FilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedGehege={selectedGehege}
        setSelectedGehege={setSelectedGehege}
        selectedLevel={selectedLevel}
        setSelectedLevel={setSelectedLevel}
        setCurrentPage={setCurrentPage}
        animals={animals}
      />

      <ResultsInfo
        currentCount={currentItems.length}
        totalCount={filteredTiere.length}
        labelShown={translationsCommon.resultsShow}
        labelOf={translationsCommon.resultsOf}
        labelUnit={translationsAnimals.resultsUnit}
      />

      {currentItems.length > 0 ? (
        <>
          {/* DESKTOP TABELLE */}
          <AnimalDesktopTable
            animals={currentItems}
            sortBy={sortBy}
            sortDirection={sortDirection}
            onSort={toggleSort}
          />

          {/* MOBILE CARDS */}
          <MobileView>
            {currentItems.map((animal) => (
              <AnimalMobileCard
                key={animal.id}
                tier={animal}
                translations={translationsAnimals}
                onClick={() =>
                  router.push(`/tiere/${animal.id}`)}
              />
            ))}
          </MobileView>
        </>
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

const MobileView = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: block;
    padding: 0 10px;
  }
`;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "animals"])),
    },
  };
}