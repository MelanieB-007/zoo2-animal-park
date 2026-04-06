import { getAllAnimals } from "@/services/AnimalService";
import AnimalOverviewClient from "@/components/pages/animals/AnimalOverview/AnimalOverviewClient";

export default async function AnimalsPage({
  params,
}: {
  params: { locale: string };
}) {
  // Im App Router kommt das locale oft aus den params
  const locale = params.locale || "de";

  // Der Service liefert jetzt direkt die "schönen" Daten
  const initialAnimals = await getAllAnimals(locale);

  return <AnimalOverviewClient initialAnimals={initialAnimals} locale={locale} />;
}
