import React, { useState, useRef } from "react";
import styled from "@emotion/styled";
import DocIcon from "../../assets/icons/icon_documents.svg";

const FileUpload = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState([]);
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
      handleFile(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(Array.from(e.target.files));
    }
  };

  const handleRemoveFile = (fileNameToRemove) => {
    setFiles((prev) => prev.filter((f) => f.name !== fileNameToRemove));
  };

  const handleFile = (newFiles) => {
    const validFiles = [];

    for (let file of newFiles) {
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} exceeds 5MB limit`);
        continue;
      }

      const fileExtension = file.name.split(".").pop().toLowerCase();
      if (fileExtension !== "xlsx") {
        alert(`${file.name} is not an xlsx file`);
        continue;
      }

      // check duplicate
      const isDuplicate = files.some((f) => f.name === file.name);
      if (isDuplicate) {
        alert(`${file.name} is already added`);
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      setFiles((prev) => [...prev, ...validFiles]);
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div>
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
          multiple
          style={{ display: "none" }}
        />
        <DocumentIcon src={DocIcon} />
        <UploadText>
          <UploadLink>Upload a file</UploadLink>
          <UploadInstruction>or drag and drop</UploadInstruction>
        </UploadText>
        <FileTypeInfo>xlsx, up to 5MB</FileTypeInfo>
      </UploadContainer>
      {files.length > 0 && (
        <FileList>
          {files.map((file, idx) => (
            <FileItem key={idx}>
              <FileName>{file.name}</FileName>
              <RemoveButton
                onClick={(e) => {
                  e.stopPropagation(); // 부모 클릭 이벤트 방지
                  handleRemoveFile(file.name);
                }}
              >
                ×
              </RemoveButton>
            </FileItem>
          ))}
        </FileList>
      )}
    </div>
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

const FileList = styled.div`
  margin-top: 16px;
`;

const FileName = styled.p`
  color: #333;
  font-size: small;
  font-weight: 500;
`;

const FileItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #ccc;
  padding: 6px 12px;
  border-radius: 8px;
  margin-bottom: 4px;
  background-color: #f9f9f9;
`;

const RemoveButton = styled.button`
  border: none;
  background: none;
  color: #ff3b30;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  padding: 0;
  line-height: 1;
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
