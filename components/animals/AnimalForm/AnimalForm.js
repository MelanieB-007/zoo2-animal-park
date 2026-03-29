import { useEffect, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "next-i18next";

import TranslationNameSection from "./TranslationNameSection";
import BreedingSection from "./BreedingSection";
import PriceSection from "./PriceSection";
import BasicInfoSection from "./BasicInfoSection";
import DescriptionSection from "./DescriptionSection";
import TranslationDescriptionSection from "./TranslationDescriptionSection";
import XpActionSection from "./XpActionSection";
import EnclosureCapacitySection from "./EnclosureCapacitySection";
import EnclosureTypeSection from "./EnclosureTypeSection";
import OriginSection from "./OriginSection";
import { toast } from "react-toastify";
import SubmitButton from "../../forms/SubmitButton";

export default function AnimalForm({ initialData, isEdit = false, onSuccess }) {
  const { t } = /** @type {any} */ (useTranslation(["animals", "common"]));
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Der initiale leere State
  const emptyForm = {
    nameDe: "",
    descriptionDe: "",
    translations: [],
    releaseDate: "",
    price: "",
    priceType: "Diamanten",
    sellValue: "",
    popularity: "",
    auswildern: "",
    enclosureType: "",
    breedingLevel: 0,
    breedingCosts: "",
    breedingDuration: "",
    breedingChance: "",
    actions: {
      feed: { durationHours: "", durationMinutes: "", xp: "" },
      play: { durationHours: "", durationMinutes: "", xp: "" },
      clean: { durationHours: "", durationMinutes: "", xp: "" },
    },
    origins: [],
    enclosureSizes: [{ animalCount: 1, size: 10 }],
  };

  const [formData, setFormData] = useState(initialData || emptyForm);

  // WICHTIG: Aktualisiere den State, wenn initialData geladen wurde
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

// ---  HANDLER FÜR EINFACHE FELDER ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!formData.enclosureType || formData.enclosureType === "") {
      alert("Bitte wähle ein Gehege aus!");
      return;
    }

    setIsSubmitting(true);

    const url = isEdit ? `/api/animals/${formData.id}` : "/api/animals";
    const method = isEdit ? "PUT" : "POST";

    // 2. PAYLOAD VORBEREITEN
    const payload = {
      ...formData,
      enclosureType: parseInt(formData.enclosureType),
      origins: formData.origins || []
    };

    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {

        if (onSuccess) {
          onSuccess(result);
        }
      } else {
        toast.error(`Fehler: ${result.message || "Unbekannter Fehler"}`);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Netzwerkfehler: Keine Verbindung zur API.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>

      <FormGrid>
        {/* --- LINKE SPALTE: Texte & Infos --- */}
        <Column>
          {/*<ImageSection
            setUploadFiles={setUploadFiles}
            initialIcon={formData.iconPath}
            initialImage={formData.imagePath}
          />
*/}
          <BasicInfoSection
            formData={formData}
            onChange={handleChange}
          />

          <EnclosureTypeSection
            formData={formData}
            onChange={handleChange}
          />

          <DescriptionSection
            value={formData.descriptionDe}
            onChange={handleChange}
          />

          <TranslationNameSection
            translations={formData.translations || []}
            setFormData={setFormData}
          />

          <TranslationDescriptionSection
            translations={formData.translations || []}
            setFormData={setFormData}
          />

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

          <XpActionSection
            formData={formData}
            setFormData={setFormData} // Braucht setFormData für das Deep-Update
          />

          <EnclosureCapacitySection
            enclosureSizes={formData.enclosureSizes}
            setFormData={setFormData}
          />

        </Column>
      </FormGrid>

      {/* --- FOOTER: Herkunft & Submit --- */}
      <FooterSection>
        <OriginSection
          initialData={formData.origins}
          setFormData={setFormData}
        />
        <SubmitButton
          label={isSubmitting ?
            t("common:saving") :
            t("animals:form.saveAnimal")}
          isSubmitting={isSubmitting}
        />
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