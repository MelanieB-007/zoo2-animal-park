import React from "react";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { prisma } from "../../src/lib/prisma";
import ContestForm from "../../components/contests/ContestForm/ContestForm";
import { toast } from "react-toastify";
import PageHeader from "../../src/components/pageStructure/PageHeader";
import PageWrapper from "../../src/components/pageStructure/PageWrapper";
import ContentWrapper from "../../components/page-structure/ContentWrapper";
import { useTranslation } from "next-i18next";

export default function CreateContest({ statues }) {
  const { t } = /** @type {any} */ (useTranslation(["contests", "common"]));
  const router = useRouter();

  const handleCreate = async (formData) => {
    const res = await fetch("/api/contests/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      toast.success(t("contests:contestForm.successCreated"));
      router.push("/contests");
    } else {
      toast.error(t("contests:contestForm.errorCreating"));
    }
  };

  return (
    <PageWrapper>
      <ContentWrapper>
        <PageHeader text={t("contests:contestForm.createTitle")} />
      <ContestForm statues={statues} onSubmit={handleCreate} />
      </ContentWrapper>
    </PageWrapper>
  );
}

export async function getServerSideProps({ locale }) {
  // Wir laden ALLE Statuen, damit der User sie links im OriginTransfer sieht
  const allStatues = await prisma.wettbewerbstatuen.findMany({
    include: {
      tier: {
        include: { texte: true },
      },
    },
  });

  return {
    props: {
      statues: JSON.parse(JSON.stringify(allStatues)),
      ...(await serverSideTranslations(locale, [
        "common",
        "contests",
        "animals",
      ])),
    },
  };
}