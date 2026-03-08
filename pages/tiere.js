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
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGehege, setSelectedGehege] = useState("Alle"); // <-- NEU
  const [selectedLevel, setSelectedLevel] = useState("Alle");
  const itemsPerPage = 10;

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

  // 1. Filtern basierend auf der Suche
  const filteredTiere = tiere.filter(tier => {
    const matchesSearch = tier.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGehege = selectedGehege === "Alle" || tier.gehege?.name === selectedGehege;
    const matchesLevel = selectedLevel === "Alle" || String(tier.stalllevel) === selectedLevel;

    return matchesSearch && matchesGehege && matchesLevel;
  });

  // Berechnung der Gesamtseiten
  const totalPages = Math.ceil(filteredTiere.length / itemsPerPage);

  // 3. Seitenzahl korrigieren, falls durch Filterung die aktuelle Seite "leer" wird
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(totalPages);
  }

  // 4. Pagination auf die gefilterte Liste anwenden
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTiere.slice(indexOfFirstItem, indexOfLastItem);

  // 5. Die Funktionen für die Wegweiser-Buttons
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  2.
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

      <FilterBar>
        <SearchInput
          type="text"
          placeholder="Nach Tiernamen suchen..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />

        <GehegeSelect
          value={selectedGehege}
          onChange={(e) => {
            setSelectedGehege(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="Alle">Alle Gehege ({tiere.length})</option>

          {/* Wir extrahieren alle einzigartigen Gehegenamen */}
          {[...new Set(tiere.map(t => t.gehege?.name))].filter(Boolean).map(name => {
            // Hier zählen wir, wie viele Tiere zu diesem Gehege gehören
            const count = tiere.filter(t => t.gehege?.name === name).length;

            return (
              <option key={name} value={name}>
                {name} ({count})
              </option>
            );
          })}
        </GehegeSelect>

        <GehegeSelect
          value={selectedLevel}
          onChange={(e) => {
            setSelectedLevel(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="Alle">Alle Stall-Level</option>
          {/* Wir holen uns alle einzigartigen Level, sortieren sie aufsteigend */}
          {[...new Set(tiere.map(t => t.stalllevel))]
            .filter(lvl => lvl !== undefined && lvl !== null) // Behält die 0!
            .sort((a, b) => a - b)
            .map(lvl => (
              <option key={lvl} value={String(lvl)}>
                Level {lvl}
              </option>
            ))}
        </GehegeSelect>

      </FilterBar>

      <ResultsInfo>
        Zeige <strong>{currentItems.length}</strong> von <strong>{filteredTiere.length}</strong> {selectedGehege === "Alle" ? "Tieren" : `${selectedGehege}tieren`}
      </ResultsInfo>

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
          {currentItems.length > 0 ? (
            currentItems.map((tier) => (
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
                  <GehegeBadge>{tier.gehege?.name || 'Kein Gehege'}</GehegeBadge>
                </td>
                <td>
                  <PriceDisplay
                    value={tier.preis}
                    type={tier.preisart?.name.toLowerCase() || 'gold'}
                  />
                </td>
                <td>
                  <span style={{ fontWeight: 'bold' }}>Lvl {tier.stalllevel}</span>
                </td>
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
            ))
          ) : (
            <tr>
              <td colSpan="8" style={{ textAlign: 'center', padding: '20px' }}>
                Kein Tier mit diesem Namen gefunden... 🐾
              </td>
            </tr>
          )}
          </tbody>
        </ZooTable>
      </TableFrame>
      {totalPages > 1 && (
        <SignpostAssembly>
          {/* LINKES SCHILD */}
          <SignpostButton
            direction="prev"
            onClick={handlePrev}
            disabled={currentPage === 1}
          >
            <SignpostLabel direction="prev">ZURÜCK</SignpostLabel>
          </SignpostButton>

          {/* MITTELPFOSTEN MIT INFO */}
          <PageIndicator>
            <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Register</span>
            <div style={{ fontSize: '1.5rem', fontWeight: '900' }}>
              {currentPage} / {totalPages}
            </div>
          </PageIndicator>

          {/* RECHTES SCHILD */}
          <SignpostButton
            direction="next"
            onClick={handleNext}
            disabled={currentPage === totalPages}
          >
            <SignpostLabel direction="next">WEITER</SignpostLabel>
          </SignpostButton>
        </SignpostAssembly>
      )}
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

const FilterBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto 20px auto;
  padding: 0 10px;
  gap: 15px;
`;

const SearchInput = styled.input`
  width: 100%;
  max-width: 400px;
  padding: 12px 16px;
  font-size: 1rem;
  border: 2px solid #e0e7d5; /* Ein ganz helles Zoo-Grün */
  border-radius: 12px;
  background-color: white;
  color: #333;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  &:focus {
    outline: none;
    border-color: #8dbd5b; /* Dein Badge-Grün */
    box-shadow: 0 0 0 4px rgba(141, 189, 91, 0.1);
    transform: translateY(-1px);
  }

  &::placeholder {
    color: #a0a0a0;
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 24px;
  padding-bottom: 40px;
`;

const PageButton = styled.button`
  background-color: #8dbd5b;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover:not(:disabled) {
    background-color: #76a44a;
    transform: translateY(-1px);
  }

  &:disabled {
    background-color: #e0e0e0;
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const PageInfo = styled.span`
  font-family: 'Inter', sans-serif;
  color: #666;
  font-size: 0.9rem;
  font-weight: 500;
`;

const SignpostAssembly = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end; /* Richtet Schilder an der Unterkante aus */
  gap: 40px;
  margin-top: 40px;
  padding-bottom: 50px;
`;

const SignpostButton = styled.button`
  position: relative;
  width: 180px; 
  height: 85px;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease-in-out;

  /* Das Bild von Plexi als Hintergrund */
  background-image: url('/images/wegweiser.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;

  /* Zurück-Button nach links drehen */
  ${props => props.direction === 'prev' && `
    transform: scaleX(-1);
  `}

  &:hover:not(:disabled) {
    filter: brightness(1.1) drop-shadow(0 5px 15px rgba(0,0,0,0.2));
    transform: translateY(-5px) ${props => props.direction === 'prev' ? 'scaleX(-1)' : 'scale(1.05)'};
  }

  &:disabled {
    filter: grayscale(1) opacity(0.4);
    cursor: not-allowed;
  }
`;

const SignpostLabel = styled.span`
  font-family: 'Playfair Display', serif;
  font-weight: 900;
  color: white;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
  font-size: 1.1rem;
  z-index: 2;

  /* Text beim Zurück-Button wieder lesbar machen */
  ${props => props.direction === 'prev' && `
    transform: scaleX(-1);
  `}
`;

const PageIndicator = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Inter', sans-serif;
  color: #1a331a;
  padding-bottom: 10px;

  /* Der Holzpfosten, an dem die Schilder "hängen" */
  &::before {
    content: '';
    width: 16px;
    height: 120px;
    background: linear-gradient(90deg, #5d3a1a 0%, #3e2711 100%);
    border-radius: 4px;
    position: absolute;
    z-index: -1;
    transform: translateY(-20px);
    box-shadow: 2px 0 10px rgba(0,0,0,0.2);
  }
`;

const GehegeSelect = styled.select`
  padding: 12px 16px;
  font-size: 1rem;
  border: 2px solid #e0e7d5;
  border-radius: 12px;
  background-color: white;
  color: #333;
  cursor: pointer;
  min-width: 220px; /* Damit das Dropdown nicht springt, wenn die Zahlen zweistellig werden */
  transition: all 0.2s;

  /* Ein schöneres Pfeil-Icon für das Dropdown (optional) */
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%238dbd5b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
  padding-right: 40px;

  &:focus {
    outline: none;
    border-color: #8dbd5b;
    box-shadow: 0 0 0 4px rgba(141, 189, 91, 0.1);
  }
`;

const ResultsInfo = styled.p`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto 10px auto;
  padding: 0 10px;
  font-size: 0.9rem;
  color: #666;
  font-family: 'Inter', sans-serif;

  strong {
    color: #2d5a27; /* Ein dunkleres Zoo-Grün */
  }
`;