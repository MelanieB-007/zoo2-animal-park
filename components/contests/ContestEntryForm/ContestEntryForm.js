import styled from "styled-components";

import FormSelect from "../../forms/FormSelect";
import ItemThumbnail from "../../page-structure/icons/ItemThumbnail";
import DynamicRowInput from "../../ui/DynamicRowInput";
import PageHeader from "../../page-structure/PageHeader";
import PageWrapper from "../../page-structure/PageWrapper";
import { useTranslation } from "next-i18next";

export default function ContestEntryForm({
  contest,
  members,
  selectedMember,
  setSelectedMember,
  entries,
  columns,
  handlers, // Objekt mit addRow, removeRow, handleRowChange
  onSubmit,
}) {
  const { t } = /** @type {any} */ (useTranslation(["contests", "common"]));

  const options = { day: "2-digit", month: "2-digit", year: "numeric" };

  return (
    <PageWrapper>
    <form onSubmit={onSubmit}>
      <HeaderSection>
        <PageHeader text={t("contests:entry.title", "Tiere eintragen")} />
        <DateRange>
          {new Date(contest.start).toLocaleDateString("de-DE", options)} &ndash;
          {new Date(contest.ende).toLocaleDateString("de-DE", options)}
        </DateRange>
      </HeaderSection>

      <Section>
        <Label>Klubmitglied</Label>
        <FormSelect
          value={selectedMember}
          onChange={(e) => setSelectedMember(e.target.value)}
          placeholder={t("contests:entry.chooseMember", "Mitglied wählen")}
          options={members.map((m) => ({
            value: m.id,
            label: m.upjersname || m.name,
          }))}
          required
        />
      </Section>

      {contest.statuen.map((link) => {
        const tier = link.statue.tier;
        const tiername = tier.texte?.[0]?.name || "Unbekannt";

        return (
          <AnimalSection key={tier.id}>
            <AnimalHeader>
              <ItemThumbnail
                image={tier.bild}
                size="45"
                name={tiername}
                category={`tiere/${(tier.gehege?.name || "standard").toLowerCase()}`}
              />
              <h3>{tiername}</h3>
            </AnimalHeader>

            <DynamicRowInput
              columns={columns}
              rows={entries[tier.id]}
              onAdd={() => handlers.addRow(tier.id)}
              onRemove={(rowId) => handlers.removeRow(tier.id, rowId)}
              onChange={(rowId, key, value) =>
                handlers.handleRowChange(tier.id, rowId, key, value)
              }
            />
          </AnimalSection>
        );
      })}

      <SubmitButton type="submit">Speichern</SubmitButton>
    </form>
    </PageWrapper>
  );
}


const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

const DateRange = styled.p`
  font-weight: bold;
  color: #88a04d;
`;

const Section = styled.div`
  background: white;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
  border: 1px solid #eee;
`;

const AnimalSection = styled(Section)`
  border-left: 5px solid #88a04d;
`;

const AnimalHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;

  h3 {
    margin: 0;
    font-size: 1.2rem;
  }
`;

const Label = styled.label`
  display: block;
  font-weight: bold;
  margin-bottom: 8px;
  color: #5d7a2a;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 15px;
  background: #5d7a2a;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #4a6221;
  }
`;