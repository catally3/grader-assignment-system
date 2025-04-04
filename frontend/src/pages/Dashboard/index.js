import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import Layout from "../../layouts/Layout.js";
import InputModal from "../../components/Modals/InputModal.jsx";
import FileUploadModal from "../../components/Modals/FileUploadModal.jsx";

// Welcome! Hiring Manager
const WelcomeTextBox = styled.div`
  font-size: x-large;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const WelcomeText = styled.span`
  color: rgb(0, 0, 0);
  margin-right: 8px;
`;

const HiringManagerText = styled.span`
  color: rgb(253, 135, 0);
  font-weight: bold;
`;

// here is the overview of the grader assignment.. diff padding than the rest
const SubTitle = styled.div`
  font-size: medium;
  font-weight: normal;
  color: #666;
  margin-top: 15px;
  margin-bottom: 15px;
`;

const BoxContainer = styled.div`
  display: flex;
  gap: 45px;
  justify-content: flex-start;
  align-items: stretch;
  flex-wrap: wrap;
  width: 100%;
  box-sizing: border-box;
  margin-top: 15px;
  flex: 1;
`;

const TopBox = styled.div`
  width: 350px;
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 16px;
  font-weight: bold;
  border-radius: 12px;
  box-shadow: 2px 4px 10px rgba(0, 0, 0, 0.1);
  color: #333;
`;

// Total ...
const BoxHeader = styled.div`
  font-size: medium;
  font-weight: bold;
`;
// Num..
const BoxSubText = styled.div`
  font-size: medium;
  font-weight: normal;
  color: #666;
  margin-top: 20px;
`;

const BoxSmallText = styled.div`
  font-size: small;
  font-weight: normal;
  color: rgb(253, 135, 0);
  margin-top: 20px;
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 40px;
`;

const Title = styled.div`
  font-size: x-large;
  display: flex;
  align-items: center;
  font-weight: bold;
`;

const Button = styled.button`
  color: rgb(255, 255, 255);
  background-color: rgb(253, 135, 0);
  width: 120px;
  height: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  border-radius: 12px;
  box-shadow: 2px 4px 10px rgba(0, 0, 0, 0.1);
  font-size: small;
  margin-left: 20px;

  &:hover {
    background-color: rgb(218, 118, 5);
  }
`;

const CenterBox = styled.div`
  width: 1140px;
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 16px;
  font-weight: bold;
  border-radius: 12px;
  box-shadow: 2px 4px 10px rgba(0, 0, 0, 0.1);
  color: #333;
`;

const HeaderCenter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  background-color: rgb(224, 221, 221);
`;

const HeaderText = styled.div`
  flex: 1;
  text-align: center;
  padding: 0 10px;
  color: #333;
  font-size: medium;
  font-weight: normal;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  font-size: small;
  font-weight: normal;
  border-bottom: 1px solid #ccc;

  cursor: pointer;
  &:hover {
    background-color: rgb(247, 247, 247);
  }
  &:last-child {
    border-bottom: none;
  }
`;

const Column = styled.div`
  flex: 1;
  text-align: center;
  padding: 0 10px;
`;

