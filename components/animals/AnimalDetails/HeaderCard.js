import styled from "styled-components";
import { useTranslation } from "next-i18next";

import CardContainer from "../../page-structure/CardContainer";
import MainImage from "../../page-structure/Elements/MainImage";
import PriceDisplay from "../../page-structure/icons/PriceDisplay";
import PopularityDisplay from "../../page-structure/icons/PopularityDisplay";
import StatBox from "../../page-structure/Elements/StatBox";
import GameIcon from "../../page-structure/icons/GameIcon";
import StallLevelBadge from "../../ui/StallLevelBadge";
import BoxWithHeadline from "../../page-structure/Elements/BoxWithHeadline";
import OriginBadgeList from "../../page-structure/Elements/OriginBadgeList";
import XPIcon from "../../page-structure/icons/XPIcon";
import FormattedDate from "../../ui/FormattedDate";
import { useRouter } from "next/router";


export default function HeaderCard({ animal }) {
  const { locale } = useRouter();
  const { t } = /** @type {any} */ (
    useTranslation(["animals", "common"])
  );

  // 1. Suche den Namen passend zur aktuellen Sprache im texte-Array
  const translation = animal.texte?.find(t => t.spracheCode === locale)
    || animal.texte?.find(t => t.spracheCode === 'de') // Fallback Deutsch
    || {};

  // 2. Priorität: Übersetzter Name -> Falls leer, nimm das Root-Feld .name
  const displayName = translation.name || animal.name || "Unbekannt";

  if (!animal) return null;

  return (
    <CardContainer>
      <MainImage animal={animal} />

      <InfoSection>
        <TitleRow>
          <TextContent>
            <h1>{displayName}</h1>
            <ReleaseDate>
              📅 {t("common:release")}:
              <FormattedDate
                date={animal.release}
                options={{ month: "long", day: "numeric" }}
              />
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
              <label>{t("animals:tablePrice")}</label>
              <PriceDisplay
                value={animal.preis}
                type={animal.preisart?.name.toLowerCase() || "gold"}
              />
            </StatBox>

            <StatBox>
              <label>{t("common:popularity")}</label>
              <PopularityDisplay
                popularity={animal.popularitaet}
              />
            </StatBox>
          </StatsGroup>

          <StatsGroup>
            <StatBox>
              <label>{t("animals:tableSell")}</label>
              <PriceDisplay
                value={animal.verkaufswert}
                type="zoodollar"
              />
            </StatBox>

            <StatBox>
              <label>{t("animals:tableRelease")}</label>
               <XPIcon
               label={animal.auswildern}
               />

            </StatBox>
          </StatsGroup>

          {/* Spalte 3 für die Gehege */}
          <BoxWithHeadline label={t("common:enclosure")}>
              {/* Gehegeart */}
              <GameIcon
                type={`gehege/${animal.gehege.name || 'placeholder'}/`}
                fileName="Gehege.webp"
                bordercolor="#4ca64c"
                size={45}
              />

              {/* Stall */}
              <StallLevelBadge
                level={animal.stalllevel}
                habitat={animal.gehege.name}
                size={45}
                showTooltip={true}
              />

              {/* Spielgerät */}
              {/*<GameIcon*/}
              {/*  type="/gehege/"*/}
              {/*  fileName={`${animal.gehege.name}.webp`}*/}
              {/*  bordercolor="#4ca64c"*/}
              {/*/>*/}
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
  align-items: flex-start; 
  width: 100%;

  @media (max-width: 768px) {
    align-items: center;
  }
`;

const TitleRow = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
`;

const BadgeWrapper = styled.div`
  margin-left: auto; 

  @media (max-width: 768px) {
    margin: 0; 
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
    grid-template-columns: repeat(2, 1fr) minmax(180px, 1.2fr);
    justify-content: start;
    gap: 15px;
    width: 100%;
  }
  
  @media (min-width: 768px) and (max-width: 1100px) {
    grid-template-columns: 1fr 1fr;
    
    & > :last-child {
      grid-column: span 2;
    }
  }
`;

const StatsGroup = styled.div`
  display: flex;
  gap: 15px;
  width: 100%;
  
  & > * {
    flex: 1;
  }

  @media (min-width: 768px) {
    flex-direction: column;
  }
`;