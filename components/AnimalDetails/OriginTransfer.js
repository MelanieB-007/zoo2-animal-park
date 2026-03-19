import styled from 'styled-components';

export default function OriginTransfer({ available, selected, onMoveRight, onMoveLeft }) {
  return (
    <TransferContainer>
      <ListColumn>
        <Label>Verfügbar</Label>
        <ScrollBox>
          {available.map(item => (
            <Item key={item.id} onClick={() => onMoveRight(item)}>
              {item.name} <span>+</span>
            </Item>
          ))}
        </ScrollBox>
      </ListColumn>

      <Controls>
        <span>⇆</span>
      </Controls>

      <ListColumn>
        <Label>Ausgewählt</Label>
        <ScrollBox $highlight>
          {selected.map(item => (
            <Item key={item.id} onClick={() => onMoveLeft(item)} $selected>
              {item.name} <span>−</span>
            </Item>
          ))}
        </ScrollBox>
      </ListColumn>
    </TransferContainer>
  );
}

const TransferContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: flex-start;
  margin-top: 10px;
`;

const ListColumn = styled.div`
  flex: 1;
`;

const ScrollBox = styled.div`
  height: 200px; /* Hier ist dein Scrollbalken-Limit */
  overflow-y: auto;
  border: 1px solid #d1e2a5;
  border-radius: 8px;
  background: ${props => props.$highlight ? '#f9fbf2' : '#fff'};
  
  /* Schicker Scrollbar für Chrome/Safari */
  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-thumb { background: #d1e2a5; border-radius: 10px; }
`;

const Item = styled.div`
  padding: 8px 12px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  border-bottom: 1px solid #f0f0f0;

  &:hover { background: #edf4d7; }
  span { color: ${props => props.$selected ? '#e74c3c' : '#76b041'}; font-weight: bold; }
`;

const Label = styled.div`
  font-size: 11px;
  font-weight: bold;
  color: #88a04d;
  margin-bottom: 5px;
  text-transform: uppercase;
`;

const Controls = styled.div`
  display: flex;
  align-self: center;
  color: #d1e2a5;
  font-size: 24px;
`;