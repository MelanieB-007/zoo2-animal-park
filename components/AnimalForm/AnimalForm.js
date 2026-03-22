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
import ImageSection from "./ImageSection";


export default function AnimalForm({ initialData, isEdit = false, onSuccess }) {
  const { t } = /** @type {any} */ (useTranslation(["animals", "common"]));
  const [isSubmitting, setIsSubmitting] = useState(false);

  console.log("init", initialData);

  // Der initiale leere State
  const emptyForm = {
    nameDe: "",
    descriptionDe: "",
    translations: [],
    releaseDate: "",
    price: "",
    priceType: "Diamant",
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

    // 1. DYNAMISCHE URL & METHODE
    // Wenn wir editieren, hängen wir die ID an die URL an
    const url = isEdit ? `/api/animals/${formData.id}` : "/api/animals";
    const method = isEdit ? "PUT" : "POST";

    // 2. PAYLOAD VORBEREITEN
    const payload = {
      ...formData,
      enclosureType: parseInt(formData.enclosureType),
      // Sicherstellen, dass die Origins als Array von IDs rausgehen
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
        alert(isEdit ? "Änderungen erfolgreich gespeichert!" : "Erfolg! Das Tier wurde neu angelegt.");

        // Hier den Callback aufrufen, um zur Detailseite zurückzukehren
        if (onSuccess) {
          onSuccess(result.id || formData.id);
        }
      } else {
        alert(`Fehler beim Speichern: ${result.message || "Unbekannter Fehler"}`);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      alert("Netzwerkfehler: Konnte keine Verbindung zur API herstellen.");
    } finally {
      setIsSubmitting(false);
    }
  };


  const [uploadFiles, setUploadFiles] = useState({
    icon: null,
    image: null,
  });

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
        <SubmitButton type="submit" disabled={isSubmitting}>
          {isSubmitting ?
            t("common:saving") :
            t("animals:form.saveAnimal")}
        </SubmitButton>
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

const SubmitButton = styled.button`
  /* Layout */
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  margin-top: 30px;
  padding: 16px 32px;

  /* Typografie */
  font-family: var(--font-text), sans-serif;
  font-size: 1.1rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: white;

  /* Styling */
  background: linear-gradient(180deg, #88a04d 0%, #5d7a2a 100%);
  border: none;
  border-radius: 12px;
  border-bottom: 4px solid #3e521c; 
  
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);

  &:hover {
    transform: translateY(-2px);
    background: linear-gradient(180deg, #96b05a 0%, #688931 100%);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(2px);
    border-bottom-width: 0;
    margin-bottom: 4px; 
  }

  &:disabled {
    background: #ccc;
    border-bottom-color: #999;
    cursor: not-allowed;
    transform: none;
  }

  /* Kleiner Glanz-Effekt oben */
  &::before {
    content: "";
    position: absolute;
    top: 2px;
    left: 10%;
    right: 10%;
    height: 1px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 50%;
  }
`;