import React, { useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import useSWR from "swr";

import { filterAnimals, sortAnimals, paginate } from "../../services/AnimalHelper";
import { useSort } from "../../hooks/useSort";
import AnimalOverviewContent from "../../components/AnimalOverview/AnimalOverviewContent";
import { getAllAnimals } from "../../services/AnimalService";
import { toast } from "react-toastify";
import Swal from "sweetalert2";


export default function AnimalOverview({ fallbackData }) {
  const { t } = /** @type {any} */ (useTranslation(["animals", "common"]));
  const router = useRouter();
  const { locale } = router;

  const { data: animals, mutate } = useSWR(`/api/animals?lang=${locale}`, {
    fallbackData,
    revalidateOnFocus: false,
    revalidateOnMount: false // Wichtig, damit er die fallbackData vom Server nicht sofort überschreibt
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

  const deleteAnimalFrontend = async (id) => {
    const response = await fetch(`/api/animals/${id}`, {
      method: 'DELETE',
    });
    return response.ok;
  };

  const handleDelete = async (id) => {
    // 2. SweetAlert2 statt window.confirm
    const result = await Swal.fire({
      title: t("animals:messages.deleteErrorTitle") || 'Tier löschen?',
      text: t("animals:messages.confirmDelete") || "Möchtest du dieses Tier wirklich aus der Liste entfernen?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: t("common:messages.yes_delete") || 'Ja, löschen!',
      cancelButtonText: t("common:messages.cancel") || 'Abbrechen'
    });

    if (result.isConfirmed) {
      const success = await deleteAnimalFrontend(id);

      if (success) {
        // 3. SWR Cache lokal aktualisieren (Optimistic UI)
        mutate(
          animals.filter((a) => a.id !== id),
          false
        );

        // 4. Toast-Feedback
        toast.success(t("animals:messages.deleteSuccess") || "Tier erfolgreich gelöscht! 🐾");
      } else {
        toast.error(t("common:error_deleting") || "Fehler beim Löschen.");
      }
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
    router.push(`/animals/${id}/edit`);
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
  const initialAnimals = await getAllAnimals(locale);

  return {
    props: {
      fallbackData: initialAnimals,
      ...(await serverSideTranslations(locale, ["common", "animals"])),
    },
    revalidate: 60,
  };
}