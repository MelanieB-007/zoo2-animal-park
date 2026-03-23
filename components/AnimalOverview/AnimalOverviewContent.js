import React from "react";

import PageHeader from "../page-structure/PageHeader";
import PageWrapper from "../page-structure/PageWrapper";
import FilterBar from "../page-structure/Elements/FilterBar";
import ResultsInfo from "../page-structure/Elements/ResultsInfo";
import AnimalDesktopTable from "../AnimalOverview/AnimalDesktopTable";
import EmptyState from "../page-structure/Elements/EmptyState";
import PaginationSignpost from "../ui/PaginationSignpost";
import MobileView from "./MobileView";
import styled from "styled-components";

export default function AnimalOverviewContent({
  t,
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

          <MobileView
            currentItems={currentItems}
            handleAnimalClick={handleAnimalClick}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
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

const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  height: auto;
`;