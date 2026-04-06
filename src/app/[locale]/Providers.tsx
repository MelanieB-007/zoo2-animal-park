"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import { NextIntlClientProvider } from "next-intl";

export default function Providers({
  children,
  messages,
  locale,
}: {
  children: React.ReactNode;
  messages: Record<string, unknown>;
  locale: string;
}) {
  return (
    <SessionProvider>
      <NextIntlClientProvider messages={messages} locale={locale}>
        {children}
      </NextIntlClientProvider>
    </SessionProvider>
  );
}
