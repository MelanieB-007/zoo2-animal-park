import React, { useEffect, useState } from "react";
import styled from "styled-components";
import NextImage from "next/image";

import XPIcon from "../components/icons/XPIcon";
import PriceDisplay from "../components/icons/PriceDisplay";
import ZoodollarIcon from "../components/icons/ZoodollarIcon";
import GameIcon from "../components/icons/GameIcon";
import EditButton from "../components/icons/EditIcon";
import DeleteButton from "../components/icons/DeleteIcon";
import PageHeader from "../components/page-structure/Main/PageHeader";
import PageWrapper from "../components/page-structure/Main/PageWrapper";
import LoadingWrapper from "../components/page-structure/Elements/LoadingWrapper";
import { NameDE, NameEN } from "../components/page-structure/Elements/Name";
import FilterBar from "../components/page-structure/Elements/FilterBar";

const translations = {
  de: {
    searchPlaceholder: "Nach Tiernamen suchen...",
    allEnclosures: "Alle Gehege",
    allLevels: "Alle Stall-Level",
    level: "Level",
    resultsShow: "Zeige",
    resultsOf: "von",
    resultsAnimals: "Tieren",
    tableSpecies: "Tierart",
    tableEnclosure: "Gehege",
    tablePrice: "Preis",
    tableStall: "Stall-Lvl",
    tableSell: "Verkauf",
    tableRelease: "Auswild.",
    actions: "Aktionen",
    back: "ZURÜCK",
    next: "WEITER",
    loading: "Hole die Tiere aus dem Stall...",
    noResults: "Kein Tier mit diesem Namen gefunden...",
  },
  en: {
    searchPlaceholder: "Search for animal names...",
    allEnclosures: "All Enclosures",
    allLevels: "All Stall Levels",
    level: "Level",
    resultsShow: "Showing",
    resultsOf: "of",
    resultsAnimals: "animals",
    tableSpecies: "Species",
    tableEnclosure: "Enclosure",
    tablePrice: "Price",
    tableStall: "Stall Lvl",
    tableSell: "Sell",
    tableRelease: "Release",
    actions: "Actions",
    back: "BACK",
    next: "NEXT",
    loading: "Getting animals from the shelter...",
    noResults: "No animal found with this name...",
  },
};

const habitatColors = {
  gras: { main: "#47610d" },
  steppe: { main: "#924722" },
  wald: { main: "#224c0b" },
  berg: { main: "#39525e"},
  savanne: { main: "#c66f12" },
  dschungel: { main: "#4c7c07" },
  eis: { main: "#066eb8" },
  wasser: { main: "#4634c1" },
  blattdickicht: { main: "#779d59" },
  felsenwueste: { main: "#dcbc5d" },
  süsswasser: { main: "#71fef8" },
  salzwasser: { main: "#603bde" },
  noctarium: { main: "#a540a2" },
  default: { main: "#666666" }
};

