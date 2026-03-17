import styled from "styled-components";

import CardContainer from "../page-structure/CardContainer";
import MainImage from "../page-structure/Elements/MainImage";
import PriceDisplay from "../icons/PriceDisplay";
import PopularityDisplay from "../icons/PopularityDisplay";
import StatBox from "../page-structure/Elements/StatBox";
import GameIcon from "../icons/GameIcon";
import StallLevelBadge from "../page-structure/Elements/StallLevelBadge";
import BoxWithHeadline from "../page-structure/Elements/BoxWithHeadline";
import OriginBadgeList from "../page-structure/Elements/OriginBadgeList";
import XPIcon from "../icons/XPIcon";
import { useTranslation } from "next-i18next";

export default function HeaderCard({ animal }) {
  const { t } = useTranslation(['common', 'animal']);

  return (
    <CardContainer>
      <MainImage animal={animal} />

      <InfoSection>
        <TitleRow>
          <TextContent>
            <h1>{animal.name}</h1>
            <ReleaseDate>
              📅 {t('release', { ns: 'common' })}: {animal.release}
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
              <label>
                {t('price', { ns: 'common' })}
              </label>
              <PriceDisplay
                value={animal.preis}
                type={animal.preisart?.name.toLowerCase() || "gold"}
              />
            </StatBox>

            <StatBox>
              <label>
                {t('popularity', { ns: 'common' })}
              </label>
              <PopularityDisplay
                popularity={animal.popularitaet}
              />
            </StatBox>
          </StatsGroup>

          <StatsGroup>
            <StatBox>
              <label>{t('sell', { ns: 'animal' })}</label>
              <PriceDisplay
                value={animal.verkaufswert}
                type="zoodollar"
              />
            </StatBox>

            <StatBox>
              <label>
                {t('release', { ns: 'animal' })}
              </label>
               <XPIcon
               label={t('release', { ns: 'animal' })}
               />

            </StatBox>
          </StatsGroup>

          {/* Spalte 3 für die Gehege */}
          <BoxWithHeadline>
              {/* Gehegeart */}
              <GameIcon
                type={`/gehege/${animal.gehege.name}`}
                fileName="Gehege.webp"
                bordercolor="var(--color-green-blue)"
              />

              <StallLevelBadge
                level={animal.stalllevel}
                habitat={animal.gehege.name}
              />

              {/* Spielgerät */}
              
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
    color: var(--color-petrol-dark);
    margin: 0;
    font-size: 1.8rem;
    line-height: 1.2;
  }

  .release-info {
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--color-grey-light);
    font-size: 0.8rem;
    margin-top: 8px;
    background: var(--color-white);
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
    grid-template-columns: repeat(2, 220px) minmax(220px, 1fr);
    justify-content: start; 
    gap: 15px;
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
    flex-direction: column;
  }
`;

const SectionHeadline = styled.h2`
  display: flex;
  align-items: center;
  gap: 12px;                 
  
  /* HINTERGRUND & FORM */
  background: var(--color-white);         
  border: 1.5px solid var(--color-lime); 
  border-radius: 30px;         
  padding: 8px 24px;          
  width: fit-content;          
  
  /* TEXT-STYLING */
  color: var(--color-petrol-dark);             
  font-size: 1.3rem;         
  font-weight: 600;
  
  /* POSITIONIERUNG */
  margin: 35px 0 20px 5px;    
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.03); 
  
  &::after {
    content: "";
    flex: 1;
    height: 1.5px;
    background-color: var(--color-lime);
    margin-left: 20px;
    opacity: 0.5;
  }
`;