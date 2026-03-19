import styled from "styled-components";
import { useTranslation } from "next-i18next";

export default function ActionRow ({ icon, label, values, onChange }) {
  const { t } = /** @type {any} */ (
    useTranslation(["animals", "common"])
  );

  return (
  <Row>
    <LabelCell>
      <span role="img" aria-label={label}>{icon}</span> {label}
    </LabelCell>
    <InputCell>
      <input
        type="text"
        placeholder="z. B. 10 h 13 min"
        value={values.duration}
        onChange={(e) => onChange('duration', e.target.value)}
      />
    </InputCell>
    <InputCell>
      <input
        type="number"
        placeholder="z. B. 243"
        value={values.xp}
        onChange={(e) => onChange('xp', e.target.value)}
      />
    </InputCell>
  </Row>
  );
}

const Row = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #e0eec0; /* Zarte grüne Linie wie im Screenshot */
  gap: 15px;

  &:last-child {
    border-bottom: none;
  }
`;

const LabelCell = styled.div`
  flex: 1; /* Nimmt den Platz links ein */
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 500;
  color: #333;

  span {
    font-size: 1.2rem;
  }
`;

const InputCell = styled.div`
  flex: 2; /* Die Eingabefelder sind breiter als das Label */
  
  input {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #d1e2a5;
    border-radius: 8px;
    background-color: #fdfdfd;
    font-size: 14px;
    transition: border-color 0.2s;

    &::placeholder {
      color: #b0bca0;
      font-style: italic;
    }

    &:focus {
      outline: none;
      border-color: #76b041;
      background-color: #fff;
    }
  }

  /* Entfernt die kleinen Pfeile bei type="number" für einen cleanen Look */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;