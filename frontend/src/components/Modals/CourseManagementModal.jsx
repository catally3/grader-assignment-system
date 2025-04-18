import React, { useState } from "react";
import styled from "@emotion/styled";
import Modal, { ModalContainer } from "../Common/Modal";
import ModalHeader from "../Common/ModalHeader";
import Input from "../Common/Input";
import Button from "../Common/Button";
import TableHeader from "../Common/TableHeader";
import SelectBox from "../Common/SelectBox";

import {
  assignGraderColumns,
  assignGraders,
  graderList,
  courseData,
} from "../../utils/metadata";

const CourseManagementModal = ({ open, onClose, courseData, allCourses }) => {
  if (!courseData) return null; // ensure modal doesn tnot render without data
  const [data, setData] = useState(courseData);
  const [assignGraders, setAssignGraders] = useState(courseData?.name);
  const assignedGraders = allCourses.filter(
    (row) =>
      row.number === courseData.number &&
      row.name === courseData.name &&
      row.section === courseData.section &&
      row.professor === courseData.professor &&
      row.graders === courseData.graders
  );

  const changeForm = (name, value) => {
    setData({
      ...data,
      [name]: value,
    });
  };
  const ActionButton = styled.button`
    background-color: ${(props) => (props.danger ? "#ff4d4f" : "#1890ff")};
    color: white;
    border: none;
    border-radius: 6px;
    padding: 6px 10px;
    font-size: 12px;
    margin-right: 5px;
    cursor: pointer;
    transition: background 0.3s;

    &:hover {
      background-color: ${(props) => (props.danger ? "#d9363e" : "#1677ff")};
    }
  `;

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
              inputValue={courseData.number}
              onChange={(e) => changeForm("courseNumber", e.target.value)}
            />
          </Field>
          <Field>
            <Label>Course Section</Label>
            <Input
              placeholder={""}
              inputValue={courseData.section}
              onChange={(e) => changeForm("courseSection", e.target.value)}
            />
          </Field>
          <Field>
            <Label>Course Name</Label>
            <Input
              placeholder={""}
              inputValue={courseData.name}
              onChange={(e) => changeForm("courseName", e.target.value)}
            />
          </Field>
          <Field>
            <Label>Professor</Label>
            <Input
              placeholder={""}
              inputValue={courseData.professor}
              onChange={(e) => changeForm("openPosition", e.target.value)}
            />
          </Field>
        </InfoContainer>
        <Divider />
        <TableWrapper>
          <Label>Assigned Grader</Label>
          <TableHeader columns={assignGraderColumns} />
          {assignedGraders.map((graderRow, index) => (
            <Row key={`${graderRow.assigned}-${index}`}>
              <Cell
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "3px",
                }}
              >
                <ActionButton onClick={() => handleEdit(graderRow)}>
                  Manual Reassign
                </ActionButton>
                <ActionButton danger onClick={() => handleRemove(graderRow)}>
                  Auto Reassign
                </ActionButton>
              </Cell>
              <Cell>{graderRow.assigned || "N/A"}</Cell>
              <Cell>{"-"}</Cell>
              <Cell>{"-"}</Cell>
              <Cell>{"-"}</Cell>
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
  color: rgb(12, 65, 211);
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
  font-size: x-small;
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
