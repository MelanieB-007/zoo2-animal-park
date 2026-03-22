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
      ?.filter(t => t.spracheCode !== 'de') // <-- HIER: Deutsch explizit ausschließen
      .map(t => ({
        id: t.spracheCode,
        spracheCode: t.spracheCode,
        name: t.name || "",
        description: t.beschreibung || ""
      })) || [];

    // Standard-Objekt für Aktionen (falls mal Daten fehlen)
    const actions = {
      feed: { xp: "", durationHours: "", durationMinutes: "" },
      play: { xp: "", durationHours: "", durationMinutes: "" },
      clean: { xp: "", durationHours: "", durationMinutes: "" },
    };

    // Mapping-Tabelle für xpart IDs zu den Formular-Keys
    const xpTypeMap = {
      "0": "feed",
      "1": "play",
      "2": "clean"
    };

    // Wir füllen das actions-Objekt mit echten Daten aus raw.xp
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
      // Diese Felder sind für die "einfachen" Inputs
      nameDe: deText?.name || raw.name || "", // Falls deText existiert, nimm den Namen von dort
      descriptionDe: deText?.beschreibung || raw.beschreibung || "",

      // Wir mappen die texte-Relation in das Format der Section
      translations: translations,

      // Zahlen-Felder (Mapping von DB-Name auf Form-Name)
      price: raw.preis || 0,
      // HIER: Die Brücke zwischen DB (preisartId) und Formular (currency)
      currency: raw.preisartId?.toString() || "1", // "1" als Fallback (meist Münzen)
      popularity: raw.popularitaet || 0,
      sellValue: raw.verkaufswert || 0,
      breedingLevel: raw.stalllevel || 1,
      breedingCosts: raw.zuchtkosten || 0,
      breedingDuration: raw.zuchtdauer || 0,
      breedingChance: raw.startprozent || 0,

      // Datum konvertieren (WICHTIG für HTML-Inputs!)
      // Macht aus "17.06.2024" -> "2024-06-17"
      releaseDate: formatDateForInput(raw.release || raw.releaseDate),

      // Gehege-ID als String (damit das Select-Feld funktioniert)
      enclosureType: raw.gehegeId?.toString() || "",

      actions: actions,

      // Herkunft (Nur IDs extrahieren)
      origins: raw.tierherkunft?.map(th => th.herkunftId) || []
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