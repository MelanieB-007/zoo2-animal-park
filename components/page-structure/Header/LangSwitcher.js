import styled from "styled-components";
import {IoChevronDown} from "react-icons/io5";

export default function LangSwitcher() {
    return (
        <LangSwitcherContainer>
            <CurrentLanguage>
                <span className="fi fi-de"></span>
                <StyledChevron />
            </CurrentLanguage>

            <LangDropdown>
                <LangOption>
                    <span className="fi fi-de"></span> DE
                </LangOption>
                <LangOption>
                    <span className="fi fi-dk"></span> DK
                </LangOption>
                <LangOption>
                    <span className="fi fi-gb"></span> EN
                </LangOption>
            </LangDropdown>
        </LangSwitcherContainer>
    );
}


const LangDropdown = styled.div`
  position: absolute;
  top: 110%;
  right: 0;
  background: white;
  border-radius: 10px;
  padding: 5px;
  box-shadow: var(--shadow-soft);
  min-width: 80px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(10px);
  transition: all 0.3s ease;
  z-index: 3000;
`;

const LangSwitcherContainer = styled.div`
  position: relative;
  cursor: pointer;
  
  &:hover ${LangDropdown} {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
`;

const CurrentLanguage = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: background 0.3s;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const LangOption = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  color: var(--color-petrol);
  font-size: 0.8rem;
  font-weight: bold;
  border-radius: 5px;
  &:hover {
    background: #f0f0f0;
    color: var(--color-green);
  }
`;

const StyledChevron = styled(IoChevronDown)`
  width: 14px;
  height: 14px;
`;