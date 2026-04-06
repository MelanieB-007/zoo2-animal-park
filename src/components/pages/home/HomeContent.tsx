"use client";

import styled from "styled-components";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { theme } from "@/styles/theme";

export default function HomeContent({ stats }: { stats: any }) {
  const t = useTranslations("home");

  return (
    <FullPageContainer>
      <HeroSection>
        <ContentWrapper>
      <Badge>{t("badge_community")}</Badge>
      <MainTitle>
        Zoo 2: Animal Park <span>Manager</span>
      </MainTitle>

      <StatsBar>
        <StatItem>
          <div className="number">{stats.tiere}</div>
          <div className="label">{t("stats.animals")}</div>
        </StatItem>
        <StatItem>
          <div className="number">{stats.varianten}</div>
          <div className="label">{t("stats.variants")}</div>
        </StatItem>
        <StatItem>
          <div className="number">{stats.gehege}</div>
          <div className="label">{t("stats.habitats")}</div>
        </StatItem>
        <StatItem>
          <div className="number">6</div>
          <div className="label">{t("stats.regions")}</div>
        </StatItem>
      </StatsBar>

      <ActionGrid>
        <Link href="/animals" passHref legacyBehavior>
          <MenuCard $color="#4ca64c">
            <Icon>🐾</Icon>
            <h3>{t("cards.lexicon.title")}</h3>
            <p>{t("cards.lexicon.text")}</p>
          </MenuCard>
        </Link>

        <Link href="/animals/variants" passHref legacyBehavior>
          <MenuCard $color="#3498db">
            <Icon>🎨</Icon>
            <h3>{t("cards.variants.title")}</h3>
            <p>{t("cards.variants.text")}</p>
          </MenuCard>
        </Link>

        <Link href="/contests" passHref legacyBehavior>
          <MenuCard $color="#f39c12">
            <Icon>🏆</Icon>
            <h3>{t("cards.club.title")}</h3>
            <p>{t("cards.club.text")}</p>
          </MenuCard>
        </Link>
      </ActionGrid>
        </ContentWrapper>
      </HeroSection>
    </FullPageContainer>
  );
}

// --- Styles ---

const FullPageContainer = styled.div`
  width: 100%;
  min-height: calc(100vh - 70px);
  display: flex;
  flex-direction: column;
  background-color: #ffffff;

  @media (max-width: 768px) {
    height: auto;
    overflow-y: auto;
  }
`;

const HeroSection = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 40px 20px;
  background-image: url("/images/Zoo2_AnimalPark.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  @media (max-width: 768px) {
    padding: 60px 15px;
    min-height: 100vh;
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.85) 0%,
      rgba(255, 255, 255, 0.4) 100%
    );
    z-index: 1;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1100px;
  width: 100%;
  text-align: center;
  position: relative;
  z-index: 2;
`;


const MainTitle = styled.h1`
  font-family: var(--font-club);
  font-size: clamp(2.5rem, 8vw, 4.5rem);
  color: ${theme.colors.brand.petrolDark};
  margin: 20px 0 40px;

  span {
    color: ${theme.colors.brand.green};
  }
`;

const StatsBar = styled.div`
  display: inline-flex;
  gap: 40px;
  background: white;
  padding: 25px 50px;
  border-radius: 100px;
  box-shadow: ${theme.shadows.soft};
  border: 2px solid ${theme.colors.brand.greenLight}30;
  margin-bottom: 60px;

  @media (max-width: 768px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    padding: 25px;
    border-radius: 30px;
  }
`;

const ActionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const MenuCard = styled.a<{ $color: string }>`
  background: white;
  padding: 40px 30px;
  border-radius: 24px;
  border: 1px solid #eee;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  text-decoration: none;

  &:hover {
    transform: translateY(-10px);
    border-color: ${(props) => props.$color};
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  }

  h3 {
    color: ${theme.colors.brand.petrol};
  }
`;

const Icon = styled.div`
  font-size: 3rem;
  margin-bottom: 15px;
`;

const Badge = styled.span`
  background: ${theme.colors.brand.greenLight}40;
  color: ${theme.colors.brand.petrolDark};
  padding: 8px 20px;
  border-radius: 50px;
  font-weight: 900;
  font-size: 0.85rem;
  letter-spacing: 1px;
`;

const StatItem = styled.div`
  text-align: center;

  .number {
    font-size: 1.8rem;
    font-weight: 900;
    color: #2d5a27;

    @media (max-width: 768px) {
      font-size: 1.4rem;
    }
  }

  .label {
    font-size: 0.8rem;
    color: #88b04b;
    text-transform: uppercase;
    font-weight: bold;

    @media (max-width: 768px) {
      font-size: 0.65rem;
    }
  }
`;