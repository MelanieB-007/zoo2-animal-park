import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import { useTranslation } from 'next-i18next';

import PageHeader from "../components/page-structure/PageHeader";
import PageWrapper from "../components/page-structure/PageWrapper";
import FilterBar from "../components/page-structure/Elements/FilterBar";
import EmptyState from "../components/page-structure/Elements/EmptyState";
import PaginationSignpost from "../components/ui/PaginationSignpost";
import ResultsInfo from "../components/page-structure/Elements/ResultsInfo";
import { AnimalService } from "../services/AnimalService";

import { TableFrame } from "../components/page-structure/Table/ZooTableElements";
import AnimalMobileCard from "../components/AnimalOverview/AnimalMobileCard";
import AnimalTable from "../components/AnimalOverview/AnimalTable";
import Loading from "../components/ui/Loading";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export default function TiereUebersicht() {
  const { t } = useTranslation(['common','animal']);
  const router = useRouter();

  const [tiere, setTiere] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGehege, setSelectedGehege] = useState("Alle");
  const [selectedLevel, setSelectedLevel] = useState("Alle");

  const [sortBy, setSortBy] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");

  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
      selectedLevel,
    });
  },
    [tiere, searchTerm, selectedGehege, selectedLevel]);

  const sortedTiere = useMemo(() => {
    return AnimalService.sortAnimals(filteredTiere, { sortBy, sortDirection });
  },
    [filteredTiere, sortBy, sortDirection]);

  const currentItems = useMemo(() => {
    return AnimalService.paginate(sortedTiere, currentPage, itemsPerPage);
  },
    [sortedTiere, currentPage]);

  const totalPages = Math.ceil(filteredTiere.length / itemsPerPage);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  },
    [totalPages, currentPage]);

  const handleNext = () =>
    setCurrentPage((prev) =>
      Math.min(prev + 1, totalPages));
  const handlePrev = () =>
    setCurrentPage((prev) =>
      Math.max(prev - 1, 1));

  if (loading) {
    return (
      <Loading
        text={`${t('searchPlaceholder', { ns: 'animal' })} 🐾`}
      />
    );
  }

  return (
    <PageWrapper>
      <PageHeader
      text={t('headline_animal_overview', { ns: 'animal' })}
      />

      <FilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedGehege={selectedGehege}
        setSelectedGehege={setSelectedGehege}
        selectedLevel={selectedLevel}
        setSelectedLevel={setSelectedLevel}
        setCurrentPage={setCurrentPage}
        tiere={tiere}
      />

      <ResultsInfo
        currentCount={currentItems.length}
        totalCount={filteredTiere.length}
        labelUnit={t('resultsUnit', { ns: 'animal' })}
      />

      {currentItems.length > 0 ? (
        <>
          {/* DESKTOP TABELLE */}
          <DesktopView>
            <TableFrame>
              <AnimalTable animals={currentItems} />
            </TableFrame>
          </DesktopView>

          {/* MOBILE CARDS */}
          <MobileView>
            {currentItems.map((tier) => (
              <AnimalMobileCard
                key={tier.id}
                tier={tier}
                onClick={() =>
                  router.push(`/tiere/${tier.id}`)}
              />
            ))}
          </MobileView>
        </>
      ) : (
        <EmptyState
          title={t('emptyTitle', { ns: 'animal' })}
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


const DesktopView = styled.div`
  display: block;
  @media (max-width: 768px) {
    display: none;
  }
`;

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
      ...(await serverSideTranslations(locale, ['common', 'animal', 'login', 'navigation'])),
    },
  };
}