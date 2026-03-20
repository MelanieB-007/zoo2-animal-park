import InfoAccordion from "../page-structure/Elements/InfoAccordion";
import DataRow from "../ui/DataRow";
import InputGroup from "../ui/InputGroup";
import {FormInput} from "../ui/FormInput";
import FormSelect  from "../ui/FormSelect";
import PriceDisplay from "../icons/PriceDisplay";
import { useTranslation } from "next-i18next";

export default function BreedingSection({ formData, onChange }) {
  const { t } = /** @type {any} */ (useTranslation(["animals", "common"]));

  const stallOptions = [
    { value: 0, label: "Level 0" },
    { value: 1, label: "Level 1" },
    { value: 2, label: "Level 2" },
    { value: 3, label: "Level 3" },
  ];

  return (
    <InfoAccordion
      title={t("animals:breeding.breeding")}
      icon="/images/icons/breeding.png"
      defaultOpen={false}
    >
      {/* Stall-Level */}
      <DataRow label={t("animals:table.stall")}>
        <FormSelect
          name="stalllevel"
          value={formData.stalllevel}
          onChange={onChange}
          options={stallOptions}
          $width="120px"
        />
      </DataRow>

      {/* Zuchtkosten */}
      <DataRow label={t("common:costs")}>
        <InputGroup icon={<PriceDisplay type="zoodollar" size={18} />}>
          <FormInput
            type="number"
            $width="100px"
            name="zuchtkosten"
            value={formData.zuchtkosten}
            onChange={onChange}
          />
        </InputGroup>
      </DataRow>

      {/* Zuchtdauer */}
      <DataRow label={t("common:time")}>
        <InputGroup unit="h">
          <FormInput
            type="number"
            $width="70px"
            name="zuchtdauer"
            value={formData.zuchtdauer}
            onChange={onChange}
          />
        </InputGroup>
      </DataRow>

      {/* Zuchtchance */}
      <DataRow label={t("animals:breeding.breedingChance")}>
        <InputGroup unit="%">
          <FormInput
            type="number"
            $width="70px"
            name="startprozent"
            value={formData.startprozent}
            onChange={onChange}
          />
        </InputGroup>
      </DataRow>
    </InfoAccordion>
  );
}