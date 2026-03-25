import React from "react";
import styled from "styled-components";
import { useTranslation } from "next-i18next";

import { NameDE } from "../../page-structure/Elements/Name";
import GehegeBadge from "../../ui/GehegeBadge";
import StallLevelBadge from "../../ui/StallLevelBadge";
import ItemThumbnail from "../../page-structure/icons/ItemThumbnail";
import { useRouter } from "next/router";

export default function StatueMobileCard({ statue }) {
  const router = useRouter();
  const { t } = /** @type {any} */ (
    useTranslation(["contest", "animals", "common"])
  );

  const tier = statue.tier;
  const tiername = tier?.texte?.[0]?.name || "Unbekannt";
  const habitatName = tier?.gehege?.name || "standard";
  const animalId = tier?.id;

  const handleClick = () => {
    if (animalId) {
      router.push(`/animals/${animalId}`);
    }
  };

  return (
    <CardContainer onClick={handleClick} style={{ cursor: animalId ? "pointer" : "default" }}>
      <HeaderRow>
        {/* Name der Statue oben links */}
        <NameDE>{statue.name}</NameDE>

        {/* Platzhalter für zukünftige Aktionen, falls benötigt */}
        <div style={{ fontSize: '0.8rem', color: '#888' }}>
          {t("contest:statues.card_label") || "Statue"}
        </div>
      </HeaderRow>

      <Divider />

      <StatsRow>
        <InfoRow>
          {/* Hier zeigen wir den Tiernamen an, zu dem die Statue gehört */}
          <AnimalLabel>{tiername}</AnimalLabel>
        </InfoRow>

        <IconsRow>
          {/* Das Statuen-Bild (Thumbnail) */}
          <ItemThumbnail
            image={statue.bild}
            name={tiername}
            habitat={tier?.gehege}
            category="statues"
            size={50}
            tooltip={false}
          />

          {/* Gehege Badge */}
          <GehegeBadge gehege={tier?.gehege} size={35} />

          {/* Stalllevel Badge */}
          <StallLevelBadge
            level={tier?.stalllevel}
            habitat={habitatName}
          />
        </IconsRow>
      </StatsRow>
    </CardContainer>
  );
}

// Styled Components - Exakt wie bei der AnimalMobileCard für 100% Konsistenz
const CardContainer = styled.div`
  background: var(--color-white);
  border-radius: 12px;
  padding: 12px 16px;
  margin-bottom: 12px;
  width: 80vw;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const Divider = styled.div`
  height: 1px;
  background-color: #eee;
  margin-bottom: 12px;
`;

const StatsRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: flex-start;
  padding-left: 4px;
`;

const AnimalLabel = styled.span`
  font-size: 0.9rem;
  color: var(--color-primary-green);
  font-weight: 600;
`;

const IconsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;