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

          <OriginBadgeList animal={animal} />
        </TitleRow>

        <StatsGrid>
          {/* Spalte 1 & 2 für die Stats */}
          <Stats>
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
          </Stats>

          <Stats>
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
          </Stats>

          {/* Spalte 3 für die Gehege */}
          <BoxWithHeadline translations={translationsAnimals}>
            <EnclosureArea>
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
            </EnclosureArea>
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
  width: 100%; /* Wichtig für die volle Breite auf Mobile */

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    align-items: center; /* Zentriert alles, falls das Bild zentriert ist */
  }
`;

const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;    /* Zentriert den Namen und die Badge-Liste */
    text-align: center;     /* Zentriert den Textinhalt */
    gap: 12px;
    width: 100%;
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
  display: grid;
  /* Auf Mobile: 1 Spalte für die Blöcke (Stats1, Stats2, Gehege untereinander) */
  grid-template-columns: 1fr;
  gap: 15px;
  width: 100%;

  @media (min-width: 768px) {
    /* Desktop: 3 Spalten (Stats, Stats, Gehege nebeneinander) */
    grid-template-columns: 1fr 1fr 1fr;
    align-items: stretch;
  }
`;

const Stats = styled.div`
  display: grid;
  /* Das zwingt Preis & Popularität (und Verkauf & Auswilderung) 
     auf Mobile in zwei exakt gleich breite Spalten */
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  align-items: stretch; /* Macht alle Boxen in einer Reihe gleich hoch */

  @media (min-width: 768px) {
    /* Auf Desktop stehen sie wieder untereinander in ihrer Spalte */
    grid-template-columns: 1fr;
  }
`;