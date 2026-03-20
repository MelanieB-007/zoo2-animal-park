import { FormInput } from "../ui/FormInput";
import { useTranslation } from "next-i18next";
import DataRow from "../ui/DataRow";
import InfoAccordion from "../page-structure/Elements/InfoAccordion";

export default function BasicInfoSection({ formData, onChange }) {
  const { t } = /** @type {any} */ (useTranslation(["animals", "common"]));

  return (
    <InfoAccordion
      title={t("animals:basic_info") || "Grundinformationen"}
      icon="/images/icons/info.png"
      defaultOpen={true}
    >
      {/* Name (Deutsch / Standard) */}
      <DataRow label={t("animals:fields.name_de") || "Name (DE) *"}>
        <FormInput
          name="nameDe"
          placeholder="z.B. Erdmännchen"
          value={formData.nameDe}
          onChange={onChange}
          $width="100%"
          required
        />
      </DataRow>

      {/* Release Datum */}
      <DataRow label={t("animals:fields.release_date") || "Release-Datum"}>
        <FormInput
          type="date"
          name="releaseDate"
          value={formData.releaseDate}
          onChange={onChange}
          $width="180px"
        />
      </DataRow>
    </InfoAccordion>
  );
}