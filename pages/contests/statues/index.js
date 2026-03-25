import React, { useState } from "react";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import useSWR from "swr";

import { filterStatues, sortStatues, paginate } from "../../../services/StatueHelper";
import { useSort } from "../../../hooks/useSort";
import { getAllStatues } from "../../../services/StatueService";
import StatueOverviewContent from "../../../components/contests/statues/StatueOverviewContent";

export default function StatueOverview({ fallbackData }) {
  const router = useRouter();
  const { locale } = router;

  const { data: statues } = useSWR(
    `/api/contest/statues?lang=${locale}`, {
      fallbackData,
      revalidateOnFocus: false,
      revalidateOnMount: false
    });

  const currentStatues = statues || [];

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGehege, setSelectedGehege] = useState("Alle");
  const [selectedLevel, setSelectedLevel] = useState("Alle");

  // Statuen haben meist kein eigenes Level, sondern hängen am Tier-Stalllevel
  const { sortBy, sortDirection, toggleSort } = useSort("tier.name");

  const itemsPerPage = 10;

  // --- LOGIK (Exakt wie bei den Tieren) ---
  const filteredStatues = filterStatues(currentStatues, {
    searchTerm,
    selectedGehege,
    selectedLevel,
  });

  const sortedStatues = sortStatues(filteredStatues, { sortBy, sortDirection });
  const currentItems = paginate(sortedStatues, currentPage, itemsPerPage);
  const totalPages = Math.ceil(filteredStatues.length / itemsPerPage);

  function handleResetFilters() {
    setSearchTerm("");
    setSelectedGehege("Alle");
    setSelectedLevel("Alle");
    setCurrentPage(1);
  }

  function handleStatueClick(animalId) {
    router.push(`/animals/${animalId}`);
  }

  return (
    <StatueOverviewContent
      statues={currentStatues}
      currentItems={currentItems}
      filteredCount={filteredStatues.length}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      selectedGehege={selectedGehege}
      setSelectedGehege={setSelectedGehege}
      selectedLevel={selectedLevel}
      setSelectedLevel={setSelectedLevel}
      handleStatueClick={handleStatueClick}
      setCurrentPage={setCurrentPage}
      sortBy={sortBy}
      sortDirection={sortDirection}
      toggleSort={toggleSort}
      handleResetFilters={handleResetFilters}
      totalPages={totalPages}
      currentPage={currentPage}
      handleNextPage={() => setCurrentPage((prev) => prev + 1)}
      handlePrevPage={() => setCurrentPage((prev) => prev - 1)}
    />
  );
}

export async function getStaticProps({ locale }) {
  const initialStatues = await getAllStatues(locale);

  return {
    props: {
      fallbackData: JSON.parse(JSON.stringify(initialStatues)),
      ...(await serverSideTranslations(locale, ["common", "contests", "animals"])),
    },
    revalidate: 60,
  };
}