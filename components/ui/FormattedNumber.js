import { useRouter } from "next/router";

/**
 * Formatiert Zahlen international, OHNE Nachkommastellen
 * @param {number} value - Die Ganzzahl
 */
export default function FormattedNumber({ value }) {
  const { locale } = useRouter();

  if (value === undefined || value === null) return null;

  // Wir stellen sicher, dass es eine Ganzzahl ist (integer)
  const integerValue = parseInt(value, 10);

  try {
    const formatted = integerValue.toLocaleString(locale, {
      minimumFractionDigits: 0, // Keine Nachkommastellen (z.B. keine .00)
      maximumFractionDigits: 0, // Auch nicht, wenn sie existieren würden
    });

    return <span>{formatted}</span>;
  } catch (error) {
    // Fallback: Zeige die rohe Zahl
    return <span>{integerValue}</span>;
  }
}