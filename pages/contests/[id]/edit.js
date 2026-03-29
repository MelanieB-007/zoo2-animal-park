import React from "react";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { toast } from "react-toastify";
import { useTranslation } from "next-i18next";

import { getContestById } from "../../../services/ContestService";
import ContestForm from "../../../components/contests/ContestForm/ContestForm";
import { getAllStatues } from "../../../services/StatueService";
import PageWrapper from "../../../components/page-structure/PageWrapper";
import ContentWrapper from "../../../components/page-structure/ContentWrapper";
import PageHeader from "../../../components/page-structure/PageHeader";


export default function EditContestPage({ contest, statues }) {
  const { t } = /** @type {any} */ (useTranslation(["contests", "common"]));

  const router = useRouter();

  const handleUpdate = async (formData) => {
    try {
      const res = await fetch(`/api/contests/${contest.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success("Wettbewerb erfolgreich aktualisiert!");
        router.push("/contests");
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Fehler beim Aktualisieren.");
      }
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("Netzwerkfehler beim Speichern.");
    }
  };

  if (!contest) return <div>Wettbewerb nicht gefunden.</div>;

  return (
    <PageWrapper>
      <ContentWrapper>
        <PageHeader text={t("contests:contextForm.editTitle")} />
        <ContestForm
          statues={statues}
          initialData={contest}
          onSubmit={handleUpdate}
        />
      </ContentWrapper>
    </PageWrapper>
  );
}

export async function getServerSideProps({ params, locale }) {
  const { id } = params;

  try {
    // 1. Den spezifischen Contest laden
    const contest = await getContestById(id);

    // 2. Alle Statuen laden (für die Auswahl-Liste links)
    const statues = await getAllStatues();

    if (!contest) {
      return { notFound: true };
    }

    return {
      props: {
        contest: JSON.parse(JSON.stringify(contest)),
        statues: JSON.parse(JSON.stringify(statues)),
        ...(await serverSideTranslations(locale, [
          "common",
          "contests",
          "animals",
        ])),
      },
    };
  } catch (error) {
    console.error("Error loading Edit Page:", error);
    return {
      props: {
        contest: null,
        statues: [],
        ...(await serverSideTranslations(locale, [
          "common",
          "contests",
          "animals",
        ])),
      },
    };
  }
}
