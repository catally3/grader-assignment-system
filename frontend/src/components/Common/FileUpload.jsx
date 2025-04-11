import React, { useState, useRef } from "react";
import styled from "@emotion/styled";
import DocIcon from "../../assets/icons/icon_documents.svg";

const FileUpload = ({
  activeTab,
  onFilesChange,
  uploadedFiles,
  onClose,
  singleUpload,
}) => {
  const [isDragging, setIsDragging] = useState(false);
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
    e.target.value = null;
  };

  const handleRemoveFile = (tab, fileNameToRemove) => {
    const newFiles = uploadedFiles[tab].filter(
      (f) => f.name !== fileNameToRemove
    );
    onFilesChange(tab, newFiles);
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
      const isDuplicate = uploadedFiles[activeTab]?.some(
        (f) => f.name === file.name
      );
      if (isDuplicate) {
        alert(`${file.name} is already added in ${activeTab}`);
        continue;
      }
      validFiles.push(file);
    }
    if (validFiles.length > 0) {
      const updatedFiles = [...(uploadedFiles[activeTab] || []), ...validFiles];
      onFilesChange(activeTab, updatedFiles);
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div>
      {singleUpload ? (
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
      ) : (
        <>
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

          <FileList>
            {(uploadedFiles[activeTab] || []).map((file, idx) => (
              <ProgressFileItem key={idx}>
                <ProgressBarContainer>
                  <ProgressBar style={{ width: "100%" }} />
                </ProgressBarContainer>
                <FileName>{file.name}</FileName>
                <RemoveButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile(activeTab, file.name);
                  }}
                >
                  ×
                </RemoveButton>
              </ProgressFileItem>
            ))}
          </FileList>

          {Object.entries(uploadedFiles).map(([category, files]) => (
            <div key={category}>
              <CategoryTitle>{category}</CategoryTitle>
              <FileList>
                {files.map((file, idx) => (
                  <ProgressFileItem key={idx}>
                    <FileName>{file.name}</FileName>
                    <RemoveButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFile(category, file.name);
                      }}
                    >
                      ×
                    </RemoveButton>
                  </ProgressFileItem>
                ))}
              </FileList>
            </div>
          ))}
        </>
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

const SectionTitle = styled.h4`
  margin-top: 24px;
  font-size: 15px;
  font-weight: 700;
  color: #f87e03;
`;

const CategoryTitle = styled.h5`
  margin-top: 16px;
  font-size: 14px;
  font-weight: 600;
  color: #333;
`;

const FileList = styled.div`
  margin-top: 8px;
`;

const FileName = styled.p`
  color: #b2b2b2;
  font-size: small;
  font-weight: 500;
`;

const ProgressFileItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
`;

const ProgressBarContainer = styled.div`
  flex: 1;
  height: 8px;
  background: #eee;
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressBar = styled.div`
  height: 100%;
  background-color: #f87e03;
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
