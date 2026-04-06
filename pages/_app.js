import { SessionProvider } from "next-auth/react";
import { SWRConfig } from "swr";
import { appWithTranslation } from 'next-i18next';
import { ToastContainer } from "react-toastify";

import { ThemeProvider } from "styled-components";
import GlobalStyle from "../src/styles/GlobalStyles";
import { theme } from "../src/styles/theme";
import "flag-icons/css/flag-icons.min.css";

import Header from "../src/components/pageStructure/Header/Header";
import Main from "../src/components/pageStructure/Main/Main";
import Footer from "../src/components/pageStructure/Footer/Footer";
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
            <ToastContainer
              position="top-right"
              autoClose={3000}
              theme="colored"
              style={{ zIndex: 99999 }}
            />
          </Main>
          <Footer />
          <ScrollToTop />
        </SWRConfig>
      </ThemeProvider>
    </SessionProvider>
  );
}


export default appWithTranslation(App);