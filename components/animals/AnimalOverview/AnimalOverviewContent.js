import React from "react";
import { useTranslation } from "next-i18next";

import PageHeader from "../../page-structure/PageHeader";
import PageWrapper from "../../page-structure/PageWrapper";
import FilterBar from "../../page-structure/Elements/FilterBar";
import ResultsInfo from "../../page-structure/Elements/ResultsInfo";
import AnimalDesktopTable from "./AnimalDesktopTable";
import EmptyState from "../../page-structure/Elements/EmptyState";
import PaginationSignpost from "../../ui/PaginationSignpost";
import MobileListView from "../../page-structure/Elements/MobileListView";
import TableContainer from "../../page-structure/Table/TableContainer";
import AnimalMobileCard from "./AnimalMobileCard";


export default function AnimalOverviewContent({
  animals,
  currentItems,
  filteredCount,
  searchTerm,
  setSearchTerm,
  selectedGehege,
  setSelectedGehege,
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
}) {
  const { t } = /** @type {any} */ (
    useTranslation(["animals", "common"])
  );

  return (
    <PageWrapper>
      <PageHeader text={t("animals:overview_title")} />

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
        totalCount={filteredCount}
      />

      {currentItems.length > 0 ? (
        <>
          <TableContainer>
            <AnimalDesktopTable
              animals={currentItems}
              sortBy={sortBy}
              sortDirection={sortDirection}
              onSort={toggleSort}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </TableContainer>

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
        <EmptyState onReset={handleResetFilters} />
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