import { getMessages } from "next-intl/server";
import { DM_Sans, Playfair_Display, Sedgwick_Ave_Display } from "next/font/google";

import ThemeWrapper from "@/components/pageStructure/ThemeWrapper";
import StyledComponentsRegistry from "@/lib/StyledComponentsRegistry";
import Providers from "./Providers";
import Header from "@/components/pageStructure/Header/Header";
import Main from "@/components/pageStructure/Main/Main";
import Footer from "@/components/pageStructure/Footer/Footer";

const sedgwick = Sedgwick_Ave_Display({ weight: "400", subsets: ["latin"], variable: "--font-club" });
const dmSans = DM_Sans({ weight: ["400", "500", "700"], subsets: ["latin"], variable: "--font-text" });
const playfair = Playfair_Display({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-heading" });

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${sedgwick.variable} ${dmSans.variable} ${playfair.variable}`}>
      <body>
        <StyledComponentsRegistry>
        <ThemeWrapper>
          <Providers messages={messages} locale={locale}>
            <Header />
            <Main>{children}</Main>
            <Footer />
          </Providers>
        </ThemeWrapper>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
