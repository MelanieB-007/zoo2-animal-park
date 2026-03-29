import React from "react";
import { useTranslation } from "next-i18next";
import styled, { keyframes } from "styled-components";

import Table from "../../page-structure/Table/Table";
import { NameDE } from "../../page-structure/Elements/Name";
import ItemThumbnail from "../../page-structure/icons/ItemThumbnail";
import LinkedRow from "../../page-structure/Table/LinkedRow";
import ActionsHeadline from "../../page-structure/Table/ActionsHeadline";
import ActionGroupIcons from "../../page-structure/Table/ActionGroupIcons";

export default function ContestDesktopTable({ contests, onEdit, onDelete }) {
  const { t } = /** @type {any} */ (
    useTranslation(["animals", "contests", "common"])
  );

  const options = { day: "2-digit", month: "2-digit", year: "numeric" };

  return (
    <Table>
      <thead>
        <tr>
          <th>{t("contests:contestOverview.table.period")}</th>
          <th>{t("contests:contestOverview.table.statues_animals")}</th>
          <th>{t("contests:contestOverview.table.status")}</th>
          <ActionsHeadline text={t("common:actions")} />
        </tr>
      </thead>
      <tbody>
        {contests.map((contest) => {
          const startDate = new Date(contest.start).toLocaleDateString(
            "de-DE",
            options
          );
          const endDate = new Date(contest.ende).toLocaleDateString(
            "de-DE",
            options
          );
          const isAktiv =
            new Date() >= new Date(contest.start) &&
            new Date() <= new Date(contest.ende);

          return (
            <LinkedRow key={contest.id} path={`/contests/${contest.id}`}>
              {/* Zeitraum */}
              <td>
                <DateWrapper>
                  <span>{startDate}</span>
                  <Divider>-</Divider>
                  <span>{endDate}</span>
                </DateWrapper>
              </td>

              {/* Die 3 Tiere/Statuen */}
              <td>
                <StatueGroup>
                  {contest.statuen &&
                    contest.statuen.map((link) => {
                      const statue = link.statue;
                      const tier = statue.tier;
                      const tiername = tier?.texte?.[0]?.name || "Unbekannt";
                      const tierBild = tier?.bild;

                      return (
                        <AnimalCard key={link.id}>
                          <ItemThumbnail
                            image={tierBild}
                            name={tiername}
                            size="65"
                            category={`tiere/${(tier.gehege?.name || "standard").toLowerCase()}`}
                            habitat={tier?.gehege}
                          />
                          <NameStack>
                            <NameDE>{tiername}</NameDE>
                            <SubText>{tier?.gehege?.name}</SubText>
                          </NameStack>
                        </AnimalCard>
                      );
                    })}
                </StatueGroup>
              </td>

              {/* Status Badge */}
              <td>
                <StatusWrapper
                  $active={isAktiv}
                  title={
                    isAktiv
                      ? t("contests:status.running")
                      : t("contests:status.upcoming")
                  }
                >
                  <StatusDot $active={isAktiv} />
                </StatusWrapper>
              </td>

              <td>
                <ActionGroupIcons
                  localeFile="contests"
                  onEdit={() => onEdit(contest.id)}
                  onDelete={() => onDelete(contest.id)}
                />
              </td>
            </LinkedRow>
          );
        })}
      </tbody>
    </Table>
  );
}

// --- Styles ---

const DateWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.95rem;
  line-height: 1.1;
  color: #333;
  padding: 4px 0;
`;

const Divider = styled.span`
  height: 14px;
  display: flex;
  align-items: center;
  color: #88a04d;
  font-size: 1.2rem;
  user-select: none;
`;

const StatueGroup = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
`;

const AnimalCard = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background: white;
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  min-width: 200px;
`;

const NameStack = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1.2;
`;

const SubText = styled.span`
  font-size: 0.7rem;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
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
  background-color: ${(props) => (props.$active ? "#5d7a2a" : "#bbb")};
  border-radius: 50%;
  margin: 0 auto;
  position: relative;

  /* Nur der aktive Wettbewerb pulsiert - Trick 3: Schnellere Frequenz (1.2s) */
  animation: ${(props) => (props.$active ? pulseShockwave : "none")} 1.2s
    infinite ease-out;

  /* Fallback-Schatten für besseren Kontrast */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  cursor: help;

  /* Zusätzlicher visueller Effekt: Ein "Kern" */
  ${(props) =>
    props.$active &&
    `
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