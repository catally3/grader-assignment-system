import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSemester } from "../../context/SemesterContext"; //NEW
import styled from "@emotion/styled";
import Layout from "../../layouts/Layout.js";
import InputModal from "../../components/Modals/InputModal.jsx";
import FileUploadModal from "../../components/Modals/FileUploadModal.jsx";
import DoughnutChart from "../../components/Common/DonutChart.js";
import SelectBox from "../../components/Common/SelectBox.jsx";

const Dashboard = () => {
  const [inputValue, setInputValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openUploadModal, setOpenUploadModal] = useState(false);
  const [carryOver, setCarryOver] = useState(false);
  const [semesters, setSemesters] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState("");

  const currentSemData = localStorage.getItem("semester");
  const isAssignments = localStorage.getItem("assignments");
  const navigate = useNavigate();

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
    {
      courseNumber: "87654",
      courseName: "Algorithms",
      requiredGraders: 3,
      assignedGraders: 0,
      professorName: "Dr. Michael",
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

  // new semester start modal
  const openModal = () => {
    // if new semester start, clear before data
    localStorage.removeItem("assignments");
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

  const handleCreateSemester = () => {
    if (!inputValue) return alert("Semester name is required before creating.");

    const prev = semesters.find((s) => s.name === selectedSemester);
    const newSemester = {
      name: inputValue,
      candidates: carryOver && prev ? [...prev.candidates] : [],
      courses: carryOver && prev ? [...prev.courses] : [],
      stats: {
        totalCandidates: carryOver && prev ? prev.stats.totalCandidates : 0,
        totalCourses: carryOver && prev ? prev.stats.totalCourses : 0,
        pendingCourses: carryOver && prev ? prev.stats.pendingCourses : 0,
        deletedAssignments:
          carryOver && prev ? prev.stats.deletedAssignments : 0,
      },
    };

    if (carryOver) {
      localStorage.setItem("assignments", inputValue);
    }

    localStorage.setItem("semester", inputValue);
    setSemesters((prevSems) => [...prevSems, newSemester]);
    setSelectedSemester(inputValue);
    setInputValue("");
    setCarryOver(false);
    setIsModalOpen(false);
  };

  const handleAssignClick = () => {
    if (currentSemData) {
      alert("Assignments are created");
      localStorage.setItem("assignments", currentSemData);
      navigate(0);
    }
  };

  // main dashboard
  return (
    <Layout>
      <WelcomeTextBox>
        <WelcomeText>Welcome! </WelcomeText>
        <HiringManagerText>Hiring Manager</HiringManagerText>
      </WelcomeTextBox>
      <SubTitle>Here is the overview of the grader assignments.</SubTitle>
      <TitleContainer>
        {currentSemData && (
          <Title style={{ marginRight: 20 }}>{currentSemData}</Title>
        )}
        {isAssignments && (
          <div style={{ marginRight: "20px" }}>
            <SelectBox
              placeholder="Select Term"
              width={"180px"}
              value={selectedSemester ?? null}
              onChange={(val) => setSelectedSemester(val)}
              options={[
                { id: 1, name: "Spring2025" },
                { id: 2, name: "Fall2024" },
                { id: 3, name: "Spring2024" },
              ]}
            />
          </div>
        )}
        <Button onClick={openModal}>New Semester</Button>
        {!isAssignments && (
          <>
            <Button
              onClick={() => setOpenUploadModal(true)}
              disabled={!currentSemData}
            >
              + Upload Files
            </Button>
            {/* <Button onClick={() => {}}>Reset</Button> */}
            <Button
              onClick={handleAssignClick}
              backgroundColor={"#000000"}
              disabled={!currentSemData}
            >
              Assign
            </Button>
          </>
        )}
      </TitleContainer>

      {currentSemData && (
        <BoxContainer>
          {!isAssignments ? (
            <NoticeBox>
              <HeaderText style={{ marginTop: 40 }}>
                Please upload files to start the grader assignment
              </HeaderText>
            </NoticeBox>
          ) : (
            <BoxContainer style={{ gap: "32px" }}>
              <LeftWrap>
                <div style={{ display: "flex", gap: "32px" }}>
                  <StatBox label="Total Candidates" value="40" />
                  <StatBox label="Total Courses" value="50" />
                  <StatBox label="Total Unassigned Courses" value="10" />
                </div>
                <TitleContainer style={{ marginTop: "10px" }}>
                  <Title>Unassigned Course</Title>
                </TitleContainer>
                <UnassignedCoursesTable
                  courses={unmatchedCourses}
                  navigate={navigate}
                />
              </LeftWrap>
              {/* chart */}
              <RightWrap>
                <TopBox>
                  <TitleContainer style={{ marginBottom: 40, marginTop: 0 }}>
                    <Title>Assignments Overview</Title>
                  </TitleContainer>
                  <DoughnutChart />
                </TopBox>
              </RightWrap>
            </BoxContainer>
          )}
        </BoxContainer>
      )}
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
      <FileUploadModal
        open={openUploadModal}
        onClose={() => setOpenUploadModal(false)}
      />
    </Layout>
  );
};

const StatBox = ({ label, value }) => (
  <TopBox>
    <BoxHeader>{label}</BoxHeader>
    <BoxSubText>{value}</BoxSubText>
  </TopBox>
);

const UnassignedCoursesTable = ({ courses, navigate }) => (
  <CenterBox>
    <HeaderCenter>
      <HeaderText>Course Number</HeaderText>
      <HeaderText>Course Name</HeaderText>
      <HeaderText>Required Graders</HeaderText>
      <HeaderText>Assigned Graders</HeaderText>
      <HeaderText>Professor Name</HeaderText>
      <HeaderText>Note</HeaderText>
    </HeaderCenter>
    {courses.map((row, index) => (
      <Row key={index} onClick={() => navigate("/applicant-management")}>
        <Column>{row.courseNumber}</Column>
        <Column>{row.courseName}</Column>
        <Column>{row.requiredGraders}</Column>
        <Column>{row.assignedGraders}</Column>
        <Column>{row.professorName}</Column>
        <Column>{row.note}</Column>
      </Row>
    ))}
  </CenterBox>
);

export default Dashboard;

const WelcomeTextBox = styled.div`
  font-size: x-large;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const WelcomeText = styled.span`
  color: rgb(0, 0, 0);
  margin-right: 8px;
  font-weight: bold;
`;

const HiringManagerText = styled.span`
  color: rgb(253, 135, 0);
  font-weight: bold;
`;

const SubTitle = styled.div`
  font-size: medium;
  font-weight: normal;
  color: #666;
  margin-top: 15px;
  margin-bottom: 15px;
`;

const BoxContainer = styled.div`
  display: flex;
  gap: 42;
  justify-content: flex-start;
  align-items: stretch;
  flex-wrap: wrap;
  width: 100%;
  box-sizing: border-box;
  margin-top: 15px;
  flex: 1;
`;

const TopBox = styled.div`
  flex: 1;
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

const BoxHeader = styled.div`
  font-size: medium;
  font-weight: bold;
`;

const BoxSubText = styled.div`
  font-size: medium;
  font-weight: normal;
  color: #666;
  margin-top: 20px;
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 40px;
  align-items: center;
`;

const Title = styled.div`
  font-size: x-large;
  display: flex;
  align-items: center;
  font-weight: bold;
`;

const Button = styled.button`
  color: rgb(255, 255, 255);
  width: 120px;
  height: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  border-radius: 12px;
  box-shadow: 2px 4px 10px rgba(0, 0, 0, 0.1);
  font-size: small;

  background-color: ${(props) =>
    props.backgroundColor || props.theme.colors.primary};

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

  &:not(first-of-type) {
    margin-right: 20px;
  }
`;
const CenterBox = styled.div`
  width: 100%;
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
  flex: 1;
  align-items: center;
  padding: 10px 0;
  background-color: rgb(224, 221, 221);
`;

const HeaderText = styled.div`
  min-width: 130px;
  flex: 1;
  text-align: center;
  padding: 0 10px;
  color: #333;
  font-size: small;
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
const NoticeBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
`;

const LeftWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const RightWrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  height: 100%;
`;
