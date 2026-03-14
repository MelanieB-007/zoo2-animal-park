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
  margin-bottom: 10px;
`;

const InfoSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  /* Desktop: Linksbündig und volle Breite des rechten Bereichs */
  align-items: flex-start;

  @media (max-width: 768px) {
    width: 100%;
    align-items: center;
  }
`;

const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
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
  width: 100%;
  display: flex;
  flex-direction: column; /* Mobile: Alles untereinander stapeln */
  gap: 15px;

  @media (min-width: 768px) {
    /* Desktop: Zurück zum stabilen 3-Spalten-Grid */
    display: grid;
    grid-template-columns: 1fr 1fr 1.3fr;
    align-items: stretch;
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

// Diese Komponente sorgt dafür, dass die Gehege-Box auf Mobile ausschert
const EnclosureWrapper = styled(BoxWithHeadline)`
  @media (max-width: 767px) {
    grid-column: span 2; /* Nutzt die volle Breite unter den Stats */
    width: 100%;
  }

  @media (min-width: 768px) {
    grid-row: span 2; /* Auf Desktop wieder die volle Höhe rechts */
  }
`;

const Stats = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;

  /* Auf Desktop bleibt es eine Grid-Zelle im StatsGrid */
  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: 1fr;
  }
`;