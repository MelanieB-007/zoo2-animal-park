import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  // Hier deine Sprachen aus der flagMap eintragen
  locales: ["de", "en", "da", "nl", "be"],
  defaultLocale: "de",
});

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
