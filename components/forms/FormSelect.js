import styled from "styled-components";


export default function FormSelect({ options = [], value, onChange, placeholder, required }) {
  return (
    <StyledSelect value={value} onChange={onChange} required={required}>
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </StyledSelect>
  );
}

const StyledSelect = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 14px;
  background-color: white;
  color: #333;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    border-color: #88a04d;
    box-shadow: 0 0 0 2px rgba(136, 160, 77, 0.2);
  }

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
`;
