// 1. Wir definieren einen Typ für das Theme, damit TS genau weiß, was existiert
export type ThemeType = typeof theme;

export const theme = {
  colors: {
    brand: {
      petrolLight: "var(--color-petrol-light)",
      petrol: "var(--color-petrol)",
      petrolDark: "var(--color-petrol-darker)",
      green: "var(--color-green)",
      greenLight: "#8dbd5b",
      lime: "var(--color-lime)",
      orange: "var(--color-zoo-orange)",
      marine: "var(--color-marine)",
    },
    ui: {
      bodyBg: "var(--color-blue-light)",
      surface: "var(--color-white)",
      glass: "var(--color-grey)",
      border: "var(--color-green-lighter)",
      text: "var(--color-petrol-green-dark)",
      header: "var(--color-header)",
      filterHover: "var(--color-lime)",
    },
  },

  fonts: {
    club: "var(--font-club)", // Sedgwick Ave Display
    heading: "var(--font-heading)", // Playfair Display
    comic: "var(--font-comic)", // Comic Sans
    text: "var(--font-text)", // DM Sans
  },

  breakpoints: {
    mobile: "768px",
    tablet: "1024px",
    desktop: "1200px",
  },

  borderRadius: "var(--border-radius)",

  shadows: {
    soft: "var(--shadow-soft)",
    text: "var(--shadow-footer-text)",
  },
};