const Dashboard = () => {
  const unmatchedCourses = [
    {
      courseNumber: "98765",
      courseName: "Data Structures",
      requiredGraders: 2,
      assignedGraders: 1,
      professorName: "Dr. Newton",
      note: "1 more grader needed",
    },
    {
      courseNumber: "87654",
      courseName: "Algorithms",
      requiredGraders: 3,
      assignedGraders: 0,
      professorName: "Dr. Curie",
      note: "Urgent - no grader assigned",
    },
    {
      courseNumber: "87654",
      courseName: "Algorithms",
      requiredGraders: 3,
      assignedGraders: 0,
      professorName: "Dr. Michael",
      note: "Urgent - no grader assigned",
    },
  ];

  const [inputValue, setInputValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [carryOver, setCarryOver] = useState(false);

  const [semesters, setSemesters] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState("");

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleCreateSemester = () => {
    const prev = semesters.find((s) => s.name === selectedSemester);
    const newSemester = {
      name: inputValue,
      candidates:
        carryOver && prev
          ? [...prev.candidates]
          : [
              /* placeholder */
            ],
      courses:
        carryOver && prev
          ? [...prev.courses]
          : [
              /* placeholder */
            ],
      stats: {
        totalCandidates: carryOver && prev ? prev.stats.totalCandidates : 0,
        totalCourses: carryOver && prev ? prev.stats.totalCourses : 0,
        pendingCourses: carryOver && prev ? prev.stats.pendingCourses : 0,
        deletedAssignments:
          carryOver && prev ? prev.stats.deletedAssignments : 0,
      },
    };

    setSemesters((prevSems) => [...prevSems, newSemester]);
    setSelectedSemester(inputValue);
    setInputValue("");
    setCarryOver(false);
    setIsModalOpen(false);
  };

  const currentSemData = semesters.find((s) => s.name === selectedSemester);

  return (
    <Layout>
      <WelcomeTextBox>
        <WelcomeText>Welcome! </WelcomeText>
        <HiringManagerText>Hiring Manager</HiringManagerText>
      </WelcomeTextBox>
      <SubTitle>Here is the overview of the grader assignments.</SubTitle>
      <TitleContainer>
        <Title>{selectedSemester || "Select a Semester"}</Title>
        <Button onClick={openModal}>New Semester</Button>
      </TitleContainer>
      <div style={{ marginTop: "15px" }}>
        <select
          value={selectedSemester || ""}
          onChange={(e) => setSelectedSemester(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "8px",
            fontSize: "14px",
            border: "1px solid #ccc",
          }}
        >
          <option disabled value="">
            Select Semester
          </option>
          {semesters.map((sem) => (
            <option key={sem.name} value={sem.name}>
              {sem.name}
            </option>
          ))}
        </select>
      </div>
      <InputModal
        open={isModalOpen}
        onClose={closeModal}
        title="Create Semester"
        inputValue={inputValue}
        setInputValue={setInputValue}
        carryOver={carryOver}
        setCarryOver={setCarryOver}
        handleCreateSemester={handleCreateSemester}
      />
      {selectedSemester && (
        <BoxContainer>
          {currentSemData && (
            <BoxContainer style={{ flexDirection: "column", gap: "20px" }}>
              <div style={{ display: "flex", gap: "45px" }}>
                <TopBox>
                  <BoxHeader>Total Candidates</BoxHeader>
                  <BoxSubText>40</BoxSubText>
                </TopBox>
                <TopBox>
                  <BoxHeader>Total Courses</BoxHeader>
                  <BoxSubText>50</BoxSubText>
                </TopBox>
                <TopBox>
                  <BoxHeader>Total Unassigned Courses</BoxHeader>
                  <BoxSubText>10</BoxSubText>
                </TopBox>
              </div>
              <TitleContainer style={{ marginTop: "10px" }}>
                <Title>Unassigned Course</Title>
              </TitleContainer>
              <CenterBox>
                <HeaderCenter>
                  <HeaderText>Course Number</HeaderText>
                  <HeaderText>Course Name</HeaderText>
                  <HeaderText>Required Graders</HeaderText>
                  <HeaderText>Assigned Graders</HeaderText>
                  <HeaderText>Professor Name</HeaderText>
                  <HeaderText>Note</HeaderText>
                </HeaderCenter>
                {unmatchedCourses.map((row, index) => (
                  <Row
                    key={index}
                    onClick={() => navigate("/applicant-management")}
                  >
                    <Column>{row.courseNumber}</Column>
                    <Column>{row.courseName}</Column>
                    <Column>{row.requiredGraders}</Column>
                    <Column>{row.assignedGraders}</Column>
                    <Column>{row.professorName}</Column>
                    <Column>{row.note}</Column>
                  </Row>
                ))}
              </CenterBox>
            </BoxContainer>
          )}
        </BoxContainer>
      )}
    </Layout>
  );
};

export default Dashboard;
