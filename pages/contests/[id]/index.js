import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import PageWrapper from "../../../components/page-structure/PageWrapper";
import ContestDetailView from "../../../components/contests/ContestDetail/ContestDetailView";
import { getContestById, getResultsByContestId } from "../../../services/ContestService";
import { calculateTierStats } from "../../../services/ContestHelper";


export default function ContestDetailPage({ contest, results }) {
  const { t } = /** @type {any} */ (useTranslation(["contests", "common"]));

  const analyses = contest.statuen.map(link => ({
    tier: link.statue.tier,
    stats: calculateTierStats(link.statue.tier.id, results)
  }));

  return (
    <PageWrapper>
      <ContestDetailView
        contest={contest}
        analyses={analyses}
        t={t}
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