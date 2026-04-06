"use client";

import styled from "styled-components";
import { ReactNode } from "react";

interface PageWrapperProps {
  children: ReactNode;
}

export default function PageWrapper({ children }: PageWrapperProps) {
  return <StyledPageWrapper>{children}</StyledPageWrapper>;
}

const StyledPageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: auto;
  margin-bottom: 10px;
  padding: 20px 20px;
  background-color: var(--color-lime);
  border: 2px solid var(--color-petrol-darker);
  border-radius: var(--border-radius);

  @media (min-width: 768px) {
    padding: 40px;
  }
`;