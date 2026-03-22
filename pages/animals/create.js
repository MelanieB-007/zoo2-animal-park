import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from "next-i18next";
import styled from "styled-components";

import PageWrapper from "../../components/page-structure/PageWrapper";
import ContentWrapper from "../../components/page-structure/ContentWrapper";
import AnimalForm from "../../components/AnimalForm/AnimalForm";
import PageHeader from "../../components/page-structure/PageHeader";

export default function AddAnimalPage() {
  const { t } = /** @type {any} */ (useTranslation(["animals", "common"]));

  return (
    <PageWrapper>
      <ContentWrapper>
        <PageHeader text={t("animals:form.createAnimal")} />

        <AnimalForm
          onSuccess={() => router.push(`/animals/${id}`)}
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