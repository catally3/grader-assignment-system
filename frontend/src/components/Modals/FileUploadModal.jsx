import React, { useState } from "react";
import styled from "@emotion/styled";
import Modal, { ModalContainer } from "../Common/Modal";
import FileUpload from "../Common/FileUpload";
import ModalHeader from "../Common/ModalHeader";

import Button from "../Common/Button";
import Input from "../../components/Common/Input";
import SelectBox from "../../components/Common/SelectBox";

const tabs = ["Course List", "Candidate List", "Resume"];

const FileUploadModal = ({
  open,
  onClose,
  handleSubmit,
  singleUpload,
  title,
  inputValue,
  setInputValue,
}) => {
  const [activeTab, setActiveTab] = useState("Course List");

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  const handleAssign = () => {
    console.log("Files assigned");
    // Implementation for assign action would go here
  };

  return (
    <Modal open={open} onClose={onClose}>
      <ModalContainer>
        <ModalContent>
          <ModalHeader
            title={title ? title : "Upload files"}
            onClose={onClose}
          />
          {singleUpload && (
            <InputWrapper>
              <SingleTabItem style={{ marginBottom: "16px" }}>
                Professor name
              </SingleTabItem>
              <SelectBox
                placeholder="Professor Name"
                width={"100%"}
                value={inputValue?.profname}
                onChange={(val) =>
                  setInputValue((prev) => ({ ...prev, profname: val }))
                }
                options={[
                  { id: "John", name: "John" },
                  { id: "Michael", name: "Micheal" },
                  { id: "Clover", name: "Clover" },
                ]}
              />
              {/* <Input
                placeholder={"Professor name"}
                inputValue={inputValue?.profname}
                onChange={(e) =>
                  setInputValue({ ...inputValue, profname: e.target.value })
                }
              /> */}
              <SingleTabItem style={{ marginBottom: "16px" }}>
                Course Name
              </SingleTabItem>
              <SelectBox
                placeholder="Select Course"
                width={"100%"}
                value={inputValue.course}
                onChange={(val) =>
                  setInputValue((prev) => ({ ...prev, course: val }))
                }
                options={[
                  { id: "CS101 - Intro to CS", name: "CS101 - Intro to CS" },
                  {
                    id: "MATH202 - Linear Algebra",
                    name: "MATH202 - Linear Algebra",
                  },
                ]}
              />
              {/* <Input
                placeholder={"Course name"}
                inputValue={inputValue?.coursename}
                onChange={(e) =>
                  setInputValue({ ...inputValue, coursename: e.target.value })
                }
              /> */}
            </InputWrapper>
          )}
          <TabContainer>
            {singleUpload ? (
              <SingleTabItem key={singleUpload} isActive={singleUpload}>
                {singleUpload}
              </SingleTabItem>
            ) : (
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
            )}
          </TabContainer>
          <FileUpload />
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
            Text={singleUpload ? "Add" : "Assign"}
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
  background-color:rgb(249, 247, 247);
  width: calc(100% + 80px);
  margin: 20px 0 -30px -40px;
`;

const InputWrapper = styled.div`
  max-width: 100%;
`;

export default FileUploadModal;
