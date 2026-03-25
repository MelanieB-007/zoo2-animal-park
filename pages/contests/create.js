import React, { useEffect } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

import PageWrapper from "../../components/page-structure/PageWrapper";
import ContentWrapper from "../../components/page-structure/ContentWrapper";
import ContestForm from "../../components/contests/ContestForm/ContestForm";
import { getAllStatues } from "../../services/StatueService";
import PageHeader from "../../components/page-structure/PageHeader";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function CreateContest({ statues }) {
  const { t } = /** @type {any} */ (useTranslation(["contest", "common"]));

  const { data: session, status } = useSession();
  const router = useRouter();

  // 1. AUTH-CHECK: Wenn nicht eingeloggt, zurück zur Übersicht oder Login
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/api/auth/signin");
    }
  }, [status, router]);

  // Ladezustand anzeigen, während die Session geprüft wird
  if (status === "loading") {
    return (
      <PageWrapper>
        <ContentWrapper>
          <p>{t("common:loading")}</p>
        </ContentWrapper>
      </PageWrapper>
    );
  }

  // Falls nicht eingeloggt, nichts rendern (Redirect läuft oben)
  if (!session) return null;

  return (
    <PageWrapper>
      <ContentWrapper>
        <PageHeader text={t("contests:contextForm.createTitle")} />

        <p style={{ marginBottom: "30px", color: "#666" }}>
          {t("contests:contextForm.createSubtitle")}
        </p>

        <ContestForm statues={statues} />
      </ContentWrapper>
    </PageWrapper>
  );
}

export async function getServerSideProps({ locale }) {
  // 1. Statuen aus der DB holen (inkl. Tier-Namen via Prisma)
  const allStatues = await getAllStatues(locale);

  return {
    props: {
      // JSON.parse(JSON.stringify(...)) ist wichtig, um Date-Objekte von Prisma
      // Next.js-konform zu serialisieren
      statues: JSON.parse(JSON.stringify(allStatues)),

      // Lade alle benötigten Sprachdateien
      ...(await serverSideTranslations(locale || "de", [
        "common",
        "contests",
        "animals"
      ])),
    },
  };
}