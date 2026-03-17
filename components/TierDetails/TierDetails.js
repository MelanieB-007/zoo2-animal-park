import { useState, useEffect } from "react";
import useSWR from "swr";
import PageWrapper from "../page-structure/PageWrapper";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function TierDetails({ animal: initialData }) {
  const [mounted, setMounted] = useState(false);

  // Dieser Effekt läuft erst im Browser nach dem ersten Rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: animal, error } = useSWR(
    mounted ? `/api/tiere/${initialData.id}` : null, // SWR erst im Browser starten
    fetcher,
    { fallbackData: initialData }
  );

  if (error) return <div>Fehler beim Laden der Live-Daten</div>;
  if (!animal) return null;

  return (

      <h1>{animal.name}</h1>
  );
}