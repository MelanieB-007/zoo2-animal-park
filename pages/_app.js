import { SessionProvider } from "next-auth/react";
import { SWRConfig } from "swr";
import { appWithTranslation } from 'next-i18next';

import {
  Sedgwick_Ave_Display,
  DM_Sans,
  Playfair_Display,
} from "next/font/google";
import { ThemeProvider } from "styled-components";
import GlobalStyle from "../styles/styles";
import { theme } from "../styles/theme";
import "flag-icons/css/flag-icons.min.css";

import Header from "../components/page-structure/Header/Header";
import Main from "../components/page-structure/Main/Main";
import Footer from "../components/page-structure/Footer/Footer";
import ScrollToTop from "../components/ui/ScrollToTop";

const sedgwick = Sedgwick_Ave_Display({ weight: "400", subsets: ["latin"] });
const dmSans = DM_Sans({
  weight: ["400", "500", "700"], // Hier die Gewichte definieren
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  weight: ["400", "700"],
  subsets: ["latin"],
});

export function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider theme={theme}>
        {/* Wir übergeben die CSS-Variablen der Schriften an die GlobalStyles */}
        <style jsx global>{`
          :root {
            --font-club: ${sedgwick.style.fontFamily};
            --font-text: ${dmSans.style.fontFamily};
            --font-heading: ${playfair.style.fontFamily};
            --font-comic: "Comic Sans MS", "Chalkboard SE", cursive;
          }
        `}</style>
        <GlobalStyle />
        <SWRConfig
          value={{
            fetcher: (resource, init) =>
              fetch(resource, init).then((res) => res.json()),
          }}
        >
          <Header />
          <Main>
            <Component {...pageProps} />
          </Main>
          <Footer />
          <ScrollToTop />
        </SWRConfig>
      </ThemeProvider>
    </SessionProvider>
  );
}

// 2. Export mit appWithTranslation umschließen
export default appWithTranslation(App);