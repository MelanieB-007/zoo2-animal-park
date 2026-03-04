import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`

  :root {
    --width-page: 1200px;
    --glass-blur: blur(10px);
    --border-radius: 20px;
    
    --glass-border: 2pt solid var(--color-glass-border);
    
    --color-white: #ffffff;
    --color-main-bg: #DAE67F;
    --primary-yellow: #FBE378;
    --sky-blue: #87CEEB;
    --earth-brown: #8B4513;
    --zoo-orange: #FF8C00;
    --red-orange: #ff6b35;
    --color-footer-bg-before: #56a500;
    --color-green: #68B300;
    --color-footer-text-glow: rgba(104, 179, 0, 0.7);
    --khaki-green: rgba(104, 179, 0, 0.25);
    --color-petrol: #0e7a4a;

    --color-shadow-soft: rgba(0, 0, 0, 0.12);
    --color-glass-border: rgba(255, 255, 255, 0.3);
    --color-footer-hover: rgba(255,255,255,0.4);

    --shadow-soft: 0 8px 32px var(--color-shadow-soft);
    --shadow-footer-text: 1px 1px 0 var(--color-petrol);
    --shadow-footer-text-glow: 0 0 6px var(--color-footer-text-glow);
    --shadow-footer-text-mobile: 0.8px 0.8px 0 var(--color-petrol);

  }

  @media (max-width: 1200px) {
    :root {
      --width-page: 100%;
    }
  }
  
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 0;
    min-height: 100vh;
    background: linear-gradient(to bottom, var(--sky-blue) 0%, var(--primary-yellow) 70%, var(--earth-brown) 100%);
    background-attachment: fixed;
    font-family: var(--font-text), sans-serif;
  }

  /* Der Next.js Wrapper */
  #__next {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    align-items: center; // Zentriert den Content
  }

  h1 {
    /* Seitenheader h1: Playfair Display */
    font-family: var(--font-heading), serif;
    font-size: 2.5rem;
    color: var(--color-petrol);
  }

  .club-title {
    /* Homepage Titel: Sedgwick Ave Display */
    font-family: var(--font-club);
    font-size: 3rem;
    color: var(--zoo-orange);
    text-shadow: 2px 2px 0px var(--color-white);
  }

  .page-title {
    /* Seitentitel: Comic Sans / Chalkboard */
    font-family: var(--font-comic);
    font-size: 1.8rem;
  }
`;
