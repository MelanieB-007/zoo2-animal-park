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

const FullPageContainer = styled.div`
  width: 100%;
  height: calc(100vh - 70px); // Abzug der Header-Höhe, falls vorhanden
  overflow: hidden; // Verhindert Scrollen
  display: flex;
  flex-direction: column;
`;

const HeroSection = styled.div`
  flex: 1; // Füllt den gesamten verfügbaren Platz aus
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  
  background-image: url("/images/Zoo2_AnimalPark.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    // Stärkerer Verlauf nach unten, um den Übergang zum Footer (falls vorhanden) zu kaschieren
    background: linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.4) 100%);
    z-index: 1;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1100px;
  width: 100%;
  padding: 0 20px;
  text-align: center;
  position: relative;
  z-index: 2;

  h1 {
    font-size: clamp(2.5rem, 6vw, 4rem);
    color: #2d5a27;
    margin-bottom: 30px;
    text-shadow: 0 2px 4px rgba(255,255,255,0.5);
    span { color: #88b04b; }
  }
`;

const Badge = styled.span`
  background: #e8f5d7;
  color: #2d5a27;
  padding: 6px 16px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const StatsBar = styled.div`
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-bottom: 50px; /* Abstand zu den Kacheln */
  background: white;
  padding: 20px 40px;
  border-radius: 50px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  border: 1px solid #e8f5d7;

  @media (max-width: 768px) {
    gap: 15px;
    padding: 15px;
  }
`;

const StatItem = styled.div`
  text-align: center;
  .number {
    font-size: 1.8rem;
    font-weight: 900;
    color: #2d5a27;
  }
  .label {
    font-size: 0.8rem;
    color: #88b04b;
    text-transform: uppercase;
    font-weight: bold;
  }
`;

const ActionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  width: 100%;
  margin-top: 20px;
`;

const MenuCard = styled.a` /* Als Link gestylt */
  background: white;
  padding: 30px;
  border-radius: 20px;
  border: 2px solid #f0f0f0;
  transition: all 0.3s ease;
  cursor: pointer;
  text-decoration: none;
  text-align: left;
  display: block; /* Für Klickbarkeit */

  &:hover {
    border-color: ${props => props.$color};
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.05);
  }

  h3 { margin: 15px 0 10px; color: #333; }
  p { font-size: 0.95rem; margin: 0; text-align: left; color: #777; }
`;

const Icon = styled.div`
  font-size: 2.5rem;
`;

const LatestSection = styled.div`
  max-width: 900px;
  margin: -60px auto 60px; /* Überlappt leicht mit Hero für Dynamik */
  background: white;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  position: relative;
  z-index: 2;

  h3 { color: #2d5a27; margin-top: 0; margin-bottom: 25px; font-size: 1.1rem; text-transform: uppercase; letter-spacing: 1px; text-align: center; }
`;

const LatestGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
`;

const MiniCard = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 12px;
  background: #fdfdfd;
  border: 1px solid #f0f0f0;

  .emoji { font-size: 1.5rem; }
  strong { display: block; color: #333; font-size: 0.95rem; }
  p { margin: 0; font-size: 0.8rem; color: #888; }
`;

const AboutSection = styled.section`
  padding: 100px 20px;
  background: #f9fbf7;
  display: flex;
  justify-content: center;
  gap: 60px;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    padding: 60px 20px;
  }
`;

const AboutContent = styled.div`
  max-width: 500px;
  h2 { color: #2d5a27; margin-bottom: 20px; font-size: 2.2rem; }
  p { line-height: 1.7; color: #555; font-size: 1.05rem; }
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 30px;
  text-align: left;
  li {
    margin-bottom: 12px;
    padding-left: 30px;
    position: relative;
    color: #666;
    &::before {
      content: "✓";
      position: absolute;
      left: 0;
      color: #88b04b;
      font-weight: bold;
    }
  }
`;

const IconLarge = styled.div`
  font-size: 9rem;
  background: white;
  width: 220px;
  height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 45px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.08);
  border: 2px solid #f0f0f0;
`;