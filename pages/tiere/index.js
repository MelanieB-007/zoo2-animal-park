import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import LoadingWrapper from "../../components/page-structure/Elements/LoadingWrapper";
import { filterAnimals, sortAnimals, paginate, deleteAnimal, getAllAnimals } from "../../services/AnimalService";
import { useSort } from "../../hooks/useSort";
import AnimalOverviewContent from "../../components/AnimalOverview/AnimalOverviewContent";

export default function AnimalOverview() {
  const { t } = /** @type {any} */ (useTranslation(['animals', 'common']));
  const router = useRouter();

  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGehege, setSelectedGehege] = useState("Alle");
  const [selectedLevel, setSelectedLevel] = useState("Alle");
  const { sortBy, sortDirection, toggleSort } = useSort("name");

  const itemsPerPage = 10;

  useEffect(function() {
    async function loadData() {
      setLoading(true);

      const data = await getAllAnimals();

      setAnimals(data);
      setLoading(false);
    }

    loadData();
  }, []);

  const filteredTiere = filterAnimals(animals, {
    searchTerm,
    selectedGehege,
    selectedLevel
  });

  const sortedTiere = sortAnimals(filteredTiere, {
    sortBy,
    sortDirection
  });

  const currentItems = paginate(sortedTiere, currentPage, itemsPerPage);

  const totalPages = Math.ceil(filteredTiere.length / itemsPerPage);

  function handleResetFilters() {
    setSearchTerm("");
    setSelectedGehege("Alle");
    setSelectedLevel("Alle");
    setCurrentPage(1);
  }

  function handleAnimalClick(id) {
    router.push("/tiere/" + id);
  }

  function handleEdit(id) {
    router.push("/tiere/edit/" + id);
  }

  async function handleDelete(id) {
    if (!window.confirm(t("animals:confirm_delete"))) return;
    const success = await deleteAnimal(id);
    if (success) {
      setAnimals(function(prev) { return prev.filter(function(a) { return a.id !== id; }); });
    }
  }

  if (loading) {
    return <LoadingWrapper>{t('animals:search_placeholder')} 🐾</LoadingWrapper>;
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
      handleNextPage={function() { setCurrentPage(prev => prev + 1); }}
      handlePrevPage={function() { setCurrentPage(prev => prev - 1); }}
    />
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "animals"])),
    },
  };
}