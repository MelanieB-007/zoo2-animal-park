import styled from "styled-components";

export const FormInput = styled.input`
  width: ${props => props.$width || "100%"};
  padding: 8px 12px;
  border: 1px solid #d1e2a5;
  border-radius: 8px;
  font-size: 0.95rem;
  font-family: inherit;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #88a04d;
    box-shadow: 0 0 0 2px rgba(136, 160, 77, 0.1);
  }

  /* Spezielles Styling für Zahlen-Inputs */
  &[type="number"] {
    text-align: right;
    -moz-appearance: textfield;
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }
`;