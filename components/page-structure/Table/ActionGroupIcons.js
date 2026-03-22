import React from "react";
import styled from "styled-components";
import { useTranslation } from "next-i18next";

import EditButton from "../../icons/EditIcon";
import DeleteButton from "../../icons/DeleteIcon";

export default function ActionGroupIcons({ onEdit, onDelete }) {
  const { t } = /** @type {any} */ (useTranslation(["animals", "common"]));

  return (
    <ActionGroup onClick={(e) => e.stopPropagation()}>
      <EditButton
        tooltip={t("animals:tooltips.edit")}
        altText={t("animals:tooltips.edit")}
        onClick={(e) => {
          onEdit(e);
        }}
        aria-label={t("animals:tooltips.edit")}
      />
      <DeleteButton
        tooltip={t("animals:tooltips.delete")}
        altText={t("animals:tooltips.delete")}
        align="left"
        onClick={(e) => {
          onDelete(e);
        }}
      />
    </ActionGroup>
  );
}

const ActionGroup = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: nowrap;
  align-items: center;
`;