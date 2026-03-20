import styled from "styled-components";
import { useTranslation } from "next-i18next";

import InfoAccordion from "../page-structure/Elements/InfoAccordion";
import InputGroup from "../ui/InputGroup";
import FormInput from "../ui/FormInput";

export default function XpActionSection({ formData, onChange }) {
  const { t } = /** @type {any} */ (useTranslation(["animals", "common"]));

  const handleActionChange = (actionKey, field, value) => {
    setFormData(prev => ({
      ...prev,
      actions: {
        ...prev.actions,
        [actionKey]: {
          ...prev.actions[actionKey],
          [field]: value
        }
      }
    }));
  };

  // Definition der festen Aktionen
  const actions = [
    { key: "feed", label: t("animals:actions.feed") || "Füttern", icon: "/images/icons/feed.png" },
    { key: "play", label: t("animals:actions.play") || "Spielen", icon: "/images/icons/play.png" },
    { key: "clean", label: t("animals:actions.clean") || "Putzen", icon: "/images/icons/clean.png" },
  ];

  return (
    <InfoAccordion
      title={t("animals:actions_xp") || "Aktionen & EP"}
      icon="/images/icons/xp_star.png"
      defaultOpen={false}
    >
      <ActionGrid>
        {actions.map((action) => (
          <ActionRow key={action.key}>
            <ActionLabel>
              {action.icon && <img src={action.icon} alt="" width="20" height="20" />}
              <span>{action.label}</span>
            </ActionLabel>

            <InputsContainer>
              {/* EP Feld */}
              <Wrapper>
                <label htmlFor={`${action.key}_xp`}>EP</label>
                <InputGroup icon="/images/icons/star.png">
                  <FormInput
                    id={`${action.key}_xp`}
                    type="number"
                    name={`${action.key}_xp`} // z.B. feed_xp
                    value={formData[`${action.key}_xp`] || ""}
                    placeholder="0"
                    onChange={(e) => handleActionChange(action.key, "xp", e.target.value)}
                    $width="80px"
                  />
                </InputGroup>
              </Wrapper>

              {/* Zeit Feld */}
              <Wrapper>
                <label htmlFor={`${action.key}_time`}>{t("common:time")}</label>
                <InputGroup unit="h">
                  <FormInput
                    id={`${action.key}_time`}
                    type="number"
                    name={`${action.key}_time`} // z.B. feed_time
                    value={formData[`${action.key}_time`] || ""}
                    onChange={(e) => handleActionChange(action.key, "duration", e.target.value)}
                    $width="120px"
                    placeholder="0"
                  />
                </InputGroup>
              </Wrapper>
            </InputsContainer>
          </ActionRow>
        ))}
      </ActionGrid>
    </InfoAccordion>
  );
}


const ActionGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 10px 0;
`;

const ActionRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f4e8;

  &:last-child {
    border-bottom: none;
  }
`;

const ActionLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: bold;
  color: #5d7a2a;
  font-size: 0.95rem;

  img {
    object-fit: contain;
  }
`;

const InputsContainer = styled.div`
  display: flex;
  gap: 20px;
  padding-left: 30px; /* Einrückung unter das Icon/Label */
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  label {
    font-size: 0.8rem;
    font-weight: 600;
    color: #88a04d;
  }
`;