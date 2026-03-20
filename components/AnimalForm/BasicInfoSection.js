import { useTranslation } from "next-i18next";

import FormInput  from "../ui/FormInput";
import InfoAccordion from "../page-structure/Elements/InfoAccordion";

export default function BasicInfoSection({ formData, onChange }) {
  const { t } = /** @type {any} */ (useTranslation(["animals", "common"]));

  return (
    <InfoAccordion title={t("animals:basic_info")} icon="/images/icons/info.png" defaultOpen={true}>
      <FormInput
        label={t("animals:fields.name_de")}
        id="nameDe"
        name="nameDe"
        placeholder="Erdmännchen"
        value={formData.nameDe}
        onChange={onChange}
        required
      />

      <FormInput
        label={t("animals:fields.release_date")}
        id="releaseDate"
        type="date"
        name="releaseDate"
        value={formData.releaseDate}
        onChange={onChange}
        $width="200px"
      />
    </InfoAccordion>
  );
}