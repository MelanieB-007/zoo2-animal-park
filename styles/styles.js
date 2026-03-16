import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`

  :root {
    --width-page: 1200px;
    --glass-blur: blur(10px);
    --border-radius: 20px;

    --glass-border: 2pt solid var(--color-glass-border);

    --colo1: #086910;
    --colo2: #f49200;
    --colo3: #ebf3ce;
    --colo4: #c4f3fb;
    
    --color-white: #ffffff;
    --color-yellow-light: #DAE67F;
    --color-yellow: #FBE378;
    --color-blue-light: #c4f3fb;
    --color-sky-blue: #87CEEB;
    --color-earth-brown: #8B4513;
    --color-header: #ffaf4a;
    --color-orange-light: rgba(255, 165, 0, 1);
    --color-zoo-orange: #FF8C00;
    --color-orange-dark: rgba(255, 140, 0, 0.5);
    --color-orange-dark-shadow: rgba(255, 140, 0, 0.3);
    --color-red-orange: #ff6b35;
    --color-lime: #d6efc0; //for PageWrapper
    --color-green: #68B300;
    --color-green-darker: rgba(104, 179, 0, 0.7);
    --color-khaki-green: rgba(104, 179, 0, 0.25);
    --color-petrol: #0e7a4a;
    --color-petrol-dark: #056d42;
    --color-petrol-darker: #004d4d;
    --color-grey-light: rgba(255, 255, 255, 0.4);
    --color-grey: rgba(255, 255, 255, 0.3);
    --color-grey-0-25: rgba(255, 255, 255, 0.25);
    --color-grey-0-2: rgba(255, 255, 255, 0.2);
    --color-grey-0-1: rgba(255, 255, 255, 0.1);
    --color-grey-dark: #2f3542;
    --color-black: rgba(0, 0, 0, 0.2);

    --border-header-button: 1px solid var(--color-orange-dark);

    --shadow-soft: 0 8px 32px var(--color-black);
    --shadow-footer-text: 1px 1px 0 var(--color-petrol);
    --shadow-footer-text-glow: 0 0 6px var(--color-green-darker);
    --shadow-footer-text-mobile: 0.8px 0.8px 0 var(--color-petrol);
    --shadow-header-button: 0 2px 8px var(--color-orange-dark-shadow);
    --shadow-header-button-hover: 0 4px 12px var(--color-orange-dark);
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

  html, body {
    overflow-x: hidden; 
    width: 100%;
  }
  
  body {
    margin: 0;
    padding: 0;
    min-height: 100vh;
    
    background-color: var(--color-blue-light);
    
    background-attachment: fixed;
    font-family: var(--font-text), sans-serif;
  }

  #__next {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    align-items: center;
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
    text-shadow: 2px 2px 0 var(--color-white);
  }

  .page-title {
    /* Seitentitel: Comic Sans / Chalkboard */
    font-family: var(--font-comic);
    font-size: 1.8rem;
  }
`;