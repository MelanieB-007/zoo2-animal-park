import styled from "styled-components";

export default function FormSelect({ label, id, options = [], $width, ...props }) {
  return (
    <Wrapper $width={$width}>
      {label && <Label htmlFor={id}>{label}</Label>}
      <StyledSelect id={id} {...props}>
        {/* Platzhalter oder Standard-Option */}
        {props.placeholder && <option value="">{props.placeholder}</option>}

        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </StyledSelect>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: ${props => props.$width || "100%"};
`;

const Label = styled.label`
  font-size: 0.85rem;
  font-weight: 600;
  color: #5d7a2a;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const StyledSelect = styled.select`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1e2a5;
  border-radius: 8px;
  font-size: 0.95rem;
  font-family: inherit;
  background-color: #fdfdfd;
  cursor: pointer;
  appearance: none; /* Entfernt Standard-Pfeil */
  background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2388a04d' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 35px;

  &:focus {
    outline: none;
    border-color: #88a04d;
    box-shadow: 0 0 0 2px rgba(136, 160, 77, 0.1);
  }
`;