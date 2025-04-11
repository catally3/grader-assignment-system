import React, { useState } from "react";
import styled from "@emotion/styled";
import Modal, { ModalContainer } from "../Common/Modal";
import ModalHeader from "../Common/ModalHeader";

import Button from "../Common/Button";
import Input from "../../components/Common/Input";
import SelectBox from "../../components/Common/SelectBox";

import ArrowIcon from "../../assets/icons/icon_arrow.svg";
import { courseOptions } from "../../utils/metadata";

const AddCandidateModal = ({
  open,
  onClose,
  handleSubmit,
  title,
  inputValue,
  setInputValue,
}) => {
  const [addCourseMode, setAddCourseMode] = useState(false);

  const handleAssign = () => {
    console.log("Add new Candidate");
    // Implementation for assign action would go here
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
            <SingleTabItem style={{ marginBottom: "16px" }}>
              Student Name
            </SingleTabItem>
            <Input
              placeholder={"Student Name"}
              inputValue={inputValue?.name}
              onChange={(e) =>
                setInputValue({ ...inputValue, name: e.target.value })
              }
            />
            <SingleTabItem
              style={{
                marginTop: "10px",
              }}
              onClick={() => setAddCourseMode(!addCourseMode)}
            >
              Add Course & Professor <Icon src={ArrowIcon} />
            </SingleTabItem>
            {addCourseMode && (
              <AddCourseWrap>
                <SingleTabItem style={{ marginBottom: "16px" }}>
                  Course Name
                </SingleTabItem>
                <SelectBox
                  placeholder="Select Course"
                  width={"100%"}
                  value={inputValue.courseName}
                  onChange={(val) =>
                    setInputValue((prev) => ({
                      ...prev,
                      number: val.id,
                      courseName: val.name,
                    }))
                  }
                  options={courseOptions}
                />
                <SingleTabItem style={{ marginBottom: "16px" }}>
                  Professor Name
                </SingleTabItem>
                <Input
                  placeholder={"Professor Name"}
                  inputValue={inputValue?.professor}
                  onChange={(e) =>
                    setInputValue({
                      ...inputValue,
                      professor: e.target.value,
                    })
                  }
                />
              </AddCourseWrap>
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

export default AddCandidateModal;
