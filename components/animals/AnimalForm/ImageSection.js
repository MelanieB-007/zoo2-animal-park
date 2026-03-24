import React, { useState } from "react";
import styled from "styled-components";
import { useTranslation } from "next-i18next";
import { Upload, Trash2 } from "lucide-react";
import Image from 'next/image';

import InfoAccordion from "../../page-structure/Elements/InfoAccordion";


export default function ImageSection({ setUploadFiles, initialImage }) {
  const { t } = /** @type {any} */ (useTranslation(["animals", "common"]));
  const [preview, setPreview] = useState(initialImage ? `/images/animals/images/${initialImage}` : null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Wir speichern die eine Datei für beide Zwecke
    setUploadFiles(prev => ({ ...prev, animalImage: file }));

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const clearFile = () => {
    setUploadFiles(prev => ({ ...prev, animalImage: null }));
    setPreview(null);
  };

  return (
    <InfoAccordion
      title={t("animals:imageSection.image_title") || "Tierfoto"}
      icon="/images/icons/foto.png"
      defaultOpen={true}
    >
      <MainWrapper>
        <UploadZone>
          <HiddenInput
            type="file"
            id="animal-upload"
            accept="image/*"
            onChange={handleFileChange}
          />
          <UploadLabel htmlFor="animal-upload">
            <Upload size={20} />
            {preview
              ? t("animals:imageSection.image_replace_btn")
              : t("animals:imageSection.image_upload_btn")}
          </UploadLabel>
          {preview && (
            <DeleteButton onClick={clearFile} type="button">
              <Trash2 size={16} /> {t("animals:imageSection.image_delete")}
            </DeleteButton>
          )}
        </UploadZone>

        <PreviewGrid>
          {/* Vorschau 1: Das runde Icon (wie im Shop/Gehege-Info) */}
          <PreviewColumn>
            <LabelText>{t("animals:imageSection.preview_icon")}</LabelText>
            <IconCircle>
              {preview ? (
                <Image src={preview} alt="Icon" />
              ) : (
                <Upload size={24} opacity={0.3} />
              )}
            </IconCircle>
          </PreviewColumn>

          {/* Vorschau 2: Das große Bild (Detailansicht) */}
          <PreviewColumn>
            <LabelText>
              {t("animals:imageSection.preview_detail")}
            </LabelText>
            <BigPreview>
              {preview ? (
                <Image src={preview} alt="Detail" />
              ) : (
                <Upload size={32} opacity={0.3} />
              )}
            </BigPreview>
          </PreviewColumn>
        </PreviewGrid>
      </MainWrapper>
    </InfoAccordion>
  );
}


const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 10px 0;
`;

const UploadZone = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const PreviewGrid = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 30px;
  align-items: flex-end;

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

const PreviewColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const LabelText = styled.span`
  font-size: 0.75rem;
  font-weight: 700;
  color: #88a04d;
  text-transform: uppercase;
`;

const PreviewBase = styled.div`
  background: #fdfdfd;
  border: 2px solid #eef3e2;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const IconCircle = styled(PreviewBase)`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border-color: #d1e2a5;
`;

const BigPreview = styled(PreviewBase)`
  width: 100%;
  height: 140px;
  border-radius: 12px;
`;

const HiddenInput = styled.input`
  display: none;
`;

const UploadLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #5d7a2a;
  color: var(--color-white);
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover { background: #4a6221; }
`;

const DeleteButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: 1px solid #e74c3c;
  color: #e74c3c;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  
  &:hover { background: #fdf2f2; }
`;