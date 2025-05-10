import React, { useState } from "react";
import styled from "@emotion/styled";
import Modal, { ModalContainer } from "../Common/Modal";
import ModalHeader from "../Common/ModalHeader";

import Button from "../Common/Button";
import Input from "../../components/Common/Input";
import SelectBox from "../../components/Common/SelectBox";

import ArrowIcon from "../../assets/icons/icon_arrow.svg";
import { courseOptions } from "../../utils/metadata";
import FileUpload from "../Common/FileUpload";
import { fileType, uploadMode } from "../../utils/type";

const AddCourseModal = ({
  open,
  onClose,
  handleSubmit,
  title,
  inputValue,
  setInputValue,
  uploadType,
}) => {
  const [addCourseMode, setAddCourseMode] = useState(false);

  const handleFilesChange = (tab, newFiles) => {
    setInputValue((prev) => ({
      ...prev,
      file: newFiles,
    }));
  };

  const onCloseAddCandidate = () => {
    onClose();
    setAddCourseMode(false);
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        onCloseAddCandidate;
      }}
    >
      <ModalContainer>
        <ModalContent>
          <ModalHeader
            title={title ? title : "Upload files"}
            onClose={onCloseAddCandidate}
          />
          <InputWrapper>
            {uploadType === uploadMode.SINGLE && (
              <>
                <SingleTabItem>Course Name</SingleTabItem>
                <Input
                  placeholder={"Course Name"}
                  inputValue={inputValue?.course_name}
                  onChange={(e) =>
                    setInputValue({
                      ...inputValue,
                      course_name: e.target.value,
                    })
                  }
                />
                <SingleTabItem>Course Number</SingleTabItem>
                <Input
                  placeholder={"Course Number"}
                  inputValue={inputValue?.course_number}
                  onChange={(e) =>
                    setInputValue({
                      ...inputValue,
                      course_number: e.target.value,
                    })
                  }
                />
                <SingleTabItem>Section Number</SingleTabItem>
                <Input
                  placeholder={"Section Number"}
                  inputValue={inputValue?.course_section}
                  onChange={(e) =>
                    setInputValue({
                      ...inputValue,
                      course_section: e.target.value,
                    })
                  }
                />
                <SingleTabItem>Professor Name</SingleTabItem>
                <Input
                  placeholder={"Professor Name"}
                  inputValue={inputValue?.professor_name}
                  onChange={(e) =>
                    setInputValue({
                      ...inputValue,
                      professor_name: e.target.value,
                    })
                  }
                />
                <SingleTabItem>Number of Grader</SingleTabItem>
                <Input
                  placeholder={"Number of Graders"}
                  inputValue={inputValue?.number_of_graders}
                  onChange={(e) =>
                    setInputValue({
                      ...inputValue,
                      number_of_graders: e.target.value,
                    })
                  }
                />
                <SingleTabItem>Course Keywords</SingleTabItem>
                <Input
                  placeholder={"Course Keywords"}
                  inputValue={inputValue?.keywords}
                  onChange={(e) =>
                    setInputValue({
                      ...inputValue,
                      keywords: e.target.value,
                    })
                  }
                />
              </>
            )}
            {uploadType === uploadMode.BULK && (
              <>
                {/* Resume file upload(single & bulk)*/}
                <SingleTabItem>Course File Upload</SingleTabItem>
                <FileUpload
                  activeTab={
                    uploadType === uploadMode?.SINGLE ? "Course" : "Courses"
                  }
                  uploadedFiles={inputValue?.file}
                  onFilesChange={handleFilesChange}
                  singleUpload={true}
                  fileType={fileType.EXCEL}
                />
              </>
            )}
          </InputWrapper>
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
            Text={"Add"}
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

  padding-top: 16px;
  padding-bottom: 8px;

  font-size: Small;
  font-weight: 500;
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

export default AddCourseModal;
