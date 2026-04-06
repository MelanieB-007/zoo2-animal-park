import "styled-components";
import { theme } from "@/styles/theme"; // Pfad zu deiner theme.ts anpassen!

// Wir extrahieren den Typ aus deinem tatsächlichen Theme-Objekt
type CustomTheme = typeof theme;

declare module "styled-components" {
  export interface DefaultTheme extends CustomTheme {}
}