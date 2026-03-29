import React, { useState } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import { useTranslation } from "next-i18next";

import OriginTransfer from "../../ui/OriginTransfer";
import SubmitButton from "../../forms/SubmitButton";

export default function ContestForm({
  statues = [],
  initialData = null,
  onSubmit,
}) {

  const { t } = /** @type {any} */ (useTranslation(["animals", "contests", "common"]));
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hilfsfunktion zum Formatieren von Prisma-Dates (ISO) zu HTML-Input-Dates (YYYY-MM-DD)
  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().split("T")[0];
  };

  // 1. Initialisierung des Form-States
  const [formData, setFormData] = useState(() => {
    if (initialData) {
      return {
        start: formatDate(initialData.start),
        ende: formatDate(initialData.ende),
        aktiv: initialData.aktiv ?? 1,
      };
    }

    // Fallback: Logik für neuen Wettbewerb (nächster Mittwoch)
    const getNextWednesday = (date) => {
      const result = new Date(date);
      const day = result.getDay();
      const diff = (3 - day + 7) % 7;
      result.setDate(result.getDate() + diff);
      return result;
    };
    const start = getNextWednesday(new Date());
    const end = new Date(start);
    end.setDate(start.getDate() + 7);

    return {
      start: formatDate(start),
      ende: formatDate(end),
      aktiv: 1,
    };
  });

  // 2. Initialisierung der gewählten Statuen
  const [selectedStatues, setSelectedStatues] = useState(() => {
    if (initialData?.statuen) {
      // WICHTIG: Mappen der verschachtelten Prisma-Struktur (link.statue.tier...)
      return initialData.statuen.map((link) => ({
        id: link.statue.id,
        name: link.statue.tier?.texte?.[0]?.name || `Statue #${link.statue.id}`,
      }));
    }
    return [];
  });

  // Verfügbare Statuen filtern (die, die noch nicht rechts sind)
  const availableStatues = (statues || [])
    .filter((s) => !selectedStatues.find((sel) => sel.id === s.id))
    .map((s) => ({
      id: s.id,
      name: s.tier?.texte?.[0]?.name || `Statue #${s.id}`,
    }));

  const handleMoveRight = (statue) => {
    if (selectedStatues.length >= 3) {
      toast.warn(t("contests:contestForm.maxStatues"));
      return;
    }
    setSelectedStatues([...selectedStatues, statue]);
  };

  const handleMoveLeft = (statue) => {
    setSelectedStatues(selectedStatues.filter((s) =>
      s.id !== statue.id));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (selectedStatues.length !== 3) {
      toast.error(t("contests:contestForm.chooseStatues"));
      return;
    }

    const startDate = new Date(formData.start);
    const endDate = new Date(formData.ende);
    if (endDate < startDate) {
      toast.error(t("contests:contestForm.endDateBeforeStart"));
      return;
    }

    const submissionData = {
      ...formData,
      statuenIds: selectedStatues.map((s) => s.id),
    };

    setIsSubmitting(true);
    try {
      await onSubmit(submissionData);
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <Row>
        <InputGroup>
          <label>{t("contests:contestForm.startDate")}</label>
          <input
            type="date"
            value={formData.start}
            onChange={(e) => {
              const newStart = e.target.value;
              const startDate = new Date(newStart);
              const newEnd = new Date(startDate);
              newEnd.setDate(startDate.getDate() + 7);

              setFormData({
                ...formData,
                start: newStart,
                ende: formatDate(newEnd),
              });
            }}
            required
          />
        </InputGroup>

        <InputGroup>
          <label>{t("contests:contestForm.endDate")}</label>
          <input
            type="date"
            value={formData.ende}
            min={formData.start}
            onChange={(e) => setFormData({ ...formData, ende: e.target.value })}
            required
          />
        </InputGroup>

        <CheckboxGroup>
          <input
            type="checkbox"
            id="aktiv"
            checked={formData.aktiv === 1}
            onChange={(e) =>
              setFormData({ ...formData, aktiv: e.target.checked ? 1 : 0 })
            }
          />
          <label htmlFor="aktiv">{t("contests:contestForm.activeContest")}</label>
        </CheckboxGroup>
      </Row>

      <SectionHeadline>
        {t("contests:contestForm.statuesChoise")} ({selectedStatues.length} / 3)
      </SectionHeadline>

      <OriginTransfer
        available={availableStatues}
        selected={selectedStatues}
        onMoveRight={handleMoveRight}
        onMoveLeft={handleMoveLeft}
        maxSelected={3}
      />

      <SubmitButton
        label={
          isSubmitting
            ? t("common:saving")
            : t("contests:contestForm.saveContest")
        }
        isSubmitting={isSubmitting}
      />
    </form>
  );
}

const SectionHeadline = styled.h3`
  color: #5d7a2a;
  border-bottom: 2px solid #eee;
  padding-bottom: 8px;
  padding-top: 20px;
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
  label {
    font-size: 0.9rem;
    font-weight: bold;
    color: #555;
  }
  input {
    padding: 10px;
    border-radius: 6px;
    border: 1px solid #ccc;
    font-size: 1rem;
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 10px;
  label {
    font-weight: bold;
    color: #555;
    cursor: pointer;
  }
  input {
    cursor: pointer;
    width: 18px;
    height: 18px;
  }
`;