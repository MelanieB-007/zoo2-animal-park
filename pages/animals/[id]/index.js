import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import useSWR from "swr";

import PageWrapper from "../../../components/page-structure/PageWrapper";
import ContentWrapper from "../../../components/page-structure/ContentWrapper";
import AnimalDetailContent from "../../../components/animals/AnimalDetails/AnimalDetailContent";
import { getAnimalById } from "../../../services/AnimalService";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useTranslation } from "next-i18next";


export default function TierDetail({ animal: fallbackData }) {
  const { t } = useTranslation(["animals", "common"]);
  const router = useRouter();
  const { locale } = router;

  const { data: animal } = useSWR(
    fallbackData?.id ? `/api/animals/${fallbackData.id}?lang=${locale}` : null,
    null,
    {
      fallbackData,// 1. Kein automatisches Update, wenn man das Fenster wieder anklickt
      revalidateOnFocus: false,

      // 2. Daten gelten für 5 Minuten als "frisch" (300.000 ms)
      // SWR fragt in dieser Zeit nicht erneut im Hintergrund nach
      dedupingInterval: 300000,

      // 3. Nur updaten, wenn man die Seite wirklich neu lädt
      revalidateOnMount: false,

      // 4. Bei einem Fehler nicht sofort 10x neu probieren
      errorRetryCount: 2
    }
  );

  // --- NEUE LÖSCH-FUNKTION ---
  const handleDelete = async () => {
    const result = await Swal.fire({
      title: t("animals:messages.deleteErrorTitle") || 'Tier löschen?',
      text: t("animals:messages.confirmDelete") || "Möchtest du dieses Tier wirklich aus der Liste entfernen?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: t("common:messages.yes_delete") || 'Ja, löschen!',
      cancelButtonText: t("common:messages.cancel") || 'Abbrechen'
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/animals/${animal.id}`, { method: 'DELETE' });
        if (res.ok) {
          toast.success(t("animals:messages.deleteSuccess") || "Tier erfolgreich gelöscht! 🐾");
          router.push('/animals'); // Zurück zur Liste
        } else {
          toast.error(t("animals:messages.deleteError") || "Fehler beim Löschen des Tieres 🐾");
        }
      } catch (error) {
        toast.error("Verbindung zum Server fehlgeschlagen.");
      }
    }
  };

  // --- NEUE EDIT-FUNKTION ---
  const handleEdit = () => {
    router.push(`/animals/${animal.id}/edit`);
  };

  return (
    <PageWrapper>
      <ContentWrapper>
        <AnimalDetailContent
          animal={animal}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      </ContentWrapper>
    </PageWrapper>
  );
}
export async function getServerSideProps({ params, locale }) { // 2. locale hinzufügen
  const { id } = params;
  const animal = await getAnimalById(id, locale);

  if (!animal) return { notFound: true };

  return {
    props: {
      animal: JSON.parse(JSON.stringify(animal)),
      ...(await serverSideTranslations(locale || 'de', ['common', 'animals'])),
    },
  };
}