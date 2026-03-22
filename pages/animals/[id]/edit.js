import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import useSWR from 'swr';

import PageWrapper from "../../../components/page-structure/PageWrapper";
import ContentWrapper from "../../../components/page-structure/ContentWrapper";
import AnimalForm from "../../../components/AnimalForm/AnimalForm";
import { getAnimalById } from "../../../services/AnimalService";

export default function EditAnimal({ animal: fallbackData }) {
  const router = useRouter();
  const { id } = router.query;

  // SWR für Live-Daten (falls sich im Hintergrund was ändert)
  const { data: animal } = useSWR(id ? `/api/animals/${id}` : null, {
    fallbackData,
    revalidateOnMount: true // Wichtig, um die DB-Relationen (texte, xp) sicher zu laden
  });

  // Mapper: Datenbank-Struktur -> Formular-Struktur
  const formatInitialData = (raw) => {
    if (!raw) return null;

    // 1. Suche den deutschen Text für die Hauptfelder
    const deText = raw.texte?.find(t => t.spracheCode === 'de');

    // 2. Mappe ALLE ANDEREN Texte in das translations-Array
    const translations = raw.texte
      ?.filter(t => t.spracheCode !== 'de')
      .map(t => ({
        id: t.spracheCode,
        spracheCode: t.spracheCode,
        name: t.name || "",
        description: t.beschreibung || ""
      })) || [];

    const actions = {
      feed: { xp: "", durationHours: "", durationMinutes: "" },
      play: { xp: "", durationHours: "", durationMinutes: "" },
      clean: { xp: "", durationHours: "", durationMinutes: "" },
    };

     const xpTypeMap = {
      "0": "feed",
      "1": "play",
      "2": "clean"
    };

    raw.xp?.forEach(item => {
      const key = xpTypeMap[item.xpart];
      if (key) {
        actions[key] = {
          xp: item.wert || 0,
          // Umrechnung: Minuten -> Stunden & Restminuten
          durationHours: Math.floor((item.zeit || 0) / 60),
          durationMinutes: (item.zeit || 0) % 60,
        };
      }
    });

    return {
      ...raw,

      nameDe: deText?.name || raw.name || "",
      descriptionDe: deText?.beschreibung || raw.beschreibung || "",

      // Wir mappen die texte-Relation in das Format der Section
      translations: translations,

      price: raw.preis || 0,
      currency: raw.preisartId?.toString() || "1",
      popularity: raw.popularitaet || 0,
      sellValue: raw.verkaufswert || 0,
      breedingLevel: raw.stalllevel || 1,
      breedingCosts: raw.zuchtkosten || 0,
      breedingDuration: raw.zuchtdauer || 0,
      breedingChance: raw.startprozent || 0,

      // Datum konvertieren
      releaseDate: formatDateForInput(raw.release || raw.releaseDate),

      // Gehege-ID als String (damit das Select-Feld funktioniert)
      enclosureType: raw.gehegeId?.toString() || "",

      actions: actions,
      // Mapping für die Gehegekapazität
      enclosureSizes: raw.tier_gehege_kapazitaet?.map(cap => ({
        // Wir brauchen eine ID für DynamicRowInput (animalCount ist hier eindeutig)
        id: cap.anzahlTiere,
        animalCount: cap.anzahlTiere,
        size: cap.felder
      })) || [],

      // HIER: Wir mappen die Relationen auf flache Objekte für den Transfer-View
      origins: raw.tierherkunft?.map(th => ({
        id: th.herkunftId,
        name: th.herkunft?.name || "Unbekannt"
      })) || []
    };
  };

  function formatDateForInput(dateStr) {
    if (!dateStr || typeof dateStr !== "string" || !dateStr.includes('.')) return "";
    const [day, month, year] = dateStr.split('.');
    return `${year}-${month}-${day}`;
  }

  return (
    <PageWrapper>
      <ContentWrapper>
        <h1 style={{ color: "#5d7a2a", marginBottom: "20px" }}>
          {animal?.name || "Tier"} bearbeiten
        </h1>

        <AnimalForm
          key={animal?.id || id}
          initialData={formatInitialData(animal)}
          isEdit={true}
          onSuccess={() => router.push(`/animals/${id}`)}
        />
      </ContentWrapper>
    </PageWrapper>
  );
}

export async function getServerSideProps({ params, locale }) {
  const { id } = params;
  const animal = await getAnimalById(id);

  if (!animal) return { notFound: true };

  return {
    props: {
      animal: JSON.parse(JSON.stringify(animal)),
      ...(await serverSideTranslations(locale || 'de', ['common', 'animals'])),
    },
  };
}