import { useState } from "react";
import styled from "styled-components";
import { useTranslation } from "next-i18next";
import useSWR from "swr";

import DynamicRowInput from "../page-structure/Elements/DynamicRowInput";
import ActionRow from "./ActionRow";
import OriginTransfer from "../AnimalDetails/OriginTransfer";
import LanguageSection from "../page-structure/Elements/LanguageSection";
import PageHeader from "../page-structure/PageHeader";
import InfoAccordion from "../page-structure/Elements/InfoAccordion";
import InfoAccordionRow from "../page-structure/Elements/InfoAccordionRow";
import PriceDisplay from "../icons/PriceDisplay";
import DataRow from "../ui/DataRow";
import InputGroup from "../ui/InputGroup";
import { FormInput } from "../ui/FormInput";
import FormSelect from "../ui/FormSelect";
import BreedingSection from "./BreedingSection";
import PriceSection from "./PriceSection";
import BasicInfoSection from "./BasicInfoSection";


export default function AnimalForm({ initialData }) {
  const { t } = /** @type {any} */ (useTranslation(["animals", "common"]));

  // --- 1. SWR DATEN LADEN ---
  const { data: origins } = useSWR('/api/origins');
  const { data: biomes } = useSWR('/api/biomes');

  // ... dein restlicher Code (useState, handlers etc.)
  const [selectedOrigins, setSelectedOrigins] = useState(initialData?.origins || []);

  // Wir prüfen mit Array.isArray(), ob wir wirklich eine Liste haben
  const availableOrigins = Array.isArray(origins)
    ? origins.filter((o) => !selectedOrigins.find((s) => s.id === o.id))
    : [];

  const moveRight = (item) => setSelectedOrigins([...selectedOrigins, item]);
  const moveLeft = (item) => setSelectedOrigins(selectedOrigins.filter(o => o.id !== item.id));

// --- 2. HANDLER FÜR EINFACHE FELDER ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Wir bauen das "texte"-Array für die Datenbank zusammen
    const allTexts = [
      { spracheCode: 'de', name: formData.nameDe },
      ...(formData.translations || []).map(t => ({
        spracheCode: t.spracheCode,
        name: t.name
      }))
    ];

    const payload = {
      ...formData,
      allTexts, // Das schicken wir an die API
      selectedOrigins // Herkunft aus dem Transfer-Tool
    };

    console.log("Sende an API:", payload);
    // Hier dann: const res = await fetch('/api/animals', { method: 'POST', ... })
  };

  // --- 3. LOGIK FÜR DYNAMISCHE GEHEGE-ZEILEN ---
  const enclosureColumns = [
    { key: "animalCount", label: t("form.animalCount"), type: "number" },
    { key: "size", label: t("form.enclosureSize"), type: "number" },
  ];

  const addRow = () => {
    setFormData(prev => ({
      ...prev,
      enclosureSizes: [...prev.enclosureSizes, { id: Date.now(), animalCount: prev.enclosureSizes.length + 1, size: "" }]
    }));
  };

  const removeRow = (id) => {
    setFormData(prev => ({
      ...prev,
      enclosureSizes: prev.enclosureSizes.filter(row => row.id !== id)
    }));
  };

  const handleEnclosureChange = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      enclosureSizes: prev.enclosureSizes.map(row => row.id === id ? { ...row, [field]: value } : row)
    }));
  };

  // --- 4. LOGIK FÜR XP-AKTIONEN ---
  const handleActionChange = (actionType, field, value) => {
    setFormData(prev => ({
      ...prev,
      actions: {
        ...prev.actions,
        [actionType]: { ...prev.actions[actionType], [field]: value }
      }
    }));
  };

  // --- 5. State hält alle Felder aus deinen 3 Screenshots zusammen
  const [formData, setFormData] = useState(
    initialData || {
      nameDe: "",
      translations: [],
      releaseDate: "",
      description: "",
      price: 0,
      priceType: "Diamanten", // oder 'Zoodollar'
      sellValue: 0,
      popularity: 0,
      wildlifeXp: 0,
      enclosureType: "",
      toy: "",
      enclosureSizes: [{ animalCount: 1, size: 10 }],
      breeding: { level: 1, costs: 0, duration: "", chance: 0 },
      actions: {
        feed: { duration: "", xp: 0 },
        play: { duration: "", xp: 0 },
        clean: { duration: "", xp: 0 },
      },
    }
  );


  return (
    <form onSubmit={handleSubmit}>
      <PageHeader text={t("animal:createAnimal")} />

      <FormGrid>
        {/* --- LINKE SPALTE: Texte & Infos --- */}
        <Column>

          <BasicInfoSection
            formData={formData}
            onChange={handleChange}
          />

          <LanguageSection
            translations={formData.translations}
            setFormData={setFormData}
          />

          <CollapsibleSection title="✍️ Beschreibung (DE)" defaultOpen={true}>
            {/* Hier kommt die deutsche Hauptbeschreibung rein */}
          </CollapsibleSection>

        </Column>

        {/* --- RECHTE SPALTE: Werte & Mechaniken --- */}
        <Column>

          <PriceSection
            formData={formData}
            onChange={handleChange}
          />

          <BreedingSection
            formData={formData}
            onChange={handleChange}
          />

          <CollapsibleSection title="🌟 XP und Aktionen" defaultOpen={false}>
            {/* Füttern, Spielen, Pflegen */}
          </CollapsibleSection>

          <CollapsibleSection title="🏠 Gehegekapazität" defaultOpen={false}>
            {/* Anzahl Tiere pro Gehege-Level */}
          </CollapsibleSection>

        </Column>
      </FormGrid>

      {/* --- FOOTER: Herkunft & Submit --- */}
      <FooterSection>
        {/* Hier platzieren wir die Herkunft, da sie oft breit ist */}
        <SubmitButton type="submit">Tier im System speichern</SubmitButton>
      </FooterSection>
    </form>
  );
}

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  padding: 20px;

  @media (min-width: 1024px) {
    grid-template-columns: 1fr 1fr;
    align-items: start;
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FooterSection = styled.div`
  margin-top: 30px;
  padding: 20px;
  border-top: 1px solid #e0ecd0;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const SelectInput = styled.select`
  padding: 4px 8px;
  border: 1px solid #e0ecd0;
  border-radius: 6px;
  background: white;
  font-size: 0.9rem;
  cursor: pointer;
`;
