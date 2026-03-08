import React, { useEffect, useState } from "react";
import styled from 'styled-components';
import XPIcon from "../components/icons/XPIcon";
import PriceDisplay from "../components/icons/PriceDisplay";
import ZoodollarIcon from "../components/icons/ZoodollarIcon";
import GameIcon from "../components/icons/GameIcon";
import EditButton from "../components/icons/EditIcon";
import DeleteButton from "../components/icons/DeleteIcon";
import PageHeader from "../components/animal-overview/PageHeader";

export default function TiereUebersicht() {
  const [tiere, setTiere] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Daten von der API abrufen
    fetch('/api/tiere')
      .then(res => res.json())
      .then(data => {
        setTiere(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Fehler beim Laden:", err);
        setLoading(false);
      });
  }, []);

  if (loading){
    return (
      <LoadingWrapper>
        Hole die Tiere aus dem Stall... 🐾
      </LoadingWrapper>
    );
  }

  return (
    <PageWrapper>
      <PageHeader />
      <TableFrame>
        <ZooTable>
          <thead>
          <tr>
            <th>Tierart</th>
            <th>Gehege</th>
            <th>Preis</th>
            <th>Stall-Lvl</th>

            <DesktopOnlyTh>XP</DesktopOnlyTh>
            <DesktopOnlyTh>Verkauf</DesktopOnlyTh>
            <DesktopOnlyTh>Auswild.</DesktopOnlyTh>
            <th style={{ textAlign: 'center' }}>Aktionen</th>
          </tr>
          </thead>
          <tbody>
          {tiere.map(tier => (
            <AnimalRow key={tier.id}>
              <td>
                <TierInfoCell>
                  <GameIcon
                    type={`tiere/${(tier.gehege?.name || 'standard').toLowerCase()}`}
                    fileName={tier.bild || 'default.jpg'}
                  />
                  <div>
                    <NameDE>{tier.name}</NameDE>
                    <NameEN>{tier.nameEn}</NameEN>
                  </div>
                </TierInfoCell>
              </td>

              <td>
                <GehegeBadge>
                  {tier.gehege?.name || 'Kein Gehege'}
                </GehegeBadge>
              </td>

              <td>
                  <PriceDisplay
                    value={tier.preis}
                    type={tier.preisart?.name.toLowerCase() || 'gold'}
                  />
              </td>

              <td>
                <span style={{fontWeight: 'bold'}}>
                  Lvl {tier.stalllevel}
                </span>
              </td>

              {/* Desktop-Spalten */}
              <DesktopOnlyTd>
                <XPIcon label={(tier.xpfuettern || 0) + (tier.xpspielen || 0) + (tier.xpputzen || 0)} />
              </DesktopOnlyTd>
              <DesktopOnlyTd>
                <ZoodollarIcon value={tier.verkaufswert} />
              </DesktopOnlyTd>
              <DesktopOnlyTd>
                <XPIcon label={tier.auswildern} />
              </DesktopOnlyTd>

              <td>
                <ActionGroup>
                  <EditButton />
                  <DeleteButton />
                 </ActionGroup>
              </td>
            </AnimalRow>
          ))}
          </tbody>
        </ZooTable>
      </TableFrame>
    </PageWrapper>
  );
}


const PageWrapper = styled.div`
  padding: 40px 20px;
  background-color: #d6efc0;
  border: 2px solid #4ca64c;
  border-radius: var(--border-radius);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  @media (min-width: 768px) { 
    padding: 40px;
  }
`;

const TableFrame = styled.div`
  background: white;
  border: 2px solid #4ca64c;
  border-radius: var(--border-radius);
  overflow-x: auto;
`;

const ZooTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;

  th {
    background: #f9fbf9;
    padding: 15px;
    text-align: left;
    color: #4ca64c;
    border-bottom: 2px solid #eef2ee;
  }
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #d6efc0;
  font-weight: bold;
  color: #4ca64c;
`;

const TierInfoCell = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const AnimalRow = styled.tr`
  border-bottom: 1px solid #eee;
  &:hover { background: #f0fff0; }
  td { padding: 12px 15px; }
`;

const DesktopOnlyTh = styled.th`
  @media (max-width: 1024px) { 
    display: none; 
  }
`;

const DesktopOnlyTd = styled.td`
  @media (max-width: 1024px) { 
    display: none; 
  }
`;

const NameDE = styled.div`
  font-weight: bold;
  color: #1a331a;
  font-size: 1rem;
`;

const NameEN = styled.div`
  font-size: 0.8rem;
  color: #666;
  opacity: 0.7;
  font-style: italic;
`;

const GehegeBadge = styled.span`
  background: #e2f2e2;
  color: #2d5a27;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.85rem;
`;


const ActionGroup = styled.div`
  display: flex;
  gap: 10px;
`;