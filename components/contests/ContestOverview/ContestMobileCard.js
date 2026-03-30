import React from "react";
import styled, { keyframes } from "styled-components";
import { useTranslation } from "next-i18next";
import { Calendar } from "lucide-react";
import ItemThumbnail from "../../page-structure/icons/ItemThumbnail";
import { NameDE } from "../../page-structure/Elements/Name";
import { useRouter } from "next/router";

export default function ContestMobileCard({ contest, onClick }) {
  const { t } = useTranslation(["contests", "common"]);
  const { locale } = useRouter();

  const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
  const startDate = new Date(contest.start).toLocaleDateString(locale, options);
  const endDate = new Date(contest.ende).toLocaleDateString(locale, options);
  const isAktiv = new Date() >= new Date(contest.start) && new Date() <= new Date(contest.ende);

  return (
    <Card onClick={onClick}>
      <CardHeader>
        <DateInfo>
          <Calendar size={14} />
          <span>{startDate} - {endDate}</span>
        </DateInfo>
        <StatusWrapper
          $active={isAktiv}
          title={isAktiv ?
            t("contests:contestOverview.status.running") :
            t("contests:contestOverview.status.upcoming")}
        >
          <StatusDot $active={isAktiv} />
        </StatusWrapper>
      </CardHeader>

      <AnimalGrid>
        {contest.statuen && contest.statuen.map((link) => {
          const statue = link.statue;
          const tier = statue.tier;
          const localizedText =
            tier?.texte?.find((t) => t.spracheCode === locale) ||
            tier?.texte?.[0]; // Fallback auf den ersten Text, falls Sprache nicht gefunden

          const tiername = localizedText?.name || "Unbekannt";
          const tierBild = tier?.bild;

          return (
            <AnimalItem key={link.id}>
              <ItemThumbnail
                image={tierBild}
                name={tiername}
                size="65"
                category={`tiere/${(tier.gehege?.name || "standard").toLowerCase()}`}
                habitat={tier?.gehege}
              />
              <TinyName>{tiername}</TinyName>
            </AnimalItem>
          );
        })}
      </AnimalGrid>
    </Card>
  );
}

// --- Styled Components ---

const Card = styled.div`
  background: white;
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 12px;
  border: 1px solid #eee;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f5f5f5;
  padding-bottom: 8px;
`;

const DateInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  font-weight: 700;
  color: #555;
  svg { color: #88a04d; }
`;

const AnimalGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  padding: 5px 0;
`;

const AnimalItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background: #fdfdfd;
  padding: 6px;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
`;

const TinyName = styled(NameDE)`
  font-size: 0.7rem;
  margin-top: 4px;
  color: #444;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
`;

const StatusWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: help;
`;

const pulseShockwave = keyframes`
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(93, 122, 42, 0.9); /* Start: Kräftiges Grün */
  }
  30% {
    transform: scale(1.1); /* Kleiner "Schlag" nach außen */
    box-shadow: 0 0 0 10px rgba(93, 122, 42, 0.6); /* Breiterer Ring */
  }
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 18px rgba(93, 122, 42, 0); /* Verblasst komplett */
  }
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(93, 122, 42, 0);
  }
`;

const StatusDot = styled.div`
  width: 12px;
  height: 12px;
  background-color: ${props => props.$active ? "#5d7a2a" : "#bbb"};
  border-radius: 50%;
  margin: 0 auto;
  position: relative;

  /* Nur der aktive Wettbewerb pulsiert - Trick 3: Schnellere Frequenz (1.2s) */
  animation: ${props => props.$active ? pulseShockwave : "none"} 1.2s infinite ease-out;

  /* Fallback-Schatten für besseren Kontrast */
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);

  cursor: help;

  /* Zusätzlicher visueller Effekt: Ein "Kern" */
  ${props => props.$active && `
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 6px;
      height: 6px;
      background: white;
      border-radius: 50%;
      opacity: 0.8;
    }
  `}
`;