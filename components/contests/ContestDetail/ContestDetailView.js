import React from "react";
import Link from "next/link";
import styled from "styled-components";

import ItemThumbnail from "../../page-structure/icons/ItemThumbnail";
import PageHeader from "../../page-structure/PageHeader";
import { useTranslation } from "next-i18next";


export default function ContestDetailView({ contest, analyses }) {
  const { t } = /** @type {any} */ (
    useTranslation(["animals", "contests", "common"])
  );

  const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
  const isExpired = new Date() > new Date(contest.ende);

  return (
    <Container>
      <PageHeader text={t("contests:details.headline", "Wettbewerbs-Planung")} />

      <MetaInfo>
        📅 {new Date(contest.start).toLocaleDateString('de-DE', options)} –
        {new Date(contest.ende).toLocaleDateString('de-DE', options)}
      </MetaInfo>

      {!isExpired && (
        <ActionRow>
          <Link href={`/contests/${contest.id}/entries`}>
             <StyledButton type="button">
              {t("contests:details.add_my_animals", "Eigene Tiere melden")}
            </StyledButton>
          </Link>
        </ActionRow>
      )}

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
  align-items: center; 
  gap: 10px; 

  font-size: 0.75rem;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  padding: 0 5px 3px 5px; 
  margin-bottom: 2px;

  border-bottom: 1px solid #f0f0f0;

  /* Spalte 1: "RANG" (Dasselbe Maß wie Badge + Gap in Row) */
  span:nth-child(1) {
    width: 30px;
    text-align: center;
  }

  /* Spalte 2: "MITGLIED" */
  span:nth-child(2) {
    flex: 1; 
    text-align: left; 
  }

  /* Spalte 3: "PUNKTE (XN)" */
  span:nth-child(3) {
    text-align: right;
  }
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  padding: 5px 5px; 
  border-bottom: 1px solid #f5f5f5;

  &:last-child {
    border: none;
  }
  
  > span:first-child {
    margin-right: 0; 
  }
`;

const Name = styled.span` 
  flex: 1; 
  font-size: 0.9rem; 
  font-weight: 500; 
  text-align: left;
  padding-left: 5px;
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
  margin-left: 5px;
`;

const Empty = styled.div` 
  text-align: center; 
  color: #ccc; 
  padding: 20px; 
  font-style: italic; 
`;

const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  padding: 12px 24px;
  background-color: #5d7a2a; 
  color: white;
  
  font-size: 1rem;
  font-weight: 700;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  border-radius: 12px;
  border: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  
  transition: all 0.2s ease-in-out;
  cursor: pointer;

  &:hover {
    background-color: #4a6221;
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  svg {
    font-size: 1.2rem;
  }
`;

const ActionRow = styled.div`
  display: flex;
  justify-content: center; 
  width: 100%;
  max-width: 800px; 
  margin: 0 auto 25px auto; 
  padding: 0 10px; 
  box-sizing: border-box;
`;