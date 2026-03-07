import React from 'react';
import styled from 'styled-components';
import XPIcon from "../components/icons/XPIcon";
import PriceDisplay from "../components/icons/PriceDisplay";
import ZoodollarIcon from "../components/icons/ZoodollarIcon";
import GameIcon from "../components/icons/GameIcon";
import EditButton from "../components/icons/EditIcon";
import DeleteButton from "../components/icons/DeleteIcon";

export default function TiereUebersicht() {
  const tiere = [
    {
      id: 1,
      image: "https://via.placeholder.com/50",
      name_de: "Achal-Tekkiner",
      name_en: "Akhal-Teke",
      gehege: "Gras",
      stall_level: 2,
      preis: 8,
      waehrung: 'diamond',
      xp: 450,
      verkauf: 2500,
      auswilderung: 150
    }
  ];

  return (
    <PageWrapper>
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
                  <GameIcon type="tiere/gras" fileName="achal-tekkiner.jpg" />
                  <div>
                    <NameDE>{tier.name_de}</NameDE>
                    <NameEN>{tier.name_en}</NameEN>
                  </div>
                </TierInfoCell>
              </td>

              <td><GehegeBadge>{tier.gehege}</GehegeBadge></td>

              <td>
                  <PriceDisplay value= {tier.preis} type={tier.waehrung} />
              </td>

              <td><span style={{fontWeight: 'bold'}}>Lvl {tier.stall_level}</span></td>

              {/* Desktop-Spalten */}
              <DesktopOnlyTd>
                <XPIcon label={tier.xp} />
              </DesktopOnlyTd>
              <DesktopOnlyTd>
                <ZoodollarIcon value={tier.verkauf} />
              </DesktopOnlyTd>
              <DesktopOnlyTd>
                <XPIcon label={tier.auswilderung} />
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
  padding: 20px;
  background-color: #d6efc0;
  border: 2px solid #4ca64c;
  border-radius: var(--border-radius);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  
  @media (min-width: 768px) { 
    padding: 40px;
  }
`;

const TableFrame = styled.div`
  background: white;
  border: 2px solid #4ca64c;
  border-radius: var(--border-radius);
  overflow-x: auto; // Ermöglicht horizontales Scrollen auf ganz kleinen Handys
`;

const ZooTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 600px; // Verhindert, dass die Tabelle zu sehr gequetscht wird

  th {
    background: #f9fbf9;
    padding: 15px;
    text-align: left;
    color: #4ca64c;
    border-bottom: 2px solid #eef2ee;
  }
`;

const AnimalRow = styled.tr`
  border-bottom: 1px solid #eee;
  &:hover { background: #f0fff0; }
  td { padding: 12px 15px; }
`;

// Responsive Helfer
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