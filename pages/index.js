import styled from "styled-components";
import Link from "next/link";
import { PrismaClient } from '@prisma/client';
import PageWrapper from "../components/page-structure/PageWrapper";

export async function getStaticProps() {
  const prisma = new PrismaClient();

  // STATS abfragen
  const tierCount = await prisma.tiere.count();
  const variantsCount = await prisma.farbvarianten?.count() || 0;
  const habitatCount = await prisma.gehege.count();

  // ZULETZT HINZUGEFÜGTE abfragen
  const latestAnimals = await prisma.tiere.findMany({
    take: 3,
    orderBy: { id: 'desc' }, // Geht davon aus, dass höhere IDs neuere Einträge sind
    include: { gehege: true }
  });

  return {
    props: {
      stats: {
        tiere: tierCount,
        varianten: variantsCount,
        gehege: habitatCount
      },
      latestAnimals: JSON.parse(JSON.stringify(latestAnimals))
    },
    revalidate: 3600 // Stündlich aktualisieren
  };
}

export default function IndexPage({ stats }) {
  return (
    <PageWrapper>
      <FullPageContainer>
        <HeroSection>
          <ContentWrapper>
            <Badge>Community Projekt</Badge>
            <h1>Zoo 2: Animal Park <span>Manager</span></h1>

            <StatsBar>
              <StatItem>
                <div className="number">{stats.tiere}</div>
                <div className="label">Tiere</div>
              </StatItem>
              <StatItem>
                <div className="number">{stats.varianten}</div>
                <div className="label">Varianten</div>
              </StatItem>
              <StatItem>
                <div className="number">{stats.gehege}</div>
                <div className="label">Gehegearten</div>
              </StatItem>
              <StatItem>
                <div className="number">6</div>
                <div className="label">Zooregionen</div>
              </StatItem>
            </StatsBar>

            <ActionGrid>
              <Link href="/tiere" passHref legacyBehavior>
                <MenuCard $color="#4ca64c">
                  <Icon>🐾</Icon>
                  <h3>Tier-Lexikon</h3>
                  <p>Preise, Stall-Level und Gehege-Infos auf einen Blick.</p>
                </MenuCard>
              </Link>

              <Link href="/varianten" passHref legacyBehavior>
                <MenuCard $color="#3498db">
                  <Icon>🎨</Icon>
                  <h3>Farbvarianten</h3>
                  <p>Verwalte deine Zuchterfolge und seltenen Varianten.</p>
                </MenuCard>
              </Link>

              <Link href="/klub" passHref legacyBehavior>
                <MenuCard $color="#f39c12">
                  <Icon>🏆</Icon>
                  <h3>Klub</h3>
                  <p>Sei ein Mitglied unseres Klubs und gewinne tolle Statuen bei den Wettbewerben.</p>
                </MenuCard>
              </Link>
            </ActionGrid>
          </ContentWrapper>
        </HeroSection>
      </FullPageContainer>
    </PageWrapper>
  );
}


// --- HAUPT-CONTAINER ---
const FullPageContainer = styled.div`
  width: 100%;
  // Auf Desktop fixieren wir die Höhe, auf Mobile lassen wir Wachstum zu
  min-height: calc(100vh - 70px);
  display: flex;
  flex-direction: column;
  background-color: #ffffff;

  @media (max-width: 768px) {
    height: auto;
    overflow-y: auto;
  }
`;

// --- HERO SEKTION MIT HINTERGRUND ---
const HeroSection = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 40px 20px;

  // Hintergrundbild Setup
  background-image: url("/images/Zoo2_AnimalPark.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  @media (max-width: 768px) {
    padding: 60px 15px;
    min-height: 100vh; // Stellt sicher, dass das Bild auf Mobile den Screen füllt
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    // Verlauf für bessere Lesbarkeit: Auf Mobile etwas deckender
    background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.85) 0%,
            rgba(255, 255, 255, 0.4) 100%
    );
    z-index: 1;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1100px;
  width: 100%;
  text-align: center;
  position: relative;
  z-index: 2;

  h1 {
    font-size: clamp(2.2rem, 6vw, 4rem);
    color: #2d5a27;
    margin-bottom: 30px;
    text-shadow: 0 2px 4px rgba(255, 255, 255, 0.5);

    span { color: #88b04b; }

    @media (max-width: 768px) {
      margin-top: 10px;
    }
  }
`;

const Badge = styled.span`
  background: #e8f5d7;
  color: #2d5a27;
  padding: 6px 16px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

// --- STATISTIKEN ---
const StatsBar = styled.div`
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-bottom: 50px;
  background: white;
  padding: 20px 40px;
  border-radius: 50px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  border: 1px solid #e8f5d7;

  @media (max-width: 768px) {
    display: grid;
    grid-template-columns: repeat(2, 1fr); // 2x2 Raster auf Mobile
    gap: 15px;
    padding: 20px;
    border-radius: 25px;
    margin-bottom: 30px;
    max-width: 340px;
    margin-left: auto;
    margin-right: auto;
  }
`;

const StatItem = styled.div`
  text-align: center;

  .number {
    font-size: 1.8rem;
    font-weight: 900;
    color: #2d5a27;

    @media (max-width: 768px) {
      font-size: 1.4rem;
    }
  }

  .label {
    font-size: 0.8rem;
    color: #88b04b;
    text-transform: uppercase;
    font-weight: bold;

    @media (max-width: 768px) {
      font-size: 0.65rem;
    }
  }
`;

// --- NAVIGATION / KACHELN ---
const ActionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  width: 100%;
  margin-top: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr; // Eine Kachel pro Zeile
    gap: 15px;
  }
`;

const MenuCard = styled.a`
  background: white;
  padding: 30px;
  border-radius: 20px;
  border: 2px solid #f0f0f0;
  transition: all 0.3s ease;
  cursor: pointer;
  text-decoration: none;
  text-align: left;
  display: block;

  &:hover {
    border-color: ${props => props.$color};
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
  }

  h3 {
    margin: 15px 0 10px;
    color: #333;
    font-size: 1.25rem;
  }

  p {
    font-size: 0.95rem;
    margin: 0;
    color: #777;
    line-height: 1.4;
  }

  @media (max-width: 768px) {
    padding: 20px;

    h3 { font-size: 1.15rem; }
    p { font-size: 0.85rem; }
  }
`;

const Icon = styled.div`
  font-size: 2.5rem;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;