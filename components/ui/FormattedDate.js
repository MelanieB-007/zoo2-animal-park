import { useRouter } from "next/router";

export default function FormattedDate({ date, options = {} }) {
  const { locale } = useRouter();

  if (!date) return null;

  let dateObj;

  // 1. Check: Ist es ein deutscher String (DD.MM.YYYY)?
  if (typeof date === "string" && date.includes(".")) {
    const [day, month, year] = date.split(".");
    // Baue es um zu YYYY-MM-DD
    dateObj = new Date(`${year}-${month}-${day}`);
  } else {
    // 2. Normaler Fall (ISO-String oder Date-Objekt)
    dateObj = typeof date === "string" ? new Date(date) : date;
  }

  // 3. Validierung
  if (!dateObj || isNaN(dateObj.getTime())) {
    console.warn("FormattedDate: Immer noch ungültig:", date);
    return <span>{date}</span>;
  }

  const defaultOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    ...options,
  };

  try {
    return (
      <time dateTime={dateObj.toISOString()}>
        {" "}
        {new Intl.DateTimeFormat(locale, defaultOptions).format(dateObj)}
      </time>
    );
  } catch (error) {
    return <span>{date}</span>;
  }
}