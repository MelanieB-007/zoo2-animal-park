import styled from "styled-components";

import ItemThumbnail from "../../page-structure/icons/ItemThumbnail";
import PageHeader from "../../page-structure/PageHeader";

export default function ContestDetailView({ contest, analyses, t }) {
  return (
    <Container>
      <PageHeader text={t("contests:details.headline", "Wettbewerbs-Planung")} />

      <MetaInfo>
        📅 {new Date(contest.start).toLocaleDateString()} – {new Date(contest.ende).toLocaleDateString()}
      </MetaInfo>

      <TierGrid>
        {analyses.map(({ tier, stats }) => (
          <TierCard key={tier.id}>
            <TierHeader>
              <ItemThumbnail
                image={tier.bild}
                size="50"
                name={tier.texte?.[0]?.name}
                category={`tiere/${(tier.gehege?.name || "standard").toLowerCase()}`}
              />
              <TitleGroup>
                <h3>{tier.texte?.[0]?.name}</h3>
                <GrandTotal>{stats.totalWeighted.toLocaleString()} Pkt.</GrandTotal>
              </TitleGroup>
            </TierHeader>

            <List>
              <ListHeader>
                <span>Rang</span>
                <span>Mitglied</span>
                <span className="right">Punkte (xN)</span>
              </ListHeader>
              {stats.rankedMembers.map((m, i) => (
                <Row key={i}>
                  <Badge>{i + 1}</Badge>
                  <Name>{m.name}</Name>
                  <Points>
                    <small>{m.rawSum} × {m.multiplier}</small>
                    <strong>{m.weighted.toLocaleString()}</strong>
                  </Points>
                </Row>
              ))}
              {stats.rankedMembers.length === 0 && <Empty>Noch keine Meldungen</Empty>}
            </List>
          </TierCard>
        ))}
      </TierGrid>
    </Container>
  );
}

const Container = styled.div` 
  padding: 10px; 
`;

const MetaInfo = styled.p` 
  text-align: center; 
  color: #666; 
  font-weight: bold; 
  margin-bottom: 30px; 
`;

const TierGrid = styled.div` 
  display: grid; 
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); 
  gap: 20px; 
`;

const TierCard = styled.div`
  background: white;
  border-radius: 15px;
  border: 1px solid #e0e0e0;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
`;

const TierHeader = styled.div`
  background: #f8fcf0;
  padding: 15px;
  display: flex;
  align-items: center;
  gap: 15px;
  border-bottom: 2px solid #88a04d;
`;

const TitleGroup = styled.div`
  h3 { 
    margin: 0; 
    font-size: 1.1rem; 
    color: #333;
  }
`;

const GrandTotal = styled.div`
  font-size: 1.4rem;
  font-weight: 900;
  color: #5d7a2a;
`;

const List = styled.div` 
  padding: 15px;
`;

const ListHeader = styled.div`
  display: flex; 
  justify-content: space-between;
  font-size: 0.75rem; 
  color: #888; 
  text-transform: uppercase;
  margin-bottom: 10px; 
  padding: 0 5px;
  
  .right { 
    text-align: right; 
  }
`;

const Row = styled.div`
  display: flex; 
  align-items: center; 
  gap: 10px;
  padding: 8px 5px; 
  border-bottom: 1px solid #f5f5f5;
  
  &:last-child { 
    border: none; 
  }
`;

const Badge = styled.span`
  background: #eee; 
  width: 22px; 
  height: 22px; 
  border-radius: 50%;
  
  display: flex; 
  align-items: center; 
  justify-content: center; 
  font-size: 0.7rem; 
  font-weight: bold;
`;

const Name = styled.span` 
  flex: 1; 
  font-size: 0.9rem; 
  font-weight: 500; 
`;

const Points = styled.div`
  text-align: right;
  
  small { 
    display: block; 
    font-size: 0.7rem; 
    color: #999; 
    line-height: 1; 
  }
  
  strong { 
    font-size: 0.95rem; 
    color: #333; 
  }
`;

const Empty = styled.div` 
  text-align: center; 
  color: #ccc; 
  padding: 20px; 
  font-style: italic; 
`;