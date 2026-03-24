import styled from "styled-components";
import { useTranslation } from "next-i18next";
import FormInput from "../../ui/FormInput";
import InfoAccordion from "../../page-structure/Elements/InfoAccordion";

export default function BasicInfoSection({ formData, onChange }) {
  const { t } = /** @type {any} */ (useTranslation(["animals", "common"]));

  return (
    <InfoAccordion
      title={t("animals:basicInfoSection.basicInfo")}
      icon="/images/icons/info.png"
      defaultOpen={true}
    >
      <SectionWrapper>
        {/* Name des Tieres */}
        <FormGroup>
          <FormInput
            label={t("animals:basicInfoSection.fields.name")}
            id="nameDe"
            name="nameDe"
            placeholder="Erdmännchen"
            value={formData.nameDe ?? ""}
            onChange={onChange}
            required
          />
        </FormGroup>

        {/* Release Datum */}
        <FormGroup>
          <FormInput
            label={t("animals:basicInfoSection.fields.releaseDate")}
            id="releaseDate"
            type="date"
            name="releaseDate"
            value={formData.releaseDate ?? ""}
            onChange={onChange}
            $width="200px"
          />
        </FormGroup>
      </SectionWrapper>
    </InfoAccordion>
  );
}

// Konsistente Abstände wie in der PriceSection
const SectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px; 
  padding: 10px 0;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;