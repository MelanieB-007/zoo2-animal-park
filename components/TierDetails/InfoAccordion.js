import styled from "styled-components";
import { useState } from "react";
import NextImage from "next/image";

export default function InfoAccordion({ title, icon, children, defaultOpen = false }){
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <AccordionWrapper>
      <AccordionHeader
        onClick={() => setIsOpen(!isOpen)}
      >
        <HeaderIcon>
          <NextImage
          src={icon}
          alt={title || "Accordion Icon"}
          width={30}
          height={30}
          />
        </HeaderIcon>
        {title}
        <Chevron $isOpen={isOpen}>▼</Chevron>
      </AccordionHeader>
      <AccordionBody $isOpen={isOpen}>
        {children}
      </AccordionBody>
    </AccordionWrapper>
  );
}


const AccordionWrapper = styled.div`
  margin-bottom: 12px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  background: var(--color-white);
  border: 1px solid var(--color-white-border);
`;

const AccordionHeader = styled.button`
  width: 100%;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  background: var(--color-white);
  border: none;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
  color: var(--color-green-label);
  transition: background 0.2s;

  &:hover {
    background: #f9f9f9;
  }
`;

const HeaderIcon = styled.span`
  margin-right: 12px;
  font-size: 1.2rem;
`;

const Chevron = styled.span.withConfig({
  // Diese Zeile sorgt dafür, dass $isOpen NICHT ans HTML weitergereicht wird
  shouldForwardProp: (prop) => prop !== '$isOpen',
})`
  margin-left: auto;
  display: inline-block;
  transition: transform 0.3s ease;
  transform: ${(props) => (props.$isOpen ? "rotate(180deg)" : "rotate(0deg)")};
  color: var(--color-grey-lighter);
  font-size: 0.8rem;
  line-height: 1;
  pointer-events: none;
`;

const AccordionBody = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== '$isOpen',
})`
  padding: ${(props) => (props.$isOpen ? "16px" : "0 16px")};
  max-height: ${(props) => (props.$isOpen ? "1000px" : "0")}; /* 1000px ist sicherer für viel Inhalt */
  overflow: hidden;
  transition: all 0.3s ease-in-out;
  border-top: ${(props) => (props.$isOpen ? "1px solid #eee" : "none")};
`;