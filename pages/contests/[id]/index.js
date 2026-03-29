import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import Swal from "sweetalert2";

import PageWrapper from "../../../components/page-structure/PageWrapper";
import ContestDetailView from "../../../components/contests/ContestDetail/ContestDetailView";
import { getContestById, getResultsByContestId } from "../../../services/ContestService";
import { calculateTierStats } from "../../../services/ContestHelper";



export default function ContestDetailPage({ contest, results }) {
  const { t } = /** @type {any} */ (useTranslation(["contests", "common"]));
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/contests/${contest.id}/edit`);
  };

  const handleDelete = async () => {
    // Hier nutzen wir jetzt Swal für die Sicherheitsabfrage
    const result = await Swal.fire({
      title: t("common:confirmDeleteTitle"), // z.B. "Bist du sicher?"
      text: t("common:confirmDeleteText"), // z.B. "Alle Daten dieses Wettbewerbs gehen verloren!"
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: t("common:deleteButton"),
      cancelButtonText: t("common:cancelButton"),
    });

    // Nur wenn der User auf den Bestätigen-Button geklickt hat
    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/contests/${contest.id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          await Swal.fire(
            t("common:deletedTitle"),
            t("common:deletedText"),
            "success"
          );
          await router.push("/contests");
        } else {
          await Swal.fire("Error", t("common:errorDelete"), "error");
        }
      } catch (err) {
        console.error("Delete failed:", err);
        await Swal.fire("Error", "Server Error", "error");
      }
    }
  };

  const analyses = contest.statuen.map(link => ({
    tier: link.statue.tier,
    stats: calculateTierStats(link.statue.tier.id, results)
  }));

  return (
    <PageWrapper>
      <ContestDetailView
        contest={contest}
        analyses={analyses}
        onEdit = {handleEdit}
        onDelete = {handleDelete}
      />
    </PageWrapper>
  );
}

export async function getServerSideProps({ params, locale }) {
  const contest = await getContestById(params.id);
  const results = await getResultsByContestId(params.id);

  if (!contest) return { notFound: true };

  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "contests", "animals"])),
      contest: JSON.parse(JSON.stringify(contest)),
      results: JSON.parse(JSON.stringify(results)),
    },
  };
}