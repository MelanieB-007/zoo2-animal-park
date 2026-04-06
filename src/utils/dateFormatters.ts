/**
 * Wandelt ein ISO-Datum (YYYY-MM-DD) vom Browser
 * in das Zoo2-Datenbankformat (DD.MM.YYYY) um.
 */
export const formatToDbDate = (dateStr?: string): string | null => {
  if (!dateStr || !dateStr.includes("-")) return dateStr || null;
  const [year, month, day] = dateStr.split("-");
  return `${day}.${month}.${year}`;
};

/**
 * Wandelt ein Datenbank-Datum (DD.MM.YYYY)
 * zurück in ein HTML-Input-kompatibles Format (YYYY-MM-DD).
 */
export const formatFromDbDate = (dbDate?: string | null): string => {
  if (!dbDate || !dbDate.includes(".")) return "";
  const [day, month, year] = dbDate.split(".");
  return `${year}-${month}-${day}`;
};
