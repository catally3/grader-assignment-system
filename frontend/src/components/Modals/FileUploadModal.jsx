import React, { useState } from "react";
import styled from "@emotion/styled";
import Modal, { ModalContainer } from "../Common/Modal";
import FileUpload from "../Common/FileUpload";
import ModalHeader from "../Common/ModalHeader";

import Button from "../Common/Button";
import Input from "../../components/Common/Input";
import SelectBox from "../../components/Common/SelectBox";

import ArrowIcon from "../../assets/icons/icon_arrow.svg";

const tabs = ["Course List", "Candidate List", "Resume"];

const FileUploadModal = ({
  open,
  onClose,
  title,
  inputValue,
  setInputValue,
}) => {
  const [activeTab, setActiveTab] = useState("Course List");
  const [uploadedFiles, setUploadedFiles] = useState({
    "Course List": [],
    "Candidate List": [],
    Resume: [],
  });

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  const handleFilesChange = (tab, files) => {
    setUploadedFiles((prev) => ({ ...prev, [tab]: files }));
  };

  const handleAssign = () => {
    console.log("Files assigned");
  };

  const onCloseFileUpload = () => {
    setUploadedFiles({});
    onClose();
  };

  const handleAddCourseMode = () => {};

  const handleSubmit = () => {
    alert("assignments are created");
    localStorage.setItem("assignments", true);
    onClose();
  };

  return (
    <Modal open={open} onClose={onCloseFileUpload}>
      <ModalContainer>
        <ModalContent>
          <ModalHeader
            title={title ? title : "Upload files"}
            onClose={onCloseFileUpload}
          />
          <TabContainer>
            <TabList>
              {tabs.map((tab) => (
                <TabItem
                  key={tab}
                  isActive={activeTab === tab}
                  onClick={() => handleTabChange(tab)}
                >
                  {tab}
                </TabItem>
              ))}
            </TabList>
          </TabContainer>
          <FileUpload
            activeTab={activeTab}
            onFilesChange={handleFilesChange}
            uploadedFiles={uploadedFiles}
            onClose={onClose}
            singleUpload={false}
          />
        </ModalContent>
        <ButtonContainer>
          <Button
            backgroundColor={"white"}
            TextColor={"rgba(248, 126, 3, 1)"}
            Text={"Cancel"}
            onClick={onClose}
          />
          <Button
            backgroundColor={"rgba(248, 126, 3, 1)"}
            TextColor={"white"}
            Text={"Assign"}
            onClick={handleSubmit}
          />
        </ButtonContainer>
      </ModalContainer>
    </Modal>
  );
};

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 420px;
`;

const TabContainer = styled.nav`
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  border-width: 1px;
`;

const TabList = styled.div`
  display: flex;
  position: relative;
`;

const SingleTabItem = styled.button`
  display: flex;
  width: 100%;
  color: #f87e03;
  width: 180px;

  padding-top: 10px;

  font-size: Small;
  font-weight: 700;
  text-align: center;
`;

const TabItem = styled.button`
  border-bottom: ${(props) =>
    props.isActive ? "1px solid #f87e03" : "1px solid #ffffff"};
  color: ${(props) => (props.isActive ? "#f87e03" : "#6f727a")};
  font-size: Small;
  font-weight: 700;

  width: 180px;
  padding: 10px 16px;

  text-align: center;
  cursor: pointer;
  ${(props) =>
    props.isActive &&
    `
    border-width: 2px;
    border-color: #f87e03;
  `}
`;

const ButtonContainer = styled.footer`
  display: flex;
  padding: 16px 40px;
  justify-content: flex-end;
  align-items: center;
  gap: 24px;
  background-color: rgb(249, 247, 247);
  width: calc(100% + 80px);
  margin: 20px 0 -30px -40px;

  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
`;

const InputWrapper = styled.div`
  max-width: 100%;
`;

const Icon = styled.img`
  width: 16px;
  height: 16px;

  margin-left: 8px;
`;

const AddCourseWrap = styled.div`
  margin-left: 14px;
`;

export default FileUploadModal;
