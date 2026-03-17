import React from "react";
import styled from "styled-components";
import DiamondIcon from "./DiamondIcon";
import ZoodollarIcon from "./ZoodollarIcon";
import Tooltip from "../ui/Tooltip";
import { useTranslation } from "next-i18next";

export default function PriceDisplay({ value, type }) {
  const { t } = useTranslation("common");

  return (
    <PriceWrapper>
      {type === "diamanten" ? (
        <Tooltip text={t("diamond")} position="top">
          <DiamondIcon value={value} />
        </Tooltip>
      ) : (
        <Tooltip text={t("gold")} position="top">
          <ZoodollarIcon value={value} />
        </Tooltip>
      )}
    </PriceWrapper>
  );
}

const PriceWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  padding-right: 5px;
`;