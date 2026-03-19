import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from "next-i18next";
import styled from "styled-components";

import PageWrapper from "../../components/page-structure/PageWrapper";
import ContentWrapper from "../../components/page-structure/ContentWrapper";
import AnimalForm from "../../components/AnimalForm/AnimalForm";

export default function AddAnimalPage() {
  const { t } = /** @type {any} */ (useTranslation(["animals", "common"]));

  return (
    <PageWrapper>
      <ContentWrapper>
        <Headline>
          {t("animals:form.createAnimal")}
        </Headline>

        <AnimalForm />
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

const Headline = styled.h2`
  color: #5a7024; 
  margin-bottom: 20px;
`;