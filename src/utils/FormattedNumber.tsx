"use client";

import React from "react";
import { useLocale } from "next-intl";

interface FormattedNumberProps {
  value: number | string | null | undefined;
}

/**
 * Formatiert Zahlen international (Tausender-Trennzeichen),
 * OHNE Nachkommastellen (Integer-Stil).
 */
export default function FormattedNumber({ value }: FormattedNumberProps) {
  const locale = useLocale();

  // Sicherheits-Check: Falls der Wert leer ist oder kein Preis feststeht
  if (value === undefined || value === null || value === "") return null;

  // Umwandlung in eine Zahl (falls sie als String aus der DB kommt)
  const numericValue = typeof value === "string" ? parseInt(value, 10) : value;

  // Falls parseInt fehlschlägt (NaN), zeigen wir nichts an
  if (isNaN(numericValue as number)) return null;

  try {
    // Nutzt die native Intl-API des Browsers passend zum aktuellen locale
    const formatted = new Intl.NumberFormat(locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numericValue as number);

    return <span>{formatted}</span>;
  } catch (error) {
    // Fallback: Einfach die Zahl ohne Formatierung ausgeben
    return <span>{numericValue}</span>;
  }
}