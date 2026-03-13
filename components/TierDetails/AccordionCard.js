import styled from "styled-components";
import InfoAccordion from "./InfoAccordion";
import StallLevelBadge from "../page-structure/Elements/StallLevelBadge";
import PriceDisplay from "../icons/PriceDisplay";
import NextImage from "next/image";
import XPIcon from "../icons/XPIcon";
import { formatMinutes } from "../ui/DateFormat";
import { XP_MAP } from "../../utils/XP_MAP";

const actionOrder = ["fuettern", "spielen", "putzen"];

export default function AccordionCard({ translationsAnimals, animal }) {
  // 1. Die Daten aus animal.xp ziehen (oder leeres Array falls nicht vorhanden)
  const xpData = animal.xp || [];

  // 2. hasData definieren (Prüfen, ob Kapazitäts-Daten vorhanden sind)
  const capacityData = animal.tier_gehege_kapazitaet || [];
  const hasData = capacityData.length > 0;

  // 3. Sortierung basierend auf deinem actionOrder-Array
  // Wir mappen die Keys aus actionOrder auf die IDs (0=fuettern, 1=spielen, 2=putzen)
  const sortedXp = [...xpData].sort((a, b) => {
    const orderA = actionOrder.indexOf(XP_MAP[a.xpart]?.key);
    const orderB = actionOrder.indexOf(XP_MAP[b.xpart]?.key);
    return orderA - orderB;
  });

  {
    sortedXp.map((item) => {
      const action = XP_MAP[item.xpart];

      return (
        <tr key={item.id}>
          <td>
            {action?.icon} {action?.label}
          </td>
          <td>{formatMinutes(item.zeit)}</td>
          <td>
            {item.wert} <span className="xp-star">★</span>
          </td>
        </tr>
      );
    });
  }

  return (
    <aside>
      {/* Zucht Accordion */}
      <InfoAccordion
        title={translationsAnimals.breeding}
        icon="/images/icons/breeding.png"
      >
        <InfoRow>
          <span>{translationsAnimals.tableStall}</span>
          <StallLevelBadge
            level={animal.stalllevel}
            habitat={animal.gehege.name}
          />
        </InfoRow>

        <InfoRow>
          <span>{translationsAnimals.costs}</span>
          <PriceDisplay value={animal.zuchtkosten} type="Zoodollar" />
        </InfoRow>

        <InfoRow>
          <span>{translationsAnimals.time}</span>
          {animal.zuchtdauer} h
        </InfoRow>
      </InfoAccordion>

      {/* XP & Aktionen Accordion */}
      <InfoAccordion
        title={translationsAnimals.xpAndActions}
        icon="/images/icons/star.png"
      >
        <XpTable>
          <thead>
            <tr>
              <th>{translationsAnimals.action}</th>
              <th>{translationsAnimals.time}</th>
              <THRechts>XP</THRechts>
            </tr>
          </thead>
          <tbody>
            {sortedXp.map((item) => {
              const actionInfo = XP_MAP[item.xpart];
              return (
                <tr key={item.id}>
                  <td>
                    <NextImage
                      src={actionInfo?.icon}
                      alt="XP"
                      width={25}
                      height={25}
                    />
                  </td>
                  <td>
                    {formatMinutes(item.zeit)}
                  </td>
                  <td>
                    <XPIcon label={item.wert} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </XpTable>
      </InfoAccordion>

      <InfoAccordion title="Anzahl Tiere pro Gehege" icon="/images/icons/pfote.png">
        {hasData ? (
          <XpTable>
            <thead>
              <tr>
                <TableHeader>Anzahl Tiere</TableHeader>
                <TableHeader>Gehegegröße (Felder)</TableHeader>
              </tr>
            </thead>
            <tbody>
              {animal.tier_gehege_kapazitaet.map((kap) => (
                <tr key={kap.anzahlTiere}>
                  <TableCell>{kap.anzahlTiere}</TableCell>
                  <TableCell>{kap.felder}</TableCell>
                </tr>
              ))}
            </tbody>
          </XpTable>
        ) : (
          <EmptyState>Daten werden gerade vom System erfasst...</EmptyState>
        )}
      </InfoAccordion>
    </aside>
  );
}

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }
`;

const XpTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;

  th {
    text-align: right;
    color: #888;
    padding-bottom: 8px;
    font-weight: normal;
  }

  td {
    padding: 6px 0;
    border-bottom: 1px solid #f5f5f5;
  }

  .xp-star {
    color: #f1c40f;
  }
`;

const THRechts = styled.th`
  text-align: right !important;
  display: table-cell; 
`;

const TableHeader = styled.th`
  text-align: left;
  padding: 8px;
  background-color: #f8f9fa;
  border-bottom: 2px solid #e9ecef;
  font-weight: 600;
`;

const TableCell = styled.td`
  padding: 8px;
  border-bottom: 1px solid #eee;
  text-align: right;
  
  &:first-child {
    font-weight: bold;
    color: #555;
  }
`;

const EmptyState = styled.p`
  padding: 15px;
  text-align: center;
  color: #888;
  font-style: italic;
`;