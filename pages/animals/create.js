import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from "next-i18next";

import PageWrapper from "../../components/page-structure/PageWrapper";
import ContentWrapper from "../../components/page-structure/ContentWrapper";
import AnimalForm from "../../components/AnimalForm/AnimalForm";
import PageHeader from "../../components/page-structure/PageHeader";

export default function AddAnimalPage() {
  const { t } = /** @type {any} */ (useTranslation(["animals", "common"]));
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
        <PageHeader text={t("animals:form.createAnimal")} />

        <AnimalForm
          isEdit={false}
          onSuccess={(response) => {
            const newId = response.id;
            console.log("Navigiere zu ID:", newId);

            if (newId) {
              router.push(`/animals/${newId}`);
            } else {
              console.error("Keine ID im Response gefunden!", response);
            }
          }}
        />
      </ContentWrapper>
    </PageWrapper>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'de', ['common', 'animals'])),
    },
  };
}