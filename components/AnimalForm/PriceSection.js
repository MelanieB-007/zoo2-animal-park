import { useTranslation } from "next-i18next";

import InfoAccordion from "../page-structure/Elements/InfoAccordion";
import DataRow from "../ui/DataRow";
import InputGroup from "../ui/InputGroup";
import FormInput from "../ui/FormInput";
import FormSelect from "../ui/FormSelect";


export default function PriceSection({ formData, onChange }) {
  const { t } = /** @type {any} */ (useTranslation(["animals", "common"]));


  const currencyOptions = [
    { value: "Zoodollar", label: "🪙 Zoodollar" },
    { value: "Diamonds", label: "💎 Diamanten" },
  ];

  return (
    <InfoAccordion
      title={t("animals:prices_and_values") || "Preise & Werte"}
      icon="/images/icons/money.png" // Falls du ein passendes Icon hast
      defaultOpen={true}
    >
      {/* Kaufpreis & Währung kombiniert */}
      <DataRow label={t("common:buyPrice") || "Kaufpreis"}>
        <InputGroup>
          <FormInput
            type="number"
            $width="100px"
            name="price"
            value={formData.price}
            onChange={onChange}
          />
          <FormSelect
            name="currency"
            value={formData.currency}
            onChange={onChange}
            options={currencyOptions}
            $width="130px"
          />
        </InputGroup>
      </DataRow>

      {/* Beliebtheit */}
      <DataRow label={t("animals:popularity") || "Beliebtheit"}>
        <InputGroup icon="/images/icons/besucher.jpg">
          <FormInput
            type="number"
            $width="80px"
            name="popularity"
            value={formData.popularity}
            onChange={onChange}
          />
        </InputGroup>
      </DataRow>

      {/* Verkaufspreis  */}
      <DataRow label={t("common:sellPrice") || "Verkaufspreis"}>
        <InputGroup icon="/images/currency/zoodollar.webp">
          <FormInput
            type="number"
            $width="100px"
            name="sellPrice"
            value={formData.sellPrice}
            onChange={onChange}
          />
        </InputGroup>
      </DataRow>

      {/* Auswildern  */}
      <DataRow label={t("common:release") || "Auswildern"}>
        <InputGroup icon="/images/icons/star.png">
          <FormInput
            type="number"
            $width="100px"
            name="release"
            value={formData.release}
            onChange={onChange}
          />
        </InputGroup>
      </DataRow>
    </InfoAccordion>
  );
}