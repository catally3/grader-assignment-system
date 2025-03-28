import React, { useState } from "react";
import styled from "@emotion/styled";
import Modal, { ModalContainer } from "../Common/Modal";
import FileUpload from "../Common/FileUpload";
import ModalHeader from "../Common/ModalHeader";
import Button from "../Common/Button";

const tabs = ["Course List", "Candidate List", "Resume"];

const FileUploadModal = ({ open, onClose }) => {
  const [activeTab, setActiveTab] = useState("Course List");

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  const handleClose = () => {
    console.log("Modal closed");
    // Implementation for closing the modal would go here
  };

  const handleCancel = () => {
    console.log("Upload cancelled");
    // Implementation for cancel action would go here
  };

  const handleAssign = () => {
    console.log("Files assigned");
    // Implementation for assign action would go here
  };

  return (
    <Modal open={open} onClose={onClose}>
      <ModalContainer>
        <ModalContent>
          <ModalHeader title="Upload files" onClose={onClose} />
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
          <FileUpload />
        </ModalContent>
        <ButtonContainer>
          <Button
            backgroundColor={"white"}
            TextColor={"rgba(248, 126, 3, 1)"}
            Text={"Cancel"}
            onClick={handleCancel}
          />
          <Button
            backgroundColor={"rgba(248, 126, 3, 1)"}
            TextColor={"white"}
            Text={"Assign"}
            onClick={handleAssign}
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

const TabItem = styled.button`
  border-bottom: ${(props) =>
    props.isActive ? "1px solid #f87e03" : "1px solid #ffffff"};
  color: ${(props) => (props.isActive ? "#f87e03" : "#6f727a")};
  font-size: 16px;
  font-weight: 700;
  width: 180px;
  /* width: ${(props) => {
    if (props.children === "Candidate List") return "146px";
    return "180px";
  }}; */
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
  background-color: #f7f7f9;
  width: calc(100% + 80px);
  margin: 20px 0 -30px -40px;
`;

export default FileUploadModal;
