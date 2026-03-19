import styled from "styled-components";

export default function DynamicRowInput({
  label,
  rows,
  onAdd,
  onRemove,
  onChange,
  columns, // Definition der Spalten (z.B. animalCount, size)
}) {
  return (
    <Container>
      <Label>{label}</Label>
      <Header>
        {columns.map((col) => (
          <span key={col.key}>{col.label}</span>
        ))}
        <div style={{ width: "40px" }} />
        {/* Platzhalter für Delete-Button */}
      </Header>

      {rows.map((row) => (
        <Row key={row.id}>
          {columns.map((col) => (
            <input
              key={col.key}
              type={col.type || "text"}
              placeholder={col.placeholder}
              value={row[col.key]}
              onChange={(e) => onChange(row.id, col.key, e.target.value)}
            />
          ))}
          <DeleteBtn onClick={() => onRemove(row.id)} type="button">
            🗑️
          </DeleteBtn>
        </Row>
      ))}

      <AddBtn onClick={onAdd} type="button">
        + Zeile hinzufügen
      </AddBtn>
    </Container>
  );
}

// Styled Components (Auszug)
const Container = styled.div`
  margin: 15px 0;
`;
const Header = styled.div`
  display: flex;
  gap: 10px;
  font-size: 11px;
  color: #88a04d;
  font-weight: bold;
  margin-bottom: 5px;

  span {
    flex: 1;
  }
`;
const Row = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 8px;

  input {
    flex: 1;
    padding: 8px;
    border: 1px solid #d1e2a5;
    border-radius: 5px;
  }
`;
const AddBtn = styled.button`
  background: #eef5db;
  border: 2px dashed #b5ce7e;
  color: #5a7024;
  padding: 8px;
  width: 100%;
  cursor: pointer;
  border-radius: 8px;

  &:hover {
    background: #e4eccd;
  }
`;
const DeleteBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
`;
const Label = styled.p`
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
`;