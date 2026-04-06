import React, { useState } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import Swal from "sweetalert2";

import { getAllContests } from "../../services/ContestService";
import PageWrapper from "../../src/components/pageStructure/PageWrapper";
import ContestMobileCard from "../../components/contests/ContestOverview/ContestMobileCard";
import MobileListView from "../../src/components/pageStructure/mobileListView/MobileListView";
import TableContainer from "../../src/components/pageStructure/table/TableContainer";
import EmptyState from "../../src/components/pageStructure/ui/EmptyState";
import PageHeader from "../../src/components/pageStructure/PageHeader";
import ContestDesktopTable from "../../components/contests/ContestOverview/ContestDesktopTable";
import { toast } from "react-toastify";


export default function ContestsOverview({ initialContests }) {
  const [contests, setContests] = useState(initialContests || []);
  const router = useRouter();
  const { t } = /** @type {any} */ (useTranslation(["contests", "common"]));

  const handleEdit = (id) => {
    router.push(`/contests/${id}/edit`);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: t("contests:contestOverview.messages.deleteErrorTitle"),
      text: t("contests:contestOverview.messages.confirmDelete"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: t("contests:contestOverview.messages.deleteButton"),
      cancelButtonText: t("contests:contestOverview.messages.cancelButton"),
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/contests/${id}`, { method: "DELETE" });
        if (res.ok) {
          toast.success(t("common:save_changes", "Erfolgreich gelöscht"));
          await router.push("/contests");
        }
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  return (
    <PageWrapper>
      <PageHeader text={t("contests:contestOverview.overview_title")} />

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