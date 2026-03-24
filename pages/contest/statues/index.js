import StatueOverviewContent from "../../../components/contest/statues/StatueOverviewContent";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import useSWR from "swr";
import { useSort } from "../../../hooks/useSort";
import { getAllStatues } from "../../../services/StatueService";

export default function StatueOverview({fallbackData}) {
  const { t } = /** @type {any} */ (useTranslation(["animals", "contest", "common"]));
  const router = useRouter();
  const { locale } = router;
  const { sortBy, sortDirection, toggleSort } = useSort("name");


   const { data: statues } = useSWR(
    `/api/contest/statues?lang=${locale}`, {
       fallbackData,
       revalidateOnFocus: false,
       revalidateOnMount: false // Wichtig, damit er die fallbackData vom Server nicht sofort überschreibt
     });

  return (
    <StatueOverviewContent
      statues={statues}
      currentItems={filteredStatues} // Hier könnten wir noch Pagination einbauen
      filteredCount={filteredStatues.length}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      selectedGehege={selectedGehege}
      setSelectedGehege={setSelectedGehege}
      sortBy={sortBy}
      sortDirection={sortDirection}
      toggleSort={toggleSort}
    />
  );
}

export async function getStaticProps({ locale }) {
  const initialStatues =  await getAllStatues(locale);

  return {
    props: {
      fallbackData: JSON.parse(JSON.stringify(initialStatues)),
      ...(await serverSideTranslations(locale, ["common", "contest", "animals"])),
    },
    revalidate: 60,
  };
}