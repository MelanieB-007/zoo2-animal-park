import React from "react";
import useSWR from "swr";
import styled from "styled-components";
import InfoAccordion from "../page-structure/Elements/InfoAccordion";
import FormSelect from "./FormSelect";
import FormInput from "./FormInput";
import InputGroup from "./InputGroup";
import GehegeBadge from "../../ui/GehegeBadge"; // Dein neues Badge
import { useTranslation } from "next-i18next";

export default function EnclosureTypeSection({ formData, onChange }) {
  const { t } = /** @type {any} */ (useTranslation(["animals", "common"]));
  const { data: biomes } = useSWR('/api/biomes');

  // Findet das aktuell ausgewählte Biome-Objekt für das Badge
  const selectedBiome = Array.isArray(biomes)
    ? biomes.find(b => b.id === parseInt(formData.enclosureType) || b.code === formData.enclosureType)
    : null;

  const enclosureOptions = Array.isArray(biomes)
    ? biomes.map(biome => ({
      value: biome.code || biome.id,
      label: biome.name
    }))
    : [];

  return (
    <InfoAccordion
      title={t("animals:enclosure_toy_title") || "Lebensraum & Unterhaltung"}
      icon="/images/icons/habitat.png"
      defaultOpen={false}
    >
      <ContentLayout>
        {/* Links: Die Auswahl */}
        <InputsColumn>
          <Wrapper>
            <label htmlFor="enclosureType">
              {t("animals:enclosure_type") || "Gehegetyp"}
            </label>
            <SelectRow>
              <FormSelect
                id="enclosureType"
                name="enclosureType"
                value={formData.enclosureType}
                onChange={onChange}
                options={enclosureOptions}
                placeholder={t("common:please_select")}
                $width="100%"
              />
              {/* Das Badge zeigt sich live, wenn etwas gewählt wurde */}
              {selectedBiome && (
                <BadgeContainer>
                  <GehegeBadge gehege={selectedBiome} showTooltip={false} size={24} />
                </BadgeContainer>
              )}
            </SelectRow>
          </Wrapper>

          <Wrapper>
            <label htmlFor="toy">{t("animals:toy") || "Spielzeug"}</label>
            <InputGroup icon="🎾">
              <FormInput
                id="toy"
                name="toy"
                type="text"
                value={formData.toy}
                onChange={onChange}
                placeholder={t("animals:toy_placeholder")}
                $width="100%"
              />
            </InputGroup>
          </Wrapper>
        </InputsColumn>
      </ContentLayout>
    </InfoAccordion>
  );
}

// --- STYLED COMPONENTS ---

const ContentLayout = styled.div`
  padding: 10px 0;
`;

const InputsColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const SelectRow = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const BadgeContainer = styled.div`
  flex-shrink: 0;
  /* Kleiner Animationseffekt beim Erscheinen */
  animation: fadeIn 0.3s ease-out;
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(5px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    font-size: 0.85rem;
    font-weight: 600;
    color: #5d7a2a;
  }
`;