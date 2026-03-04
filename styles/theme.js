// styles/theme.js

export const theme = {
    colors: {
        // Deine Hauptfarben
        primary: "var(--color-green)",      // #68B300
        secondary: "var(--color-petrol)",   // #0e7a4a
        accent: "var(--zoo-orange)",        // #FF8C00
        warning: "var(--red-orange)",       // #ff6b35

        // Backgrounds
        mainBg: "var(--color-main-bg)",     // #DAE67F
        white: "var(--color-white)",
        glass: "rgba(255, 255, 255, 0.3)",

        // Quiz/Wettbewerb Farben
        coins: "#FBE378",
        diamonds: "#87CEEB",
    },

    fonts: {
        club: "var(--font-club)",    // Sedgwick Ave Display
        heading: "var(--font-heading)", // Playfair Display
        comic: "var(--font-comic)",     // Comic Sans
        text: "var(--font-text)",       // DM Sans
    },

    breakpoints: {
        mobile: "768px",
        desktop: "1200px",
    },

    borderRadius: "var(--border-radius)", // 20px
    shadows: {
        soft: "var(--shadow-soft)",
        text: "var(--shadow-footer-text)",
    }
};