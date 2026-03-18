import React from "react";
import styled from "styled-components";

import EditButton from "../../icons/EditIcon";
import DeleteButton from "../../icons/DeleteIcon";

export default function ActionGroupIcons(){
  return (
    <ActionGroup
      onClick={(e) => e.stopPropagation()}>
      <EditButton tooltip={t("animals:tooltips.edit")} />
      <DeleteButton
        tooltip={t("animals:tooltips.delete")}
        align="left"
      />
    </ActionGroup>
  );
}

const ActionGroup = styled.div`
  display: flex;
  gap: 10px;
`;