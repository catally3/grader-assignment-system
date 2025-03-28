import React, { useState } from "react";
import styled from "@emotion/styled";
import Modal, { ModalContainer } from "../Common/Modal";
import FileUpload from "../Common/FileUpload";
import ModalHeader from "../Common/ModalHeader";
import Input from "../Common/Input";
import Button from "../Common/Button";
import TableHeader from "../Common/TableHeader";
import SelectBox from "../Common/SelectBox";

import {
  assignGraderColumns,
  assignGraders as initialAssignGraders,
  graderList,
  courseData,
} from "../../utils/metadata";

const CourseManagementModal = ({ open, onClose }) => {
  const [data, setData] = useState(courseData);
  const [assignGraders, setAssignGraders] = useState(initialAssignGraders);

  const changeForm = (name, value) => {
    setData({
      ...data,
      [name]: value,
    });
  };

  // Grader Change function
  const changeGraderSelection = (index, newGraderId) => {
    const selectedGrader = graderList.find(
      (grader) => grader.candidateId === newGraderId
    );
    if (!selectedGrader) return;

    const updatedGraders = [...assignGraders];
    updatedGraders[index] = {
      ...updatedGraders[index],
      candidateId: selectedGrader.candidateId,
      name: selectedGrader.name,
      netId: selectedGrader.netId,
    };

    setAssignGraders(updatedGraders);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <ModalContainer>
        <ModalHeader title={"Course Management Detail"} onClose={onClose} />
        <InfoContainer>
          <Field>
            <Label>Course Number</Label>
            <Input
              placeholder={""}
              inputValue={data.courseNumber}
              onChange={(e) => changeForm("courseNumber", e.target.value)}
            />
          </Field>
          <Field>
            <Label>Course Section</Label>
            <Input
              placeholder={""}
              inputValue={data.courseSection}
              onChange={(e) => changeForm("courseSection", e.target.value)}
            />
          </Field>
          <Field>
            <Label>Course Name</Label>
            <Input
              placeholder={""}
              inputValue={data.courseName}
              onChange={(e) => changeForm("courseName", e.target.value)}
            />
          </Field>
          <Field>
            <Label>Opened Position</Label>
            <Input
              placeholder={""}
              inputValue={data.openPosition}
              onChange={(e) => changeForm("openPosition", e.target.value)}
            />
          </Field>
        </InfoContainer>
        <Field style={{ marginTop: "20px" }}>
          <Label>Course Description</Label>
          <Input
            placeholder={""}
            inputValue={data.courseDec}
            onChange={(e) => changeForm("courseDec", e.target.value)}
          />
        </Field>
        <Divider />
        <TableWrapper>
          <Label>Assigned Grader</Label>
          <TableHeader columns={assignGraderColumns} />
          {assignGraders.map((grader, index) => (
            <Row key={grader.candidateId}>
              <Cell>{grader.id}</Cell>
              {/* <Cell>
                <SelectBox
                  placeholder="Select Grader"
                  width={"100%"}
                  value={grader.candidateId}
                  onChange={(newGraderId) =>
                    changeGraderSelection(index, newGraderId)
                  }
                  options={graderList}
                />
              </Cell> */}
              <Cell>
                {grader.name} ({grader.netId})
              </Cell>
              <Cell>{grader.major}</Cell>
              <Cell>{grader.doc}</Cell>
              <Cell>{grader.AssignedDate}</Cell>
            </Row>
          ))}
        </TableWrapper>
      </ModalContainer>
    </Modal>
  );
};

const InfoContainer = styled.section`
  display: flex;
  align-items: start;
  gap: 12px;
  color: #6f727a;
  justify-content: space-between;
  flex-wrap: nowrap;
  margin-top: 20px;
`;

const Field = styled.article`
  flex: 1;
  min-width: 150px;
`;

const Label = styled.h3`
  font-size: small;
  margin-bottom: 10px;
  color: #6f727a;
  font-weight: 600;
  line-height: 24px;
  display: block;
`;

const Divider = styled.div`
  display: flex;
  margin: 20px 0;
  border-bottom: 1px solid #e5e5e5;
`;

const TableWrapper = styled.div``;

const Row = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 2fr 1fr 1fr 1fr;
  align-items: center;
  justify-content: start;
  flex-wrap: wrap;
  font-size: small;
  padding: 20px 0px;
  border-bottom: 1px solid #e5e5e5;
`;

const Cell = styled.div`
  text-align: center;
  align-self: stretch;
  margin-top: auto;
  margin-bottom: auto;
  flex-grow: 1;
  flex-shrink: 1;
`;

export default CourseManagementModal;
