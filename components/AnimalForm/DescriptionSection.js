import { useTranslation } from "next-i18next";

import InfoAccordion from "../page-structure/Elements/InfoAccordion";
import FormTextarea from "../ui/FormTextarea";


export default function DescriptionSection({ value, onChange }) {
  const { t } = /** @type {any} */ (useTranslation(["animals", "common"]));

  return (
    <InfoAccordion
      title={t("animals:description") || "Beschreibung (DE)"}
      icon="/images/icons/text.png"
      defaultOpen={true}
    >
      <FormTextarea
        id="descriptionDe"
        name="descriptionDe"
        label={t("common:description_label") || "Hauptbeschreibung"}
        placeholder={t("common:description_placeholder") || "Beschreibe das Tier..."}
        value={value}
        onChange={onChange}
        $minHeight="160px"
      />
    </InfoAccordion>
  );
}