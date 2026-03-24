import StatueDesktopTable from "./StatueDesktopTable";
import PageHeader from "../../page-structure/PageHeader";
import React from "react";
import PageWrapper from "../../page-structure/PageWrapper";
import FilterBar from "../../page-structure/Elements/FilterBar";
import ResultsInfo from "../../page-structure/Elements/ResultsInfo";
import EmptyState from "../../page-structure/Elements/EmptyState";
import PaginationSignpost from "../../ui/PaginationSignpost";
import TableContainer from "../../page-structure/Table/TableContainer";
import { useTranslation } from "next-i18next";

export default function StatueOverviewContent({
  statues,
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
  totalPages,
  currentPage,
  handleNextPage,
  handlePrevPage,
}) {
  const { t } = /** @type {any} */ (
    useTranslation(["animals", "contest", "common"])
  );

  return (
    <PageWrapper>
      <PageHeader text={t("contest:statues.overview_title")} />
      <FilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedGehege={selectedGehege}
        setSelectedGehege={setSelectedGehege}
        selectedLevel={selectedLevel}
        setSelectedLevel={setSelectedLevel}
        setCurrentPage={setCurrentPage}
        animals={statues.map(s => s.tier)}
      />

      <ResultsInfo
        currentCount={currentItems.length}
        totalCount={filteredCount}
      />

      {currentItems.length > 0 ? (
        <>
          <TableContainer>
            <StatueDesktopTable
              statues={currentItems}
              sortBy={sortBy}
              sortDirection={sortDirection}
              onSort={toggleSort}
            />
          </TableContainer>

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
