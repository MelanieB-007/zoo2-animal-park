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

  // 2. Sortierung basierend auf deinem actionOrder-Array
  // Wir mappen die Keys aus actionOrder auf die IDs (0=fuettern, 1=spielen, 2=putzen)
  const sortedXp = [...xpData].sort((a, b) => {
    const orderA = actionOrder.indexOf(XP_MAP[a.xpart]?.key);
    const orderB = actionOrder.indexOf(XP_MAP[b.xpart]?.key);
    return orderA - orderB;
  });

  {sortedXp.map((item) => {
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
  })}

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
          <NextImage
            src="/images/icons/clock.png"
            alt={translationsAnimals.time}
          />
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
              <th>XP</th>
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
                />
                </td>
                <td>
                  <NextImage
                    src="/images/icons/clock.png"
                    alt={translationsAnimals.time}
                    width={16}
                    height={16}
                  />
                  {formatMinutes(item.zeit)}
                </td>
                <td>
                  <XPIcon
                  label={item.wert}
                  />
                </td>
              </tr>
          );
          })}
          </tbody>
        </XpTable>
      </InfoAccordion>

      {/* Anzahl Tiere pro Gehege */}
      <InfoAccordion title="Anzahl Tiere pro Gehege" icon="🐾">
        <XpTable>
          <thead>
            <tr>
              <th>Tiere</th>
              <th>Gehegegröße</th>
            </tr>
          </thead>
          <tbody>
            {/* Das hier schreit nach einem animal.enclosureCapacities.map() */}
            <tr>
              <td>1</td>
              <td>9</td>
            </tr>
            <tr>
              <td>2</td>
              <td>9</td>
            </tr>
          </tbody>
        </XpTable>
      </InfoAccordion>
    </aside>
  );
}

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f5f5f5;
  &:last-child { border-bottom: none; }
`;

const XpTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
  
  th { text-align: left; color: #888; padding-bottom: 8px; font-weight: normal; }
  td { padding: 6px 0; border-bottom: 1px solid #f5f5f5; }
  .xp-star { color: #f1c40f; }
`;