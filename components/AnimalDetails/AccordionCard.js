import styled from "styled-components";
import NextImage from "next/image";

import InfoAccordion from "../page-structure/Elements/InfoAccordion";
import StallLevelBadge from "../page-structure/Elements/StallLevelBadge";
import PriceDisplay from "../icons/PriceDisplay";
import XPIcon from "../icons/XPIcon";
import { formatMinutes } from "../ui/XpDateFormat";
import { XP_MAP } from "../../utils/XP_MAP";
import { useTranslation } from "next-i18next";
import InfoAccordionRow from "../page-structure/Elements/InfoAccordionRow";
import DataRow from "../ui/DataRow";

const actionOrder = ["fuettern", "spielen", "putzen"];

export default function AccordionCard({ translationsAnimals, animal }) {
  const { t } = /** @type {any} */ (
    useTranslation(["animals", "common"])
  );

  const xpData = animal.xp || [];
  const capacityData = animal.tier_gehege_kapazitaet || [];
  const hasCapacity = capacityData.length > 0;

  // 3. Sortierung
  const sortedXp = [...xpData].sort((a, b) => {
    const orderA = actionOrder.indexOf(XP_MAP[a.xpart]?.key);
    const orderB = actionOrder.indexOf(XP_MAP[b.xpart]?.key);
    return orderA - orderB;
  });

  return (
    <aside>
      <InfoAccordion
        title={t("animals:breeding.breeding")}
        icon="/images/icons/breeding.png"
      >
          <DataRow label={t("nimals:table.stall")}>
            <StallLevelBadge
              level={animal.stalllevel}
              habitat={animal.gehege?.name}
              size={35}
              showTooltip={false}
            />
          </DataRow>

          <DataRow label={t("common:costs")}>
            <PriceDisplay value={animal.zuchtkosten} type="zoodollar" />
          </DataRow>

          <DataRow label={t("common:time")}>
            <strong>{animal.zuchtdauer} h</strong>
          </DataRow>

          <DataRow label={t("animals:breeding.breedingChance")}>
            <strong>{animal.startprozent} %</strong>
          </DataRow>
      </InfoAccordion>

      {/* XP & Aktionen Accordion */}
      <InfoAccordion
        title={t("animals:breeding.xpAndActions")}
        icon="/images/icons/star.png"
      >
        <XpTable>
          <thead>
          <tr>
            <th style={{ textAlign: 'left' }}>{t("common:action")}</th>
            <th>{t("common:time")}</th>
            <THRechts>XP</THRechts>
          </tr>
          </thead>
          <tbody>
          {sortedXp.map((item) => {
            const actionInfo = XP_MAP[item.xpart];
            return (
              <tr key={item.id}>
                <td>
                  <ActionWrapper>
                    {actionInfo?.icon && (
                      <NextImage
                        src={actionInfo.icon}
                        alt={actionInfo.key}
                        width={20}
                        height={20}
                      />
                    )}
                    <span>{t(`animals:actions.${actionInfo?.key}`)}</span>
                  </ActionWrapper>
                </td>
                <td style={{ textAlign: 'center' }}>
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

      {/* Kapazität Accordion */}
      <InfoAccordion
        title={t("animals:biomesCapacity") || "Anzahl Tiere pro Gehege"}
        icon="/images/icons/pfote.png"
      >
        {hasCapacity ? (
          <XpTable>
            <thead>
            <tr>
              <TableHeader>
                {t("animals:animalCount") || "Anzahl Tiere"}
              </TableHeader>
              <TableHeader>
                {t("animals:biomeSize") || "Gehegegröße (Felder)"}
              </TableHeader>
            </tr>
            </thead>
            <tbody>
            {capacityData.map((kap) => (
              <tr key={kap.anzahlTiere}>
                <TableCell>{kap.anzahlTiere}</TableCell>
                <TableCell>{kap.felder}</TableCell>
              </tr>
            ))}
            </tbody>
          </XpTable>
        ) : (
          <EmptyState>
            {t("common:loading_data") || "Daten werden gerade vom System erfasst..."}
          </EmptyState>
        )}
      </InfoAccordion>
    </aside>
  );
}

const ActionWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  text-transform: capitalize;
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