import styled from "styled-components";
import { useTranslation } from "next-i18next";

import InfoAccordion from "../page-structure/Elements/InfoAccordion";
import InputGroup from "../ui/InputGroup";
import FormInput from "../ui/FormInput";

export default function XpActionSection({ formData, setFormData }) {
  const { t } = /** @type {any} */ (useTranslation(["animals", "common"]));

  const handleActionChange = (actionKey, field, value) => {
    setFormData(prev => ({
      ...prev,
      actions: {
        ...prev.actions,
        [actionKey]: {
          ...prev.actions[actionKey],
          // Wir speichern die Werte als Zahlen (oder leeren String für das Input-Handling)
          [field]: value === "" ? "" : parseInt(value)
        }
      }
    }));
  };

  const actions = [
    { key: "feed", label: t("animals:actions.feed"), icon: "/images/icons/feed.png" },
    { key: "play", label: t("animals:actions.play") , icon: "/images/icons/play.png" },
    { key: "clean", label: t("animals:actions.clean"), icon: "/images/icons/clean.png" },
  ];

  return (
    <InfoAccordion
      title={t("animals:xpSection.actionsXp") || "Aktionen & EP"}
      icon="/images/icons/star.png"
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
              {/* XP Feld */}
              <Wrapper>
                <label>XP</label>
                <InputGroup icon="/images/icons/star.png">
                  <FormInput
                    type="number"
                    value={formData.actions?.[action.key]?.xp ?? ""}
                    placeholder="0"
                    onChange={(e) => handleActionChange(action.key, "xp", e.target.value)}
                    $width="70px"
                  />
                </InputGroup>
              </Wrapper>

              {/* Stunden Feld */}
              <Wrapper>
                <label>{t("common:hours") || "Std."}</label>
                <InputGroup unit="h">
                  <FormInput
                    type="number"
                    value={formData.actions?.[action.key]?.durationHours ?? ""}
                    onChange={(e) => handleActionChange(action.key, "durationHours", e.target.value)}
                    $width="70px"
                    placeholder="0"
                  />
                </InputGroup>
              </Wrapper>

              {/* Minuten Feld */}
              <Wrapper>
                <label>{t("common:minutes") || "Min."}</label>
                <InputGroup unit="m">
                  <FormInput
                    type="number"
                    value={formData.actions?.[action.key]?.durationMinutes ?? ""}
                    onChange={(e) => handleActionChange(action.key, "durationMinutes", e.target.value)}
                    $width="70px"
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

// Styled Components (nur InputsContainer leicht angepasst für 3 Spalten)
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
  &:last-child { border-bottom: none; }
`;

const ActionLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: bold;
  color: #5d7a2a;
  font-size: 0.95rem;
`;

const InputsContainer = styled.div`
  display: flex;
  flex-wrap: wrap; // Falls es auf kleinen Bildschirmen zu eng wird
  gap: 15px;
  padding-left: 30px;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  label {
    font-size: 0.75rem;
    font-weight: 600;
    color: #88a04d;
  }
`;