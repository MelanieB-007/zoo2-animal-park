import { useTranslation } from "next-i18next";

import InfoAccordion from "../page-structure/Elements/InfoAccordion";
import DataRow from "../ui/DataRow";
import InputGroup from "../ui/InputGroup";
import FormInput from "../ui/FormInput";
import FormSelect from "../ui/FormSelect";


export default function PriceSection({ formData, onChange }) {
  const { t } = /** @type {any} */ (useTranslation(["animals", "common"]));


  const currencyOptions = [
    { value: "1", label: "Zoodollar" },
    { value: "2", label: "Diamanten" },
  ];

  return (
    <InfoAccordion
      title={t("animals:priceSection.pricesAndValues")}
      icon="/images/currency/zoodollar.webp"
      defaultOpen={true}
    >
      {/* Kaufpreis & Währung kombiniert */}
      <DataRow label={t("common:payment.price")}>
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
      <DataRow label={t("common:popularity") || "Beliebtheit"}>
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
      <DataRow label={t("common:payment.sellPrice")}>
        <InputGroup icon="/images/currency/zoodollar.webp">
          <FormInput
            type="number"
            $width="100px"
            name="sellValue"
            value={formData.sellValue}
            onChange={onChange}
          />
        </InputGroup>
      </DataRow>

      {/* Auswildern  */}
      <DataRow label={t("animals:table.release")}>
        <InputGroup icon="/images/icons/star.png">
          <FormInput
            type="number"
            $width="100px"
            name="auswildern"
            value={formData.auswildern}
            onChange={onChange}
          />
        </InputGroup>
      </DataRow>
    </InfoAccordion>
  );
}