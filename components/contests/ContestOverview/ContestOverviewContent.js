import React from "react";
import { useTranslation } from "next-i18next";


import PageHeader from "../../page-structure/PageHeader";
import PageWrapper from "../../page-structure/PageWrapper";
import FilterBar from "../../page-structure/Elements/FilterBar";
import ResultsInfo from "../../page-structure/Elements/ResultsInfo";
import EmptyState from "../../page-structure/Elements/EmptyState";
import PaginationSignpost from "../../ui/PaginationSignpost";
import TableContainer from "../../page-structure/Table/TableContainer";
import MobileListView from "../../page-structure/Elements/MobileListView";
import ContestDesktopTable from "./ContestDesktopTable";
import ContestMobileCard from "./ContestMobileCard";

export default function ContestOverviewContent({
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
  handleStatueClick,
  sortBy,
  sortDirection,
  toggleSort,
  totalPages,
  currentPage,
  handleNextPage,
  handlePrevPage,
}) {
  const { t } = /** @type {any} */ (
    useTranslation(["animals", "contests", "common"])
  );

  return (
    <PageWrapper>
      <PageHeader text={t("contests:contest.overview_title")} />
      <FilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedGehege={selectedGehege}
        setSelectedGehege={setSelectedGehege}
        selectedLevel={selectedLevel}
        setSelectedLevel={setSelectedLevel}
        setCurrentPage={setCurrentPage}
        animals={statues.map((s) => s.tier)}
      />

      <ResultsInfo
        currentCount={currentItems.length}
        totalCount={filteredCount}
      />

      {currentItems.length > 0 ? (
        <>
          <TableContainer>
            <ContestDesktopTable
              statues={currentItems}
              sortBy={sortBy}
              sortDirection={sortDirection}
              onSort={toggleSort}
            />
          </TableContainer>

          <MobileListView
            currentItems={contests}
            onItemClick={handleStatueClick}
            renderCard={(statue, handlers) => (
              <ContestMobileCard statue={statue} onClick={handlers.onClick} />
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
