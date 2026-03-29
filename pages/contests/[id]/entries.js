import { useEffect, useState } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";

import PageWrapper from "../../../components/page-structure/PageWrapper";
import ContestEntryForm from "../../../components/contests/ContestEntryForm/ContestEntryForm";
import { getAllMembers } from "../../../services/MemberService";
import { getContestById } from "../../../services/ContestService";
import { toast } from "react-toastify";
import { useTranslation } from "next-i18next";

export default function ContestEntryPage({ contest, members }) {
  const { t } = /** @type {any} */ (useTranslation(["contests", "common"]));
  const router = useRouter();
  const [selectedMember, setSelectedMember] = useState("");

  // Hilfsfunktion für das leere Start-Layout
  const getEmptyEntries = () => {
    return contest.statuen.reduce((acc, link) => {
      const tierId = link.statue.tier.id;
      // Ein leeres Feld als Startpunkt
      acc[tierId] = [{ id: Math.random(), level: "", count: "" }];
      return acc;
    }, {});
  };

  const [entries, setEntries] = useState(getEmptyEntries);

  useEffect(() => {
    async function loadMemberEntries() {
      // Wenn kein Mitglied gewählt ist, sofort auf leer zurücksetzen
      if (!selectedMember) {
        setEntries(getEmptyEntries());
        return;
      }

      try {
        const res = await fetch(
          `/api/contests/get-entry?contestId=${contest.id}&memberId=${selectedMember}`
        );

        if (res.ok) {
          const result = await res.json();

          // Wir nehmen das leere Grundgerüst als Basis
          const baseEntries = getEmptyEntries();

          // Wenn die DB Daten liefert, mergen wir sie in das Grundgerüst
          if (result.data && Object.keys(result.data).length > 0) {
            // Wir stellen sicher, dass für JEDE Tier-ID im Wettbewerb ein Key existiert
            const mergedEntries = { ...baseEntries, ...result.data };
            setEntries(mergedEntries);
          } else {
            setEntries(baseEntries);
          }
        }
      } catch (error) {
        console.error("Fehler beim Laden:", error);
        setEntries(getEmptyEntries()); // Fallback bei Fehler
      }
    }

    loadMemberEntries();
  }, [selectedMember, contest.id]);

  const columns = [
    {
      key: "level",
      label: t("contests:contestOverview.entry.level"),
      type: "number",
      placeholder: "",
      $flex: 1,
    },
    {
      key: "count",
      label: t("contests:contestOverview.entry.count"),
      type: "number",
      placeholder: "",
      $flex: 1,
    },
  ];

  const handlers = {
    addRow: (tierId) =>
      setEntries((prev) => ({
        ...prev,
        [tierId]: [
          ...prev[tierId],
          { id: Math.random(), level: "", count: "" },
        ],
      })),
    removeRow: (tierId, rowId) =>
      setEntries((prev) => ({
        ...prev,
        [tierId]: prev[tierId].filter((row) => row.id !== rowId),
      })),
    handleRowChange: (tierId, rowId, key, value) =>
      setEntries((prev) => ({
        ...prev,
        [tierId]: prev[tierId].map((row) =>
          row.id === rowId ? { ...row, [key]: value } : row
        ),
      })),
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/contests/save-entry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contestId: contest.id,
        memberId: selectedMember,
        data: entries,
      }),
    });

    if (res.ok) {
      toast.success(
        t("common:save_changes" || "Daten erfolgreich übermittelt!")
      );
      router.push(`/contests/${contest.id}`);
    } else {
      toast.error(
        t(
          "common:save_changes_error" ||
            "Hoppla, da ging was schief beim Speichern."
        )
      );
    }
  };

  return (
    <PageWrapper>
      <ContestEntryForm
        contest={contest}
        members={members}
        selectedMember={selectedMember}
        setSelectedMember={setSelectedMember}
        entries={entries}
        columns={columns}
        handlers={handlers}
        onSubmit={handleSubmit}
      />
    </PageWrapper>
  );
}

export async function getServerSideProps({ params, locale }) {
  const contest = await getContestById(params.id);
  const members = await getAllMembers();

  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "common",
        "contests",
        "animals",
      ])),
      contest: JSON.parse(JSON.stringify(contest)),
      members: JSON.parse(JSON.stringify(members)),
    },
  };
}
