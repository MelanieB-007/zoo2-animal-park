"use client";

import React from "react";
import styled from "styled-components";
import { useTranslations } from "next-intl";

import EditButton from "@/components/icons/EditIcon";
import DeleteButton from "@/components/icons/DeleteIcon";

interface ActionGroupProps {
  localeFile: string; // z.B. "animals" oder "members"
  onEdit: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
}

export default function ActionGroup({
  localeFile,
  onEdit,
  onDelete,
}: ActionGroupProps) {
  // Wir laden beide Namespaces für maximale Flexibilität
  const t = useTranslations(localeFile);
  const tCommon = useTranslations("common");

  return (
    /* stopPropagation verhindert, dass die LinkedRow ausgelöst wird */
    <StyledActionGroup onClick={(e) =>
      e.stopPropagation()}>
      <EditButton
        tooltip={t("tooltips.edit") || tCommon("actions.edit")}
        onClick={onEdit}
        aria-label={t("tooltips.edit") || tCommon("actions.edit")}
      />
      <DeleteButton
        tooltip={t("tooltips.delete") || tCommon("actions.delete")}
        align="left"
        onClick={onDelete}
        aria-label={t("tooltips.delete") || tCommon("actions.delete")}
      />
    </StyledActionGroup>
  );
}

const StyledActionGroup = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: flex-end; 
`;
