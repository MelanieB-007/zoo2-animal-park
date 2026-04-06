import React from "react";
import { useRouter } from "next/router";

import PageHeader from "../../../src/components/pageStructure/PageHeader";
import PageWrapper from "../../../src/components/pageStructure/PageWrapper";
import ResultsInfo from "../../../src/components/pageStructure/ui/ResultsInfo";
import EmptyState from "../../../src/components/pageStructure/ui/EmptyState";
import PaginationSignpost from "../../../src/components/pageStructure/ui/PaginationSignpost";
import TableContainer from "../../../src/components/pageStructure/table/TableContainer";
import MobileListView from "../../../src/components/pageStructure/mobileListView/MobileListView";
import ContestDesktopTable from "./ContestDesktopTable";
import ContestMobileCard from "./ContestMobileCard";
import { useTranslation } from "next-i18next";


export default function ContestOverviewContent({
  contests,
  currentItems,
  handleContestClick,
  handleEdit,
  handleDelete,
  totalPages,
  currentPage,
  handleNextPage,
  handlePrevPage,
}) {
  const { t } = /** @type {any} */ (useTranslation(["contests", "common"]));

  const router = useRouter();

  return (
    <PageWrapper>
      <PageHeader text={t("contests:contestOverview.overview_title")} />

      <ResultsInfo
        currentCount={currentItems.length}
        totalCount={contests.length}
      />

      {currentItems.length > 0 ? (
        <>
          {/* Desktop Ansicht */}
          <TableContainer>
            <ContestDesktopTable
              contests={currentItems}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </TableContainer>

          {/* Mobile Ansicht */}
          <MobileListView
            currentItems={currentItems}
            renderCard={(contest) => (
              <ContestMobileCard
                key={contest.id}
                contest={contest}
                onClick={handleContestClick}
                onEdit={handleEdit(contest.id)}
                onDelete={() => handleDelete(contest.id)}
              />
            )}
          />
        </>
      ) : (
        <EmptyState onReset={() => router.reload()} />
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
