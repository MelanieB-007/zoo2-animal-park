import React, { useState } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { getAllContests } from "../../services/ContestService";
import PageWrapper from "../../components/page-structure/PageWrapper";
import ContestMobileCard from "../../components/contests/ContestOverview/ContestMobileCard";
import MobileListView from "../../components/page-structure/Elements/MobileListView";
import TableContainer from "../../components/page-structure/Table/TableContainer";
import EmptyState from "../../components/page-structure/Elements/EmptyState";
import PageHeader from "../../components/page-structure/PageHeader";
import ContestDesktopTable from "../../components/contests/ContestOverview/ContestDesktopTable";

export default function ContestsPage({ initialContests }) {
  const [contests] = useState(initialContests || []);

  return (
    <PageWrapper>
      <PageHeader text="Zoo 2 Wettbewerbe" />

      {contests.length > 0 ? (
        <>
          {/* Desktop Ansicht */}
          <TableContainer>
            <ContestDesktopTable contests={contests} />
          </TableContainer>

          {/* Mobile Ansicht */}
          <MobileListView
            currentItems={contests}
            renderCard={(contest) => (
              <ContestMobileCard
                key={contest.id}
                contest={contest}
                onClick={() => console.log("Details für", contest.id)}
              />
            )}
          />
        </>
      ) : (
        <EmptyState onReset={() => window.location.reload()} />
      )}
    </PageWrapper>
  );
}

// Daten serverseitig laden
export async function getServerSideProps({ locale }) {
  try {
    const data = await getAllContests();

    const serializedContests = JSON.parse(JSON.stringify(data));

    return {
      props: {
        initialContests: serializedContests,
        ...(await serverSideTranslations(locale, ["common", "contests", "animals"])),
      },
    };
  } catch (error) {
    console.error("Fehler in getServerSideProps:", error);
    return {
      props: {
        initialContests: [],
        ...(await serverSideTranslations(locale, ["common", "contests", "animals"])),
      },
    };
  }
}