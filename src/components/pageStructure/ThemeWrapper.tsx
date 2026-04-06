"use client";

import React from "react";
import GlobalStyles from "@/styles/GlobalStyles";

export default function ThemeWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <GlobalStyles />
      {children}
    </>
  );
}
