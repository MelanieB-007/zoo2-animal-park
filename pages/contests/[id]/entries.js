import { useState } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";

import PageWrapper from "../../../components/page-structure/PageWrapper";
import ContestEntryForm from "../../../components/contests/ContestEntryForm/ContestEntryForm";
import { getAllMembers } from "../../../services/MemberService";
import { getContestById } from "../../../services/ContestService";

export default function ContestEntryPage({ contest, members }) {
  const router = useRouter();
  const [selectedMember, setSelectedMember] = useState("");

  const [entries, setEntries] = useState(() => {
    return contest.statuen.reduce((acc, link) => {
      const tierId = link.statue.tier.id;
      acc[tierId] = [{ id: Math.random(), level: "", count: "" }];
      return acc;
    }, {});
  });

  const columns = [
    { key: "level", label: "Level", type: "number", placeholder: "", $flex: 1 },
    { key: "count", label: "Anzahl", type: "number", placeholder: "", $flex: 1 },
  ];

  const handlers = {
    addRow: (tierId) => setEntries(prev => ({
      ...prev, [tierId]: [...prev[tierId], { id: Math.random(), level: "", count: "" }]
    })),
    removeRow: (tierId, rowId) => setEntries(prev => ({
      ...prev, [tierId]: prev[tierId].filter(row => row.id !== rowId)
    })),
    handleRowChange: (tierId, rowId, key, value) => setEntries(prev => ({
      ...prev, [tierId]: prev[tierId].map(row => row.id === rowId ? { ...row, [key]: value } : row)
    }))
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
      router.push(`/contests/${contest.id}`);
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
      ...(await serverSideTranslations(locale, ["common", "contests", "animals"])),
      contest: JSON.parse(JSON.stringify(contest)),
      members: JSON.parse(JSON.stringify(members)),
    },
  };
}
