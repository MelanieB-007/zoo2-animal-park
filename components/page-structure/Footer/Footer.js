import styled from "styled-components";

export default function Footer() {
    return (
        <StyledFooter>
            <div className="footer-content">
                <p>© 2026 - Klub der tollen Tiere | <a href="#">Impressum</a></p>
            </div>
        </StyledFooter>
    );
}

const StyledFooter = styled.footer`
  position: relative;
  flex-shrink: 0;
  overflow: visible;
  padding: 1rem 0;
  margin: 10px auto;
  width: 100%;
  max-width: var(--width-page);
  min-height: 70px;
  z-index: 1;
  text-align: center;

  background-image: linear-gradient(135deg, var(--zoo-orange) 0%, var(--red-orange) 50%, var(--color-green) 100%);
  backdrop-filter: var(--glass-blur);
  border: var(--glass-border);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-soft);

  /* Die grüne Trennlinie */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 80%;
    height: 2px;
    background: var(--color-footer-bg-before);
    box-shadow: 0 4px 16px var(--khaki-green);
  }

  p {
    margin: 0.5rem 0;
    font-size: 0.875rem;
    color: var(--color-white);
    font-weight: 500;
    text-shadow: var(--shadow-footer-text), var(--shadow-footer-text-glow);
  }

  a {
    color: var(--color-white);
    text-decoration: none;
    border-bottom: 1px solid var(--color-footer-hover);
    transition: all 0.3s ease;
    &:hover {
      color: var(--zoo-orange);
      text-shadow: 0 0 8px var(--zoo-orange);
    }
  }

  @media (max-width: 768px) {
    padding: 1rem;
    height: auto;
    p {
      font-size: 0.8rem;
      text-shadow: var(--shadow-footer-text-mobile);
    }
  }
`;