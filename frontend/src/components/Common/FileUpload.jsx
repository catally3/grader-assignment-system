import React, { useState, useRef } from "react";
import styled from "@emotion/styled";
import DocIcon from "../../assets/icons/icon_documents.svg";

const FileUpload = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    // Check file type and size
    if (file.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB limit");
      return;
    }

    const fileExtension = file.name.split(".").pop().toLowerCase();
    if (fileExtension !== "xlsx") {
      alert("Only xlsx files are allowed");
      return;
    }

    setFile(file);
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  return (
    <UploadContainer
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      isDragging={isDragging}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept=".xlsx"
        style={{ display: "none" }}
      />
      <DocumentIcon src={DocIcon} />
      <UploadText>
        <UploadLink>Upload a file</UploadLink>
        <UploadInstruction>or drag and drop</UploadInstruction>
      </UploadText>
      <FileTypeInfo>xlsx, up to 5MB</FileTypeInfo>
    </UploadContainer>
  );
};

const UploadContainer = styled.div`
  display: flex;
  padding: 20px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  border-radius: 15px;
  border: 2px dashed #bfbfbf;
  background-color: #fff;
  cursor: pointer;
  transition: border-color 0.2s ease;

  ${(props) =>
    props.isDragging &&
    `
    border-color: #f87e03;
    background-color: rgba(248, 126, 3, 0.05);
  `}
`;

const UploadText = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const UploadLink = styled.span`
  color: #f87e03;
  font-size: small;
  font-weight: 600;
  line-height: 24px;
`;

const UploadInstruction = styled.span`
  color: #585858;
  font-size: small;
  font-weight: 600;
  line-height: 24px;
`;

const FileTypeInfo = styled.p`
  color: #585858;
  text-align: center;
  font-family: Inter, sans-serif;
  font-size: small;
  font-weight: 400;
  line-height: 24px;
  margin: 0;
`;

const DocumentIcon = styled.img`
  aspect-ratio: 1;
  object-fit: contain;
  object-position: center;
  width: 36px;
  flex-shrink: 0;
  cursor: pointer;
`;

export default FileUpload;
