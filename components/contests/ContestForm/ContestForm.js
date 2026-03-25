import React, { useState } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import OriginTransfer from "../../ui/OriginTransfer";

export default function ContestForm({ statues }) {
  const router = useRouter();
  const { t } = /** @type {any} */ (useTranslation(["contests", "common"]));
  const [isSubmitting, setIsSubmitting] = useState(false);


  const getNextWednesday = (date) => {
    const result = new Date(date);
    // getDay() liefert 3 für Mittwoch. Wir rechnen die Differenz aus.
    const day = result.getDay();
    const diff = (3 - day + 7) % 7;
    result.setDate(result.getDate() + diff);
    return result;
  };

  const today = new Date();
  const startWednesday = getNextWednesday(today);

  const endWednesday = new Date(startWednesday);
  endWednesday.setDate(startWednesday.getDate() + 7);

  const formatDate = (date) => date.toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    start: formatDate(startWednesday), // Standard: 2026-03-25 (heute)
    ende: formatDate(endWednesday),    // Standard: 2026-04-01
    aktiv: 1,
  });

  // State für die 3 ausgewählten Statuen
  const [selectedStatues, setSelectedStatues] = useState([]);

  // Logik: Welche Statuen sind noch übrig? (Einfach gefiltert)
  const availableStatues = statues
    .filter((s) => !selectedStatues.find((sel) => sel.id === s.id))
    .map((s) => ({
      id: s.id,
      name: s.tier?.texte?.[0]?.name || `Statue #${s.id}`,
    }));

  const handleMoveRight = (statue) => {
    if (selectedStatues.length >= 3) {
      toast.warn("Maximal 3 Statuen erlaubt!");
      return;
    }
    setSelectedStatues([...selectedStatues, statue]);
  };

  const handleMoveLeft = (statue) => {
    setSelectedStatues(selectedStatues.filter((s) => s.id !== statue.id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedStatues.length !== 3) {
      toast.error("Bitte wähle genau 3 Statuen aus!");
      return;
    }

    if (formData.start && formData.ende) {
      const startDate = new Date(formData.start);
      const endDate = new Date(formData.ende);

      if (endDate < startDate) {
        toast.error("Das Enddatum darf nicht vor dem Startdatum liegen!");
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contests/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          statuenIds: selectedStatues.map((s) => s.id),
        }),
      });

      if (response.ok) {
        toast.success("Wettbewerb erfolgreich angelegt!");
        router.push("/contests");
      } else {
        toast.error("Fehler beim Speichern.");
      }
    } catch (error) {
      toast.error("Netzwerkfehler.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <StyledForm onSubmit={handleSubmit}>
      <SectionHeadline>Zeitraum & Status</SectionHeadline>
      <Row>
        <InputGroup>
          <label>Startdatum</label>
          <input
            type="date"
            value={formData.start}
            onChange={(e) => {
              const newStart = e.target.value;
              const startDate = new Date(newStart);

              // Automatisch 7 Tage auf das neue Startdatum draufrechnen
              const newEnd = new Date(startDate);
              newEnd.setDate(startDate.getDate() + 7);

              setFormData({
                ...formData,
                start: newStart,
                ende: formatDate(newEnd)
              });
            }}
            required
          />
        </InputGroup>
        <InputGroup>
          <label>Enddatum</label>
          <input
            type="date"
            value={formData.ende}
            // WICHTIG: min={formData.start} verhindert das Auswählen früherer Daten
            min={formData.start}
            disabled={!formData.start} // Optional: Deaktiviert bis Start gewählt ist
            onChange={(e) => setFormData({...formData, ende: e.target.value})}
            required
          />
        </InputGroup>
        <CheckboxGroup>
          <input
            type="checkbox"
            id="aktiv"
            checked={formData.aktiv === 1}
            onChange={(e) => setFormData({...formData, aktiv: e.target.checked ? 1 : 0})}
          />
          <label htmlFor="aktiv">Wettbewerb aktiv</label>
        </CheckboxGroup>
      </Row>

      <SectionHeadline>Statuen-Auswahl ({selectedStatues.length} / 3)</SectionHeadline>

      <OriginTransfer
        available={availableStatues}
        selected={selectedStatues}
        onMoveRight={handleMoveRight}
        onMoveLeft={handleMoveLeft}
        maxSelected={3}
      />

      <SubmitButton type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Wird gespeichert..." : "Wettbewerb anlegen"}
      </SubmitButton>
    </StyledForm>
  );
}

// --- Styles bleiben wie gehabt ---
const StyledForm = styled.form`
  background: white;
  border: 2px solid var(--color-green);
  border-radius: var(--border-radius);
  padding: 30px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const SectionHeadline = styled.h3`
  color: var(--color-green);
  border-bottom: 2px solid #eee;
  padding-bottom: 8px;
  margin: 0;
`;

const Row = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  align-items: flex-end;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  input { padding: 10px; border-radius: 6px; border: 1px solid #ccc; }
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 10px;
`;

const SubmitButton = styled.button`
  background: var(--color-green);
  color: white;
  padding: 15px;
  border: none;
  border-radius: var(--border-radius);
  font-weight: bold;
  cursor: pointer;
  margin-top: 20px;
  &:disabled { opacity: 0.5; }
`;