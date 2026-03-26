import React, { useState } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";

import { getAllContests } from "../../../services/ContestService";
import ContestOverviewContent from "../../../components/contests/ContestOverview/ContestOverviewContent";
import { paginate } from "../../../services/AnimalHelper";


export default function ContestsOverview({ initialContests }) {
  const [contests, setContests] = useState(initialContests || []);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  const itemsPerPage = 10;
  const currentItems = paginate(contests, currentPage, itemsPerPage);
  const totalPages = Math.ceil(contests.length / itemsPerPage);

  const handleDelete = async (id) => {
    if (!confirm("Wettbewerb wirklich löschen? Alle Punkte-Einträge gehen verloren!")) return;

    try {
      const res = await fetch(`/api/contests/${id}`, { method: "DELETE" });
      if (res.ok) {
        // Lokal aus dem State entfernen, damit die UI sofort reagiert
        setContests(prev => prev.filter(c => c.id !== id));
      } else {
        alert("Fehler beim Löschen.");
      }
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  function handleContestClick(id) {
    router.push(`/contests/${id}`);
  }

  function handleEdit(id) {
    router.push(`/contests/${id}/edit`);
  }

  return (
   <ContestOverviewContent
   contests = {contests}
   currentItems={currentItems}
   handleContestClick={handleContestClick}
   handleEdit={handleEdit}
   handleDelete={handleDelete}
   totalPages={totalPages}
   currentPage={currentPage}
   handleNextPage={() => setCurrentPage((prev) => prev + 1)}
   handlePrevPage={() => setCurrentPage((prev) => prev - 1)}
   />
  );
}

export async function getServerSideProps({ locale }) {
  try {
    const data = await getAllContests();
    return {
      props: {
        initialContests: JSON.parse(JSON.stringify(data)),
        ...(await serverSideTranslations(locale, ["common", "contests", "animals"])),
      },
    };
  } catch (error) {
    return {
      props: {
        initialContests: [],
        ...(await serverSideTranslations(locale, ["common", "contests", "animals"])),
      },
    };
  }
}