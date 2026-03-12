import styled from 'styled-components';
import HeaderCard from '@/components/TierDetails/HeaderCard';
import InfoAccordion from '@/components/TierDetails/InfoAccordion';
import VariantCard from '@/components/TierDetails/VariantCard';
import PageWrapper from "../components/page-structure/PageWrapper";

export default function TierDetail({ animal }) {
  return (
    <PageWrapper>
      <ContentWrapper>
        {/* Die obere große Karte */}
        <HeaderCard animal={animal} />

        <TwoColumnGrid>
          <section>
            {/* Linke Spalte: Beschreibung */}
            <DetailBox title="Beschreibung" icon="📖">
              <p>{animal.description}</p>
            </DetailBox>

            {/* Farbvarianten */}
            <h3 style={{ color: '#4a7c2a', marginTop: '20px' }}>🌸 Farbvarianten</h3>
            <div style={{ display: 'flex', gap: '15px' }}>
              {animal.variants.map(variant => (
                <VariantCard key={variant.id} variant={variant} />
              ))}
            </div>
          </section>

          <aside>
            {/* Rechte Spalte: Accordions */}
            <InfoAccordion title="Zucht" icon="🐣" data={animal.breeding} />
            <InfoAccordion title="XP & Aktionen" icon="⭐" />
            <InfoAccordion title="Anzahl Tiere pro Gehege" icon="🐾" />
          </aside>
        </TwoColumnGrid>
      </ContentWrapper>
    </PageWrapper>
  );
}

const PageContainer = styled.div`
  background-color: #d4e88d; /* Der hellgrüne Hintergrund aus dem Bild */
  min-height: 100vh;
  padding: 40px 20px;
  display: flex;
  justify-content: center;
`;

const ContentWrapper = styled.div`
  max-width: 1000px;
  width: 100%;
`;

const TwoColumnGrid = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 20px;
  margin-top: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

