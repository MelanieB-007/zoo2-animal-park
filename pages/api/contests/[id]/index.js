import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getContestById, getResultsByContestId } from "../../../../services/ContestService";


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