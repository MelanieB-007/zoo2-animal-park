import styled from "styled-components";

import CardContainer from "../page-structure/CardContainer";
import MainImage from "../page-structure/Elements/MainImage";
import PriceDisplay from "../icons/PriceDisplay";
import PopularityDisplay from "../icons/PopularityDisplay";
import StatBox from "../page-structure/Elements/StatBox";
import GameIcon from "../icons/GameIcon";
import StallLevelBadge from "../page-structure/Elements/StallLevelBadge";
import BoxWithHeadline, { EnclosureArea } from "../page-structure/Elements/BoxWithHeadline";
import OriginBadgeList from "../page-structure/Elements/OriginBadgeList";
import XPIcon from "../icons/XPIcon";

export default function HeaderCard({ animal, translationsAnimals, translationsCommon }) {

  return (
    <CardContainer>
      <MainImage animal={animal} />

      <InfoSection>
        <TitleRow>
          <TextContent>
            <h1>{animal.name}</h1>
            <ReleaseDate>
              📅 Release: {animal.release}
            </ReleaseDate>
          </TextContent>

          <BadgeWrapper>
            <OriginBadgeList animal={animal} />
          </BadgeWrapper>
        </TitleRow>

        <StatsGrid>
          {/* Spalte 1 & 2 für die Stats */}
          <StatsGroup>
            <StatBox>
              <label>{translationsAnimals.tablePrice}</label>
              <PriceDisplay
                value={animal.preis}
                type={animal.preisart}
              />
            </StatBox>

            <StatBox>
              <label>{translationsCommon.popularity}</label>
              <PopularityDisplay
                popularity={animal.popularitaet}
                translation={translationsCommon}
              />
            </StatBox>
          </StatsGroup>

          <StatsGroup>
            <StatBox>
              <label>{translationsAnimals.tableSell}</label>
              <PriceDisplay
                value={animal.preis}
                type="zoodollar"
              />
            </StatBox>

            <StatBox>
              <label>{translationsAnimals.tableRelease}</label>
               <XPIcon
               label={animal.auswildern}
               />

            </StatBox>
          </StatsGroup>

          {/* Spalte 3 für die Gehege */}
          <BoxWithHeadline translations={translationsAnimals}>
              {/* Gehegeart */}
              <GameIcon
                type="/gehege/"
                fileName={`${animal.gehege.name}.webp`}
                bordercolor="#4ca64c"
              />

              {/* Stall */}
              <StallLevelBadge
                level={animal.stalllevel}
                habitat={animal.gehege.name}
              />

              {/* Spielgerät */}
              <GameIcon
                type="/gehege/"
                fileName={`${animal.gehege.name}.webp`}
                bordercolor="#4ca64c"
              />
          </BoxWithHeadline>
        </StatsGrid>
      </InfoSection>
    </CardContainer>
  );
}


const ReleaseDate = styled.div`
  font-size: 0.8rem;
  margin-top: 5px;
`;

const InfoSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* Stellt sicher, dass alles links beginnt */
  width: 100%;

  @media (max-width: 768px) {
    align-items: center;
  }
`;

const TitleRow = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-start; /* Der Inhalt beginnt links am Bild */
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
`;

// DAS sorgt für die Rechtsbündigkeit oben rechts
const BadgeWrapper = styled.div`
  /* Auf Desktop: Schiebt sich so weit wie möglich nach rechts im Header */
  margin-left: auto; 

  @media (max-width: 768px) {
    margin: 0; /* Auf Mobile wieder mittig */
    width: 100%;
    display: flex;
    justify-content: center;
  }
`;

const TextContent = styled.div`
  display: flex;
  flex-direction: column;

  h1 {
    color: #2d5a27;
    margin: 0;
    font-size: 1.8rem;
    line-height: 1.2;
  }

  .release-info {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #888;
    font-size: 0.8rem;
    margin-top: 8px;
    background: #f0f4e8;
    padding: 2px 8px;
    border-radius: 4px;
    width: fit-content;
  }
`;

const StatsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  margin-top: 10px;

  @media (min-width: 768px) {
    display: grid;
    /* Spaltenbreiten verringert: 140px statt 160px */
    grid-template-columns: repeat(2, 220px) minmax(220px, 1fr);
    justify-content: start; /* Das gesamte Grid nach links zum Bild ziehen */
    gap: 15px; /* Etwas kompakterer Abstand */
  }
`;

const StatsGroup = styled.div`
  display: flex;
  gap: 15px;
  width: 100%;

  /* Auf Mobile: 2 Boxen nebeneinander */
  & > * {
    flex: 1;
  }

  @media (min-width: 768px) {
    /* Desktop: Untereinander innerhalb der Grid-Spalte */
    flex-direction: column;
  }
`;


// Diesen Style kannst du in deine Datei kopieren, wo die Farbvarianten sind
const SectionHeadline = styled.h2`
  display: flex;
  align-items: center;
  gap: 12px;                  /* Abstand zwischen Icon/Emoji und Text */
  
  /* HINTERGRUND & FORM */
  background: #fdfdfd;         /* Heller Hintergrund, wie die Boxen oben */
  border: 1.5px solid #d1e2a5; /* Grüner Rand, passend zum Theme */
  border-radius: 30px;         /* Stark abgerundet für den Plaketten-Look */
  padding: 8px 24px;          /* Innenabstand, damit der Text Luft hat */
  width: fit-content;          /* Die Box wird nur so breit wie der Text */
  
  /* TEXT-STYLING */
  color: #2d5a27;             /* Dunkles Zoo-Grün */
  font-size: 1.3rem;          /* Etwas kleiner als die Hauptüberschrift oben */
  font-weight: 600;
  
  /* POSITIONIERUNG */
  margin: 35px 0 20px 5px;    /* Abstand nach oben (35px), unten (20px) und links (5px) */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.03); /* Ganz dezenter Schatten für Tiefe */

  /* Kleiner visueller Akzent, um sie mit der Sektion darunter zu verbinden */
  &::after {
    content: "";
    flex: 1;
    height: 1.5px;
    background-color: #d1e2a5;
    margin-left: 20px;
    opacity: 0.5;
  }
`;