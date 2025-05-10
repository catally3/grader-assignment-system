import React, { useState, useMemo } from "react";
import styled from "@emotion/styled";
import Modal, { ModalButtonWrap, ModalContainer } from "../Common/Modal";
import ModalHeader from "../Common/ModalHeader";
import Input from "../Common/Input";
import TableHeader from "../Common/TableHeader";

import { assignGraderColumns } from "../../utils/metadata";
import { format } from "date-fns";

const ReassignmentModal = ({
  open,
  onClose,
  selectedCourseData,
  allCandidates,
}) => {
  if (!selectedCourseData) return null;
  const [data, setData] = useState(selectedCourseData);
  const [manualReassignIndex, setManualReassignIndex] = useState(null);
  const [selectedColumn, setSelectedColumn] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [reassignedGraders, setReassignedGraders] = useState(null);

  const [courseList, setCourseList] = useState(allCandidates || []);

  const assignedGraders = useMemo(() => {
    if (reassignedGraders) return reassignedGraders;
    return courseList.filter(
      (row) =>
        row.number === selectedCourseData.number &&
        row.name === selectedCourseData.name &&
        row.section === selectedCourseData.section &&
        (row.professor === selectedCourseData.professor ||
          row.professor === null)
    );
  }, [courseList, selectedCourseData, reassignedGraders]);

  const changeForm = (name, value) => {
    setData({ ...data, [name]: value });
  };

  const handleRemove = (graderRow) => {
    console.log("Auto Reassign clicked for:", graderRow);
  };

  const handleCheckboxChange = (selectedCandidate) => {
    if (manualReassignIndex === null) return;

    const newGraders = [...assignedGraders];
    newGraders[manualReassignIndex] = {
      ...selectedCandidate,
      selected: true,
    };
    setReassignedGraders(newGraders);

    // ✅ courseList update
    const updatedCourseList = courseList.map((row) =>
      row.candidateID === selectedCandidate.candidateID
        ? { ...row, selected: true }
        : row
    );
    setCourseList(updatedCourseList);
  };

  const handleColumnChange = (event) => setSelectedColumn(event.target.value);
  const handleFilterValueChange = (event) =>
    setFilterValue(event.target.value.toLowerCase());

  const filteredData = allCandidates.filter((row) => {
    if (selectedColumn) {
      return row[selectedColumn]?.toLowerCase().includes(filterValue);
    } else {
      return Object.values(row).some(
        (value) =>
          typeof value === "string" && value.toLowerCase().includes(filterValue)
      );
    }
  });

  const handleOnclose = () => {
    setManualReassignIndex(null);
    onClose();
  };

  return (
    <Modal open={open} onClose={handleOnclose}>
      <ModalContainer>
        <ModalHeader title="Course Management Detail" onClose={handleOnclose} />
        <InfoContainer>
          <Field>
            <Label>Course Number</Label>
            <Input
              inputValue={data?.course_number}
              onChange={(e) => changeForm("course_number", e.target.value)}
            />
          </Field>
          <Field>
            <Label>Course Section</Label>
            <Input
              inputValue={data?.course_section}
              onChange={(e) => changeForm("course_section", e.target.value)}
            />
          </Field>
          <Field>
            <Label>Course Name</Label>
            <Input
              inputValue={data?.course_name}
              onChange={(e) => changeForm("course_name", e.target.value)}
            />
          </Field>
          <Field>
            <Label>Professor</Label>
            <Input
              inputValue={data?.professor_name}
              onChange={(e) => changeForm("professor_name", e.target.value)}
            />
          </Field>
        </InfoContainer>
        <Divider />
        <TableWrapper>
          <Label>Assigned Grader</Label>
          <TableHeader columns={assignGraderColumns} />
          {assignedGraders.map((graderRow, index) => (
            <Row key={`${graderRow?.assigned}-${index}`}>
              <RowMain>
                <Cell>
                  <ButtonStack>
                    <Button
                      onClick={() =>
                        setManualReassignIndex((val) =>
                          val === index ? null : index
                        )
                      }
                    >
                      Manual Reassign
                    </Button>
                    <Button
                      backgroundColor="#000"
                      onClick={() => handleRemove(graderRow)}
                    >
                      Auto Reassign
                    </Button>
                  </ButtonStack>
                </Cell>
                <Cell>{graderRow?.applicant_name || "N/A"}</Cell>
                <Cell>{graderRow?.major || "N/A"}</Cell>
                <Cell>{graderRow?.document_id || "N/A"}</Cell>
                <Cell>
                  {format(new Date(graderRow?.updatedAt), "yyyy-MM-dd") ||
                    "N/A"}
                </Cell>
              </RowMain>
              {manualReassignIndex === index && (
                <AccordionContent>
                  <FilterContainer>
                    <HeaderText>Filter:</HeaderText>
                    <FilterDropdown
                      onChange={handleColumnChange}
                      value={selectedColumn}
                    >
                      <option value="">Select Column</option>
                      <option value="candidateID">Candidate ID</option>
                      <option value="name">Candidate Name</option>
                      <option value="number">Candidate Number</option>
                      <option value="professor">Professor Name</option>
                    </FilterDropdown>
                    <FilterInput
                      value={filterValue}
                      onChange={handleFilterValueChange}
                      placeholder="Enter filter value"
                    />
                  </FilterContainer>
                  <ColumnTitle>
                    <ColumnTitleText>Candidate ID</ColumnTitleText>
                    <ColumnTitleText>Candidate Name</ColumnTitleText>
                    <ColumnTitleText>Document</ColumnTitleText>
                    <ColumnTitleText>Professor Name</ColumnTitleText>
                  </ColumnTitle>
                  {filteredData?.map((row, index) => (
                    <Cell
                      key={index}
                      hover
                      onClick={() => {
                        const confirmChange = window.confirm(
                          "Confirm reassignment of this candidate?"
                        );
                        if (confirmChange) {
                          handleCheckboxChange(row);
                          setManualReassignIndex(null);
                        }
                      }}
                    >
                      <Column>{row?.student_id || "N/A"}</Column>
                      <Column>{row?.applicant_name || "N/A"}</Column>
                      <Column>{row?.document_id || "N/A"}</Column>
                      <Column>{row?.professor_name || "N/A"}</Column>
                    </Cell>
                  ))}
                </AccordionContent>
              )}
            </Row>
          ))}
        </TableWrapper>
      </ModalContainer>
    </Modal>
  );
};