export default function TiereUebersicht() {
  const [lang, setLang] = useState("de");
  const [tiere, setTiere] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGehege, setSelectedGehege] = useState("Alle");
  const [selectedLevel, setSelectedLevel] = useState("Alle");
  const itemsPerPage = 10;

  const t = translations[lang];
  const getAnimalName = (tier) => (lang === "de" ? tier.name : tier.nameEn);
  const getEnclosureName = (tier) =>
    tier.gehege?.name || (lang === "de" ? "Kein Gehege" : "No Enclosure");

  useEffect(() => {
    // Daten von der API abrufen
    fetch("/api/tiere")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setTiere(data);
        } else {
          console.error("Erwartete Array, erhielt:", data);
          setTiere([]); // Fallback auf leeres Array
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fehler beim Laden:", err);
        setTiere([]);
        setLoading(false);
      });
  }, []);

  // 1. Filtern basierend auf der Suche
  const filteredTiere = (tiere || []).filter((tier) => {
    const matchesSearch = tier.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesGehege =
      selectedGehege === "Alle" || tier.gehege?.name === selectedGehege;
    const matchesLevel =
      selectedLevel === "Alle" || String(tier.stalllevel) === selectedLevel;

    return matchesSearch && matchesGehege && matchesLevel;
  });

  const totalPages = Math.ceil(filteredTiere.length / itemsPerPage);

  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(totalPages);
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTiere.slice(indexOfFirstItem, indexOfLastItem);

  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  if (loading) {
    return (
      <LoadingWrapper>
        {t.searchPlaceholder} 🐾
      </LoadingWrapper>
    );
  }

  return (
    <PageWrapper>
      <PageHeader />

      <FilterBar>
        <SearchInput
          type="text"
          placeholder={t.searchPlaceholder}
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
          <option value="Alle">
            {t.allEnclosures} ({tiere.length})
          </option>

          {[...new Set(tiere.map((t) => t.gehege?.name))]
            .filter(Boolean)
            .map((name) => {
              const count = tiere.filter((t) => t.gehege?.name === name).length;

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
          <option value="Alle">{t.allLevels}</option>
          {[...new Set(tiere.map((t) => t.stalllevel))]
            .filter((lvl) => lvl !== undefined && lvl !== null)
            .sort((a, b) => a - b)
            .map((lvl) => (
              <option key={lvl} value={String(lvl)}>
                Level {lvl}
              </option>
            ))}
        </GehegeSelect>
      </FilterBar>

      <ResultsInfo>
        {t.resultsShow} <strong>{currentItems.length}</strong> {t.resultsOf}
        <strong> {filteredTiere.length}</strong> {t.resultsAnimals}
      </ResultsInfo>

      <TableFrame>
        <ZooTable>
          <thead>
            <tr>
              <th>{t.tableSpecies}</th>
              <th>{t.tableEnclosure}</th>
              <th>{t.tablePrice}</th>
              <th>{t.tableStall}</th>
              <DesktopOnlyTh>XP</DesktopOnlyTh>
              <DesktopOnlyTh>{t.tableSell}</DesktopOnlyTh>
              <DesktopOnlyTh>{t.tableRelease}</DesktopOnlyTh>
              <th style={{ textAlign: "center" }}>{t.actions}</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((tier) => (
                <AnimalRow key={tier.id}>
                  <td>
                    <TierInfoCell>
                      <GameIcon
                        type={`tiere/${(tier.gehege?.name || "standard").toLowerCase()}`}
                        fileName={tier.bild || "default.jpg"}
                      />
                      <div>
                        <NameDE>{tier.name}</NameDE>
                        <NameEN>{tier.nameEn}</NameEN>
                      </div>
                    </TierInfoCell>
                  </td>
                  <td>
                    <GehegeBadge $type={tier.gehege?.name}>
                      {tier.gehege?.name && (
                        <NextImage
                          src={`/images/gehege/icons/${tier.gehege.name.toLowerCase()}.webp`}
                          alt={tier.gehege.name}
                          width={20}
                          height={20}
                        />
                      )}

                    </GehegeBadge>
                  </td>
                  <td>
                    <PriceDisplay
                      value={tier.preis}
                      type={tier.preisart?.name.toLowerCase() || "gold"}
                    />
                  </td>
                  <td>
                    <span style={{ fontWeight: "bold" }}>
                      Lvl {tier.stalllevel}
                    </span>
                  </td>
                  <DesktopOnlyTd>
                    <XPIcon
                      label={
                        (tier.xpfuettern || 0) +
                        (tier.xpspielen || 0) +
                        (tier.xpputzen || 0)
                      }
                    />
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
                <td
                  colSpan="8"
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  {t.noResults} 🐾
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
          ></SignpostButton>

          {/* MITTELPFOSTEN MIT INFO */}
          <PageIndicator>
            <div>
              {currentPage}{" "}
              <small style={{ fontSize: "1rem", opacity: 0.5 }}>/</small>{" "}
              {totalPages}
            </div>
          </PageIndicator>

          {/* RECHTES SCHILD */}
          <SignpostButton
            direction="next"
            onClick={handleNext}
            disabled={currentPage === totalPages}
          ></SignpostButton>
        </SignpostAssembly>
      )}
    </PageWrapper>
  );
}


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

const TierInfoCell = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const AnimalRow = styled.tr`
  border-bottom: 1px solid #eee;

  &:hover {
    background: #f0fff0;
  }

  td {
    padding: 12px 15px;
  }
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

const GehegeBadge = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 6px 14px; /* Etwas mehr Padding für den "Pille"-Look */
  border-radius: 20px; /* Schön abgerundet */
  
  /* NEU: Wir nutzen die Upjers-Farbe als BASIS */
  /* Das "main" aus habitatColors ist deine Originalfarbe */
  /* Wir fügen "33" hinzu für ca. 20% Deckkraft (Transparenz) */
  background-color: ${(props) =>
  (habitatColors[props.$type?.toLowerCase()]?.main || habitatColors.default.main) + "33"};
  
  /* NEU: Ein Rand in der VOLLEN Upjers-Farbe für Definition */
  border: 2px solid ${(props) =>
  habitatColors[props.$type?.toLowerCase()]?.main || habitatColors.default.main};
  
  /* NEU: Der Text wird DUNKLER, passend zum braunen Icon */
  /* Ein dunkles Zoo-Grün oder Braun passt hier perfekt */
  color: #3e2723; /* Dunkles Braun, passend zu den Icons */
  
  font-weight: 800;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
  
  /* Ein sehr dezenter innerer Schatten für plastische Wirkung */
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 1px 2px rgba(0, 0, 0, 0.05);

  span {
    /* Optional: Text etwas schöner formatieren */
    letter-spacing: 0.3px;
  }

  img {
    /* WICHTIG: Das Icon bleibt BRAUN! */
    /* Wir entfernen alle filter-Spielereien */
    
    /* Das Icon ein bisschen tiefer setzen für die optische Mitte */
    margin-top: 1px;
    
    /* Ein minimaler drop-shadow, damit es sich vom 
       farbigen Hintergrund abhebt */
    filter: drop-shadow(0 1px 0 rgba(255, 255, 255, 0.6));
  }
`;


const ActionGroup = styled.div`
  display: flex;
  gap: 10px;
`;



const SearchInput = styled.input`
  width: 100%;
  max-width: 400px;
  padding: 12px 16px;
  font-size: 1rem;
  border: 2px solid #e0e7d5; 
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

const SignpostAssembly = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end; /* Richtet Schilder an der Unterkante aus */
  gap: 40px;
  margin-top: 40px;
`;

const SignpostButton = styled.button`
  position: relative;
  width: 160px;
  height: 65px;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease-in-out;

  /* Das Bild von Plexi als Hintergrund */
  background-image: url("/images/icons/wegweiser-rechts.png");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;

  /* Zurück-Button nach links drehen */

  ${(props) =>
    props.direction === "prev" &&
    `
    transform: scaleX(-1);
  `}
  &:hover:not(:disabled) {
    filter: brightness(1.1) drop-shadow(0 5px 15px rgba(0, 0, 0, 0.2));
    transform: translateY(-5px)
      ${(props) => (props.direction === "prev" ? "scaleX(-1)" : "scale(1.05)")};
  }

  &:disabled {
    filter: grayscale(1) opacity(0.4);
    cursor: not-allowed;
  }
`;

const PageIndicator = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  background-image: url("/images/icons/Holztafel.png");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;

  /* Diese Maße passen gut zu der 16:9 Optik deines Bildes */
  width: 150px;
  height: 60px;

  /* Ein kleiner negativer Margin oben schiebt die Tafel 
     optisch näher an die Wegweiser-Linie */
  margin-top: -10px;

  /* Falls der Text nicht ganz mittig im gelben Bereich sitzt, 
     kannst du hier mit padding nachjustieren */
  padding-bottom: 5px;

  div {
    font-size: 1.4rem;
    font-weight: 900;
    color: #2d5a27; /* Sattes Zoo-Grün */
    font-family: 'Playfair Display', serif;
    /* Ein ganz dezenter Schatten macht die Zahlen auf Gelb besser lesbar */
    text-shadow: 1px 1px 0 rgba(255, 255, 255, 0.6);
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
  font-family: "Inter", sans-serif;

  strong {
    color: #2d5a27; /* Ein dunkleres Zoo-Grün */
  }
`;