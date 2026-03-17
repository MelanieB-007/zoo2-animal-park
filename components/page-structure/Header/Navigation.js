import styled from "styled-components";
import Link from "next/link";
import { IoChevronDown } from "react-icons/io5";
import {usePathname} from "next/navigation";
import { useTranslation } from "next-i18next";

export default function Navigation() {
  const { t } = useTranslation('navigation');

  const pathname = usePathname();

  const isActive = (path) =>
    pathname === path || pathname.startsWith(path + "/");

  return (
    <NavContainer>
      <NavList>
        <NavItem>
          <NavLink href="/" $active={pathname === "/"}>
            Home
          </NavLink>
        </NavItem>

        <NavItem>
          <NavButton $active={isActive("/zoo")}>
            {t('zoo')} <IoChevronDown className="arrow" />
          </NavButton>
          <Dropdown>
            <li>
              <DropdownLink
                href="/zoo/gebiete"
                $active={pathname === "/zoo"}
              >
                {t('zoo_areas')}
              </DropdownLink>
            </li>
            <li>
              <DropdownLink
                href="/zoo/gehege"
                $active={pathname === "/zoo"}
              >
                {t('zoo_biomes')}
              </DropdownLink>
            </li>
          </Dropdown>
        </NavItem>

        <NavItem>
          <NavButton $active={pathname === "/tiere"}>
            {t('animals')} <IoChevronDown className="arrow" />
          </NavButton>
          <Dropdown>
            <li>
              <DropdownLink href="/tiere" $active={pathname === "/tiere"}>
                {t('animal_overview')}
              </DropdownLink>
            </li>
            <li>
              <DropdownLink
                href="/tiere/anlegen"
                $active={pathname === "/tiere"}
              >
                {t('create_animal')}
              </DropdownLink>
            </li>
            <li>
              <DropdownLink
                href="/tiere/farbvarianten"
                $active={pathname === "/tiere"}
              >
                {t('colorVariants')}
              </DropdownLink>
            </li>
          </Dropdown>
        </NavItem>

        <NavItem>
          <NavButton $active={pathname === "/klub"}>
            {t('club')} <IoChevronDown className="arrow" />
          </NavButton>
          <Dropdown>
            <li>
              <DropdownLink
                href="/klub/mitglieder"
                $active={pathname === "/klub"}
              >
                {t('members')}
              </DropdownLink>
            </li>
            <li>
              <DropdownLink
                href="/klub/wettbewerbe"
                $active={pathname === "/klub"}
              >
                {t('contest')}
              </DropdownLink>
            </li>
          </Dropdown>
        </NavItem>
      </NavList>
    </NavContainer>
  );
}

const NavContainer = styled.nav`
  display: flex;
  align-items: center;

  @media (max-width: 767px) {
    display: none;
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

  &:hover > ul {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }

  &:hover .arrow {
    transform: rotate(180deg);
  }
`;

const NavElementStyles = `
  position: relative; 
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 38px; 
  padding: 0 1.2rem; 
  
  background: var(--color-grey);
  border: var(--border-header-button);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-header-button);
  
  color: var(--color-green);
  font-weight: 800;
  text-decoration: none;
  white-space: nowrap;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: var(--shadow-header-button-hover);
    background: var(--color-orange-light); /* Ein schöner Hover-Effekt */
  }
`;

const NavLink = styled(Link)`
  ${NavElementStyles}; /* <- Wichtig: Semikolon hier! */
  
  color: ${props =>
  props.$active ? 'var(--color-zoo-orange)' : 'var(--color-green)'};

  &::before {
    content: '🐾';
    position: absolute;
    top: -15px;
    left: 50%;
    transform: translateX(-50%);
    display: ${props => (props.$active ? 'block' : 'none')};
    font-size: 0.8rem;
    filter: drop-shadow(1px 1px 0 var(--color-black));
  }
`;

const NavButton = styled.div`
  ${NavElementStyles}; /* <- Hier das Semikolon ergänzen */
  color: ${props => props.$active ? 'var(--color-zoo-orange)' : 'var(--color-green)'};
  cursor: pointer;
  &::before {
    content: '🐾';
    position: absolute;
    top: -15px;
    left: 50%;
    transform: translateX(-50%);
    display: ${props => (props.$active ? 'block' : 'none')};
    font-size: 0.8rem;
    filter: drop-shadow(1px 1px 0 var(--color-black));
  }
`;

const Dropdown = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 180px;

  background: var(--color-header);
  backdrop-filter: var(--glass-blur);
  border: var(--glass-border);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-soft);

  list-style: none;
  padding: 0.5rem 0;
  margin-top: 5px;

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
  background: ${props => props.$active ? 'rgba(0,0,0,0.05)' : 'transparent'};
  font-weight: ${props => props.$active ? '900' : '400'};
  border-left: ${props => props.$active ? '4px solid var(--color-green)' : '4px solid transparent'};

  &:hover {
    background: #f5f5f5;
    color: var(--color-green);
  }
`;