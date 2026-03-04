import styled from "styled-components";
import Link from "next/link";
import { IoChevronDown } from "react-icons/io5"; // Brauchst du: npm install react-icons

export default function Navigation() {
    return (
        <NavContainer>
            <NavList>
                <NavItem>
                    <NavLink href="/">Home</NavLink>
                </NavItem>

                <NavItem>
                    <NavButton>
                        Zoo <IoChevronDown className="arrow" />
                    </NavButton>
                    <Dropdown>
                        <li><DropdownLink href="/zoo/gebiete">Zoo Gebiete</DropdownLink></li>
                        <li><DropdownLink href="/zoo/gehege">Zoo Gehege</DropdownLink></li>
                    </Dropdown>
                </NavItem>

                <NavItem>
                    <NavButton>
                        Tiere <IoChevronDown className="arrow" />
                    </NavButton>
                    <Dropdown>
                        <li><DropdownLink href="/tiere">Tierübersicht</DropdownLink></li>
                        <li><DropdownLink href="/tiere/anlegen">Tier anlegen</DropdownLink></li>
                        <li><DropdownLink href="/tiere/farbvarianten">Farbvarianten</DropdownLink></li>
                    </Dropdown>
                </NavItem>

                <NavItem>
                    <NavButton>
                        Klub <IoChevronDown className="arrow" />
                    </NavButton>
                    <Dropdown>
                        <li><DropdownLink href="/klub/mitglieder">Mitglieder</DropdownLink></li>
                        <li><DropdownLink href="/klub/wettbewerbe">Wettbewerbe</DropdownLink></li>
                    </Dropdown>
                </NavItem>
            </NavList>
        </NavContainer>
    );
}

// --- Styles unten (wie besprochen) ---

const NavContainer = styled.nav`
  display: flex;
  align-items: center;
  @media (max-width: 767px) {
    display: none; // Wir bauen später ein separates Mobile-Menü
  }
`;

const NavList = styled.ul`
  display: flex;
  list-style: none;
  gap: 1.5rem;
  margin: 0;
  padding: 0;
`;

const NavItem = styled.li`
  position: relative;
  
  /* Das Dropdown erscheint beim Hover über das NavItem */
  &:hover > ul {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }

  &:hover .arrow {
    transform: rotate(180deg);
  }
`;

// Vereinheitlichte Komponente für alle Nav-Elemente
const NavElementStyles = `
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  /* Festgelegte Höhe für alle Elemente verhindert das Springen */
  height: 38px; 
  padding: 0 1rem;
  
  background: var(--color-header-button-bg);
  border: var(--border-header-button);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-header-button);
  
  color: #68B300;
  font-weight: 800;
  text-decoration: none;
  white-space: nowrap;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: var(--shadow-header-button-hover);
  }
`;

const NavLink = styled(Link)`${NavElementStyles}`;
const NavButton = styled.div`${NavElementStyles}`;

const Dropdown = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 180px;

  /* Nutzt deine Variablen für den Glass-Look */
  background: var(--color-header-bg);
  backdrop-filter: var(--glass-blur);
  border: var(--glass-border);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-soft);

  list-style: none;
  padding: 0.5rem 0;
  margin-top: 5px;

  /* Sicherstellen, dass das Dropdown selbst auch ganz oben liegt */
  z-index: 2002;

  opacity: 0;
  visibility: hidden;
  transform: translateY(10px);
  transition: all 0.3s ease;
`;

const DropdownLink = styled(Link)`
  display: block;
  padding: 10px 20px;
  color: var(--color-petrol);
  text-decoration: none;
  font-size: 0.9rem;
  font-family: var(--font-text);
  
  &:hover {
    background: #f5f5f5;
    color: var(--color-green);
  }
`;