import React from "react";
import { useTranslations } from "next-intl";

import AnimalDesktopTable from "./AnimalDesktopTable";
import AnimalMobileCard from "./AnimalMobileCard";
import { AnimalWithRelations } from "@/interfaces/animal";
import EmptyState from "@/components/pageStructure/ui/EmptyState";
import PaginationSignpost from "@/components/pageStructure/ui/PaginationSignpost";
import PageWrapper from "@/components/pageStructure/PageWrapper";
import PageHeader from "@/components/pageStructure/PageHeader";
import FilterBar from "@/components/pageStructure/filter/FilterBar";
import ResultsInfo from "@/components/pageStructure/ui/ResultsInfo";
import MobileListView from "@/components/pageStructure/mobileListView/MobileListView";

interface AnimalOverviewContentProps {
  animals: AnimalWithRelations[];
  currentItems: AnimalWithRelations[];
  filteredCount: number;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedBiomes: string;
  setSelectedBiomes: (value: string) => void;
  selectedLevel: string;
  setSelectedLevel: (value: string) => void;
  setCurrentPage: (page: number) => void;
  sortBy: string;
  sortDirection: "asc" | "desc";
  toggleSort: (column: string) => void;
  handleEdit: (id: number) => void;
  handleDelete: (id: number) => void;
  handleAnimalClick: (id: number) => void;
  handleResetFilters: () => void;
  totalPages: number;
  currentPage: number;
  handleNextPage: () => void;
  handlePrevPage: () => void;
}

export default function AnimalOverviewContent({
  animals,
  currentItems,
  filteredCount,
  searchTerm,
  setSearchTerm,
  selectedBiomes,
  setSelectedBiomes,
  selectedLevel,
  setSelectedLevel,
  setCurrentPage,
  sortBy,
  sortDirection,
  toggleSort,
  handleEdit,
  handleDelete,
  handleAnimalClick,
  handleResetFilters,
  totalPages,
  currentPage,
  handleNextPage,
  handlePrevPage,
}: AnimalOverviewContentProps) {
  const t = useTranslations();

  return (
    <PageWrapper>
      <PageHeader text={t("animals:overview_title")} />

      <FilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedBiomes={selectedBiomes}
        setSelectedBiomes={setSelectedBiomes}
        selectedLevel={selectedLevel}
        setSelectedLevel={setSelectedLevel}
        setCurrentPage={setCurrentPage}
        animals={animals}
      />

      <ResultsInfo
        currentCount={currentItems.length}
        totalCount={filteredCount}
      />

      {currentItems.length > 0 ? (
        <>
          <AnimalDesktopTable
            animals={currentItems}
            sortBy={sortBy}
            sortDirection={sortDirection}
            onSort={toggleSort}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          <MobileListView
            currentItems={animals}
            onItemClick={handleAnimalClick}
            onEdit={handleEdit}
            onDelete={handleDelete}
            renderCard={(animal, handlers) => (
              <AnimalMobileCard
                animal={animal}
                onClick={handlers.onClick}
                onEdit={handlers.onEdit}
                onDelete={handlers.onDelete}
              />
            )}
          />
        </>
      ) : (
        <EmptyState
          onReset={handleResetFilters}
          title={undefined}
          message={undefined}
          buttonText={undefined}
        />
      )}

      {totalPages > 1 && (
        <PaginationSignpost
          currentPage={currentPage}
          totalPages={totalPages}
          onNext={handleNextPage}
          onPrev={handlePrevPage}
        />
      )}
    </PageWrapper>
  );
}
