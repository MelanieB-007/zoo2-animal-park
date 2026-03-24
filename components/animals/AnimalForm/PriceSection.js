import styled from "styled-components";
import { useTranslation } from "next-i18next";
import InfoAccordion from "../../page-structure/Elements/InfoAccordion";
import InputGroup from "../../ui/InputGroup";
import FormInput from "../../ui/FormInput";
import FormSelect from "../../ui/FormSelect";

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
      <SectionWrapper>
        {/* Kaufpreis & Währung */}
        <FormGroup>
          <Label>{t("common:payment.price")}</Label>
          <Row>
            <FormInput
              type="number"
              name="price"
              value={formData.price ?? ""}
              onChange={onChange}
              $width="100%"
            />
            <FormSelect
              name="currency"
              value={formData.currency ?? "1"}
              onChange={onChange}
              options={currencyOptions}
              $minWidth="140px"
            />
          </Row>
        </FormGroup>

        {/* Beliebtheit */}
        <FormGroup>
          <Label>{t("common:popularity")}</Label>
          <InputGroup icon="/images/icons/besucher.jpg" iconSize="24px">
            <FormInput
              type="number"
              name="popularity"
              value={formData.popularity ?? ""}
              onChange={onChange}
            />
          </InputGroup>
        </FormGroup>

        {/* Verkaufspreis */}
        <FormGroup>
          <Label>{t("common:payment.sellPrice")}</Label>
          <InputGroup icon="/images/currency/zoodollar.webp" iconSize="24px">
            <FormInput
              type="number"
              name="sellValue"
              value={formData.sellValue ?? ""}
              onChange={onChange}
            />
          </InputGroup>
        </FormGroup>

        {/* Auswildern */}
        <FormGroup>
          <Label>{t("animals:table.release")}</Label>
          <InputGroup icon="/images/icons/star.png" iconSize="24px">
            <FormInput
              type="number"
              name="auswildern"
              value={formData.auswildern ?? ""}
              onChange={onChange}
            />
          </InputGroup>
        </FormGroup>
      </SectionWrapper>
    </InfoAccordion>
  );
}

// --- Styled Components für das Layout ---

const SectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px; /* Erhöht den Abstand zwischen den Blöcken (Popularität, Verkaufspreis etc.) */
  padding: 10px 0;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px; /* Abstand zwischen Label und Inputfeld */
`;

const Label = styled.label`
  font-size: 0.85rem;
  font-weight: 600;
  color: #5d7a2a;
  margin-left: 2px;
`;

const Row = styled.div`
  display: flex;
  gap: 10px;
  align-items: center; /* Hält Input und Select auf einer Höhe */

  & > *:first-child {
    flex: 2; /* Gibt dem Preis mehr Gewicht */
    min-width: 100px;
  }

  /* Das Währungs-Select */
  & > *:last-child {
    flex: 1; /* Das Select nimmt sich den Rest, aber weniger als der Preis */
    max-width: 180px; /* Verhindert, dass das Select zu breit wird */
    min-width: 130px;
  }
`;