import React, { useState } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import Swal from "sweetalert2";

import { getAllContests } from "../../services/ContestService";
import PageWrapper from "../../components/page-structure/PageWrapper";
import ContestMobileCard from "../../components/contests/ContestOverview/ContestMobileCard";
import MobileListView from "../../components/page-structure/Elements/MobileListView";
import TableContainer from "../../components/page-structure/Table/TableContainer";
import EmptyState from "../../components/page-structure/Elements/EmptyState";
import PageHeader from "../../components/page-structure/PageHeader";
import ContestDesktopTable from "../../components/contests/ContestOverview/ContestDesktopTable";


export default function ContestsOverview({ initialContests }) {
  const [contests, setContests] = useState(initialContests || []);
  const router = useRouter();
  const { t } = /** @type {any} */ (useTranslation(["contests", "common"]));

  const handleEdit = (id) => {
    router.push(`/contests/${id}/edit`);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: t("common:confirmDeleteTitle"),
      text: t("common:confirmDeleteText"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: t("common:deleteButton"),
      cancelButtonText: t("common:cancelButton"),
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/contests/${id}`, { method: "DELETE" });
        if (res.ok) {
          setContests((prev) => prev.filter((c) => c.id !== id));
          await Swal.fire(t("common:deletedTitle"), "", "success");
        } else {
          await Swal.fire("Error", t("common:errorDelete"), "error");
        }
      } catch (err) {
        console.error("Delete failed:", err);
        await Swal.fire("Error", "Server Error", "error");
      }
    }
  };

  return (
    <PageWrapper>
      <PageHeader text="Zoo 2 Wettbewerbe" />

      {contests.length > 0 ? (
        <>
          {/* Desktop Ansicht */}
          <TableContainer>
            <ContestDesktopTable
              contests={contests}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </TableContainer>

          {/* Mobile Ansicht */}
          <MobileListView
            currentItems={contests}
            renderCard={(contest) => (
              <ContestMobileCard
                key={contest.id}
                contest={contest}
                onClick={() => router.push(`/contests/${contest.id}`)}
                onEdit={() => handleEdit(contest.id)} // Falls das Mobile-Design Icons hat
                onDelete={() => handleDelete(contest.id)}
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