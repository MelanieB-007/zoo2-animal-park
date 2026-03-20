import styled from "styled-components";
import FormInput from "./FormInput";
import FormSelect from "./FormSelect";
import FormTextarea from "./FormTextarea";

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
          <HeaderCell key={col.key} $flex={col.flex}>
            {col.label}
          </HeaderCell>
        ))}
        <DeletePlaceholder />
      </Header>

      {rows.map((row) => (
        <Row key={row.id}>
          {columns.map((col) => (
            <Cell key={col.key} $flex={col.flex}>
              {col.type === "select" ? (
                <FormSelect
                  value={row[col.key]}
                  onChange={(e) => onChange(row.id, col.key, e.target.value)}
                  options={col.options.filter((opt) => {
                    const otherRows = rows.filter((r) => r.id !== row.id);
                    const usedValues = otherRows.map((r) => r[col.key]);
                    return (
                      !usedValues.includes(opt.value) ||
                      opt.value === row[col.key]
                    );
                  })}
                />
              ) : col.type === "textarea" ? (
                <FormTextarea
                  $minHeight="60px"
                  placeholder={col.placeholder}
                  value={row[col.key] || ""}
                  onChange={(e) => onChange(row.id, col.key, e.target.value)}
                />
              ) : (
                <FormInput
                  type={col.type || "text"}
                  placeholder={col.placeholder}
                  value={row[col.key] || ""}
                  onChange={(e) => onChange(row.id, col.key, e.target.value)}
                />
              )}
            </Cell>
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

      <AddBtn onClick={onAdd} type="button" disabled={disabledAdd}>
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
`;

const HeaderCell = styled.span`
  flex: ${(props) => props.$flex || 1};
`;

const DeletePlaceholder = styled.div`
  width: 30px;
`;

const Row = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 12px;
  align-items: flex-start; /* Hält Select/Input oben, wenn Textarea wächst */
`;

const Cell = styled.div`
  display: flex;
  flex: ${(props) => props.$flex || 1};
`;

const AddBtn = styled.button`
  background: #fdfdfd;
  border: 1px dashed #b5ce7e;
  color: #5a7024;
  padding: 10px;
  width: 100%;
  cursor: pointer;
  border-radius: 8px;
  font-size: 13px;
  margin-top: 5px;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: #f4f9e9;
    border-color: #88a04d;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  &:disabled {
    background: #f5f5f5;
    color: #999;
    border-color: #ddd;
    cursor: not-allowed;
  }
`;

const DeleteBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  opacity: 0.5;
  transition: all 0.2s;
  width: 30px;
  height: 38px; /* Zentriert das Icon optisch neben einzeiligen Inputs */
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    opacity: 1;
    transform: scale(1.1);
  }
`;