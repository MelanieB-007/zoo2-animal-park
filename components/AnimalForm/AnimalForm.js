import { useState } from "react";
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


export default function AnimalForm({ initialData }) {
  const { t } = /** @type {any} */ (useTranslation(["animals", "common"]));

// ---  HANDLER FÜR EINFACHE FELDER ---
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

  const [uploadFiles, setUploadFiles] = useState({
    icon: null,
    image: null,
  });

  // --- hält alle Felder aus deinen 3 Screenshots zusammen
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
      breedingLevel: 1,
      breedingCosts: 0,
      breedingDuration: "",
      breedingChance: 0,
      actions: {
        feed: { duration: "", xp: 0 },
        play: { duration: "", xp: 0 },
        clean: { duration: "", xp: 0 },
      },
    }
  );


  return (
    <form onSubmit={handleSubmit}>

      <FormGrid>
        {/* --- LINKE SPALTE: Texte & Infos --- */}
        <Column>
          <ImageSection
            setUploadFiles={setUploadFiles}
            initialIcon={formData.iconPath}
            initialImage={formData.imagePath}
          />

          <BasicInfoSection
            formData={formData}
            onChange={handleChange}
          />

          <DescriptionSection
            value={formData.descriptionDe}
            onChange={handleChange}
          />

          <TranslationNameSection
            translations={formData.translations}
            setFormData={setFormData}
          />

          <TranslationDescriptionSection
            translations={formData.translations}
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

          <EnclosureTypeSection
            formData={formData}
            onChange={handleChange}
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
        <SubmitButton type="submit">{t("animals:form.saveAnimal")}</SubmitButton>
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