export default ReassignmentModal;

// Styled Components
const InfoContainer = styled.section`
  display: flex;
  gap: 12px;
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
`;
const Divider = styled.div`
  margin: 20px 0;
  border-bottom: 1px solid #e5e5e5;
`;
const TableWrapper = styled.div`
  max-height: 500px;
  min-height: 250px;
  overflow-y: auto;
`;
const Row = styled.div`
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid #ccc;
`;
const RowMain = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
`;
const AccordionContent = styled.div`
  width: 100%;
  min-height: 200px;
  max-height: 400px;
  overflow-y: scroll;
  padding: 16px;
  background-color: #f8f8f8;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin: 16px 0;
  animation: slideDown 0.3s ease forwards;

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
const Cell = styled.div`
  display: flex;
  justify-content: center;
  flex: 1;
  text-align: center;

  &:hover {
    background-color: ${(props) => (props.hover ? "#eeeeee" : "none")};
  }
  cursor: ${(props) => (props.hover ? "pointer" : "")};
`;
const ButtonStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`;
const FilterContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 10px;
`;
const FilterDropdown = styled.select`
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
`;
const FilterInput = styled.input`
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  width: 150px;
`;
const HeaderText = styled.div`
  font-size: medium;
  font-weight: normal;
`;
const ColumnTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  background-color: rgb(224, 221, 221);
`;

const ColumnTitleText = styled.div`
  width: ${(props) => props.width};
  flex: ${(props) => (props.width ? "none" : 1)};
  text-align: center;
  padding: 0 10px;
  color: #333;
  font-size: small;
`;

const Column = styled.div`
  width: ${(props) => props.width};
  flex: ${(props) => (props.width ? "none" : 1)};
  text-align: center;
  padding: 10px;
  font-size: small;
`;
const Button = styled.button`
  color: white;
  width: 120px;
  padding: 10px;
  border-radius: 12px;
  font-size: 12px;
  background-color: ${(props) => props.backgroundColor || "#f87e03"};
  &:hover {
    background-color: ${(props) =>
      props.backgroundColor ? "rgba(72, 72, 72, 0.93)" : "rgb(203, 99, 2)"};
  }
  &:disabled {
    background-color: #ddd;
    color: #999;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const Text = styled.div`
  flex: 1;
  text-align: center;
  padding: 20px 10px;
  color: #333;
  font-size: small;
  font-weight: normal;
`;
