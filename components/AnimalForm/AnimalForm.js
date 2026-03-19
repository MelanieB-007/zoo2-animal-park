import { useState } from "react";
import styled from "styled-components";
import { useTranslation } from "next-i18next";
import useSWR from "swr";

import DynamicRowInput from "./DynamicRowInput";
import ActionRow from "./ActionRow";
import OriginTransfer from "../AnimalDetails/OriginTransfer";


export default function AnimalForm({ initialData }) {
  const { t } = /** @type {any} */ (useTranslation(["animals", "common"]));


  // --- 1. SWR DATEN & HERKUNFT LOGIK ---
  const { data: origins } = useSWR('/api/origins');
  const { data: biome } = useSWR('/api/biomes');

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
    console.log("Speichere:", { ...formData, selectedOrigins });
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
      nameEn: "",
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
    <FormContainer onSubmit={handleSubmit}>
      {/* SEKTION 1: GRUNDINFORMATIONEN */}
      <Section>
        <h3>📋 Grundinformationen</h3>
        <Row>
          <Field>
            <label>Deutscher Name *</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="z.B. Achal-Tekkiner"
            />
          </Field>
          <Field>
            <label>Release-Datum</label>
            <input
              type="date"
              name="release"
              value={formData.release}
              onChange={handleChange}
            />
          </Field>
        </Row>
        <Field>
          <label>Englischer Name</label>
          <input
            name="nameEn"
            value={formData.nameEn}
            onChange={handleChange}
          />
        </Field>
      </Section>

      {/* SEKTION 2: Herkunft */}
      <Section>
        <h3>🌍 Herkunft</h3>
        <OriginTransfer
          available={availableOrigins}
          selected={selectedOrigins}
          onMoveRight={moveRight}
          onMoveLeft={moveLeft}
        />
      </Section>

      {/* SEKTION 3: Beschreibung */}
      <section>
        <h3>Beschreibung</h3>
      </section>

      {/* SEKTION 4: Tierbild */}
      <section>
        <h3>Tierbikd</h3>
      </section>

      {/* SEKTION 5: PREISE & WERTE */}
      <Section>
        <h3>💰 Preise & Werte</h3>
        <Row>
          <Field>
            <label>Kaufpreis</label>
            <input type="number" name="price" onChange={handleChange} />
          </Field>
          <Field>
            <label>Währung</label>
            <select name="priceType" onChange={handleChange}>
              <option value="Diamanten">Diamanten</option>
              <option value="Zoodollar">Zoodollar</option>
            </select>
          </Field>
        </Row>
      </Section>

      {/* SEKTION 6: Gehege */}
      <section>
        <h3>Gehege</h3>

        <DynamicRowInput
          label={t("form.sections.enclosure")}
          rows={formData.enclosureSizes}
          columns={enclosureColumns}
          onAdd={addRow}
          onRemove={removeRow}
          onChange={handleEnclosureChange}
        />
      </section>

      {/* SEKTION 7: Zucht */}
      <section>
        <h3>Zucht</h3>
      </section>

      {/* SEKTION 8: XP und Aktionen */}
      <Section>
        <h3>⭐ {t("form.sections.xpActions")}</h3>

        <TableHeader>
          <span className="label">{t("form.column.action")}</span>
          <span className="duration">{t("form.column.duration")}</span>
          <span className="xp">{t("form.column.xp")}</span>
        </TableHeader>

        <ActionRow
          icon="🍎"
          label={t("actions.feed")}
          values={formData.actions.feed}
          onChange={(field, val) => handleActionChange("feed", field, val)}
        />
        <ActionRow
          icon="🎮"
          label={t("actions.play")}
          values={formData.actions.play}
          onChange={(field, val) => handleActionChange("play", field, val)}
        />
        <ActionRow
          icon="🧹"
          label={t("actions.clean")}
          values={formData.actions.clean}
          onChange={(field, val) => handleActionChange("clean", field, val)}
        />
      </Section>

      <SubmitButton type="submit">
        {initialData ? "Änderungen speichern" : "Tier anlegen"}
      </SubmitButton>
    </FormContainer>
  );
}

// Styled Components für das Layout (vereinfacht)
const TableHeader = styled.div`
  display: flex;
  padding: 5px 0;
  margin-bottom: 5px;
  font-size: 11px;
  font-weight: bold;
  color: #88a04d;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  gap: 15px; /* Damit der Abstand zu den Inputs in der ActionRow passt */

  .label {
    flex: 1;
  }

  .duration {
    flex: 2;
    padding-left: 5px;
  }

  .xp {
    flex: 2;
    padding-left: 5px;
  }
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background: #f4f9e9; /* Dein hellgrüner Ton */
  border-radius: 15px;
`;

const Section = styled.div`
  background: white;
  padding: 15px;
  border-radius: 10px;
  border: 1px solid #d1e2a5;
`;

const Row = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 10px;
`;

const Field = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;

  label {
    font-weight: bold;
    font-size: 12px;
    margin-bottom: 5px;
    color: #88a04d;
  }

  input,
  select {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
`;

const SubmitButton = styled.button`
  background: #76b041;
  color: white;
  padding: 15px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background: #649635;
  }
`;