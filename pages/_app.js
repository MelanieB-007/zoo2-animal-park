import { SessionProvider } from "next-auth/react";
import { SWRConfig } from "swr";
import { appWithTranslation } from 'next-i18next';

import { ThemeProvider } from "styled-components";
import GlobalStyle from "../styles/styles";
import { theme } from "../styles/theme";
import "flag-icons/css/flag-icons.min.css";

import Header from "../components/page-structure/Header/Header";
import Main from "../components/page-structure/Main/Main";
import Footer from "../components/page-structure/Footer/Footer";
import ScrollToTop from "../components/ui/ScrollToTop";


export function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider theme={theme}>
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


export default appWithTranslation(App);