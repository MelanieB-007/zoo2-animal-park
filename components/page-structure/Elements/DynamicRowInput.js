import styled from "styled-components";

export default function DynamicRowInput({
  label,
  rows,
  onAdd,
  disabledAdd,
  onRemove,
  onChange,
  columns,
}) {
  return (
    <Container>
      {label && <Label>{label}</Label>}

      <Header>
        {columns.map((col) => (
          <span key={col.key} style={{ flex: col.flex || 1 }}>
            {col.label}
          </span>
        ))}
        <div style={{ width: "30px" }} />
        {/* Platzhalter für Delete-Icon */}
      </Header>

      {rows.map((row) => (
        <Row key={row.id}>
          {columns.map((col) => (
            <div key={col.key} style={{ flex: col.flex || 1 }}>
              {col.type === "select" ? (
                <select
                  value={row[col.key]}
                  onChange={(e) => onChange(row.id, col.key, e.target.value)}
                >
                  {col.options
                    // DAS IST NEU: Filtert Optionen, die in anderen Zeilen schon gewählt sind
                    .filter((opt) => {
                      const otherRows = rows.filter((r) => r.id !== row.id);
                      const usedValues = otherRows.map((r) => r[col.key]);
                      return (
                        !usedValues.includes(opt.value) ||
                        opt.value === row[col.key]
                      );
                    })
                    .map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                </select>
              ) : (
                <input
                  type={col.type || "text"}
                  placeholder={col.placeholder}
                  value={row[col.key] || ""}
                  onChange={(e) => onChange(row.id, col.key, e.target.value)}
                />
              )}
            </div>
          ))}
          <DeleteBtn
            onClick={() => onRemove(row.id)}
            type="button"
            title="Löschen"
          >
            🗑️
          </DeleteBtn>
        </Row>
      ))}

      <AddBtn
        onClick={onAdd}
        type="button"
        disabled={disabledAdd}
      >
        {disabledAdd ? "Alle Sprachen hinzugefügt" : "+ Zeile hinzufügen"}
      </AddBtn>
    </Container>
  );
}


const Container = styled.div`
  margin: 10px 0;
`;

const Label = styled.p`
  font-weight: bold;
  font-size: 13px;
  margin-bottom: 8px;
  color: #5d7a2a;
`;

const Header = styled.div`
  display: flex;
  gap: 10px;
  font-size: 11px;
  color: #88a04d;
  font-weight: bold;
  margin-bottom: 5px;
  padding: 0 5px;

  span {
    /* Flex wird inline über die Props gesteuert */
  }
`;

const Row = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 8px;
  align-items: center;

  div {
    display: flex;
  }

  input,
  select {
    width: 100%;
    padding: 8px;
    border: 1px solid #d1e2a5;
    border-radius: 5px;
    font-size: 14px;
    outline: none;

    &:focus {
      border-color: #88a04d;
      box-shadow: 0 0 0 2px rgba(136, 160, 77, 0.1);
    }
  }

  select {
    cursor: pointer;
    background-color: white;
  }
`;

const AddBtn = styled.button`
  background: #fdfdfd;
  border: 1px dashed #b5ce7e;
  color: #5a7024;
  padding: 8px;
  width: 100%;
  cursor: pointer;
  border-radius: 8px;
  font-size: 13px;
  margin-top: 5px;
  transition: all 0.2s;

  &:hover {
    background: #f4f9e9;
    border-color: #88a04d;
  }

  &:disabled {
    background: #f0f0f0;
    border-color: #ccc;
    color: #999;
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const DeleteBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  opacity: 0.6;
  transition: opacity 0.2s;
  width: 30px;
  display: flex;
  justify-content: center;

  &:hover {
    opacity: 1;
  }
`;
