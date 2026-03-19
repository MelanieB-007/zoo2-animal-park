import React, { useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import useSWR from "swr";

import { filterAnimals, sortAnimals, paginate } from "../../services/AnimalHelper";
import { useSort } from "../../hooks/useSort";
import AnimalOverviewContent from "../../components/AnimalOverview/AnimalOverviewContent";
import { deleteAnimalFromDB, getAllAnimals } from "../../services/AnimalService";


export default function AnimalOverview({ fallbackData }) {
  const { t } = /** @type {any} */ (useTranslation(["animals", "common"]));
  const router = useRouter();

  const { data: animals, mutate } = useSWR('/api/animals', {
    fallbackData
  });

  const currentAnimals = animals || [];

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGehege, setSelectedGehege] = useState("Alle");
  const [selectedLevel, setSelectedLevel] = useState("Alle");
  const { sortBy, sortDirection, toggleSort } = useSort("name");

  const itemsPerPage = 10;

  // Logik (Filterung/Sortierung)
  const filteredTiere = filterAnimals(currentAnimals, {
    searchTerm,
    selectedGehege,
    selectedLevel,
  });
  const sortedTiere = sortAnimals(filteredTiere, { sortBy, sortDirection });
  const currentItems = paginate(sortedTiere, currentPage, itemsPerPage);
  const totalPages = Math.ceil(filteredTiere.length / itemsPerPage);

  const handleDelete = async (id) => {
    if (!window.confirm(t("animals:confirm_delete"))) return;
    const success = await deleteAnimalFromDB(id);
    if (success) {
      await mutate(
        animals.filter((a) => a.id !== id),
        false
      );
    }
  };

  function handleResetFilters() {
    setSearchTerm("");
    setSelectedGehege("Alle");
    setSelectedLevel("Alle");
    setCurrentPage(1);
  }

  function handleAnimalClick(id) {
    router.push(`/animals/${id}`);
  }

  function handleEdit(id) {
    router.push(`/animals/edit/${id}`);
  }

  return (
    <AnimalOverviewContent
      t={t}
      animals={animals}
      currentItems={currentItems}
      filteredCount={filteredTiere.length}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      selectedGehege={selectedGehege}
      setSelectedGehege={setSelectedGehege}
      selectedLevel={selectedLevel}
      setSelectedLevel={setSelectedLevel}
      setCurrentPage={setCurrentPage}
      sortBy={sortBy}
      sortDirection={sortDirection}
      toggleSort={toggleSort}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
      handleAnimalClick={handleAnimalClick}
      handleResetFilters={handleResetFilters}
      totalPages={totalPages}
      currentPage={currentPage}
      handleNextPage={() => setCurrentPage((prev) => prev + 1)}
      handlePrevPage={() => setCurrentPage((prev) => prev - 1)}
    />
  );
}

export async function getStaticProps({ locale }) {
  const initialAnimals = await getAllAnimals();

  return {
    props: {
      fallbackData: initialAnimals,
      ...(await serverSideTranslations(locale, ["common", "animals"])),
    },
    revalidate: 60,
  };
}