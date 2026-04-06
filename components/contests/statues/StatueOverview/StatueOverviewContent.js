import React from "react";
import { useTranslation } from "next-i18next";

import StatueDesktopTable from "./StatueDesktopTable";
import PageHeader from "../../../../src/components/pageStructure/PageHeader";
import PageWrapper from "../../../../src/components/pageStructure/PageWrapper";
import FilterBar from "../../../../src/components/pageStructure/filter/FilterBar";
import ResultsInfo from "../../../../src/components/pageStructure/ui/ResultsInfo";
import EmptyState from "../../../../src/components/pageStructure/ui/EmptyState";
import PaginationSignpost from "../../../../src/components/pageStructure/ui/PaginationSignpost";
import TableContainer from "../../../../src/components/pageStructure/table/TableContainer";
import MobileListView from "../../../../src/components/pageStructure/mobileListView/MobileListView";
import StatueMobileCard from "./StatueMobileCard";

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
  handleStatueClick,
  handleResetFilters,
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
      <PageHeader text={t("contests:statues.overview_title")} />
      <FilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedBiomes={selectedGehege}
        setSelectedBiomes={setSelectedGehege}
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

          <MobileListView
            currentItems={statues}
            onItemClick={handleStatueClick}
            renderCard={(statue, handlers) => (
              <StatueMobileCard
                statue={statue}
                onClick={handlers.onClick}
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
