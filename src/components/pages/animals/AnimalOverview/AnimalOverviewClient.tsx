"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { useSort } from "@/hooks/useSort";
import AnimalOverviewContent from "./AnimalOverviewContent";
import { AnimalWithRelations } from "@/interfaces/animal";
import {
  deleteAnimal,
  filterAnimals,
  paginate,
  sortAnimals,
} from "@/utils/AnimalHelper";

// 1. Das Interface bleibt so, wie du es hast
interface Props {
  initialAnimals: AnimalWithRelations[];
  locale: string;
}

export default function AnimalOverviewClient({ initialAnimals, locale }: Props) {
  const router = useRouter();
  const t = useTranslations();

  // 2. State mit den bereits im Service transformierten Tieren
  const [animals, setAnimals] = useState<AnimalWithRelations[]>(initialAnimals);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBiomes, setSelectedBiomes] = useState("Alle");
  const [selectedLevel, setSelectedLevel] = useState("Alle");
  const { sortBy, sortDirection, toggleSort } = useSort("name");
  const itemsPerPage = 10;

  // Filtern & Sortieren
  const filteredAnimals = useMemo(
    () =>
      filterAnimals(animals, {
        searchTerm,
        selectedBiome: selectedBiomes,
        selectedLevel,
      }),
    [animals, searchTerm, selectedBiomes, selectedLevel]
  );

  const sortedAnimals = useMemo(
    () => sortAnimals(filteredAnimals, { sortBy, sortDirection }),
    [filteredAnimals, sortBy, sortDirection]
  );

  const currentItems = paginate(sortedAnimals, currentPage, itemsPerPage);
  const totalPages = Math.ceil(filteredAnimals.length / itemsPerPage);

  // 3. Typisierung der ID in den Funktionen hinzufügen (wichtig für TS)
  async function handleDelete(id: number) {
    return deleteAnimal(id, t, (deletedId) => {
      setAnimals((prev) => prev.filter((a) => a.id !== deletedId));
    });
  }

  function handleResetFilters() {
    setSearchTerm("");
    setSelectedBiomes("Alle");
    setSelectedLevel("Alle");
    setCurrentPage(1);
  }

  // Hier id: number hinzufügen
  function handleAnimalClick(id: number) {
    router.push(`/${locale}/animals/${id}`);
  }

  // Hier id: number hinzufügen
  function handleEdit(id: number) {
    router.push(`/${locale}/animals/${id}/edit`);
  }

  return (
    <AnimalOverviewContent
      animals={animals}
      currentItems={currentItems}
      filteredCount={filteredAnimals.length}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      selectedBiomes={selectedBiomes}
      setSelectedBiomes={setSelectedBiomes}
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
