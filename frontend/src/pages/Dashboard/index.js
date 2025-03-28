import styled from "@emotion/styled";
import Layout from "../../layouts/Layout.js";

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

// Here is the overview of the grader assignment.. diff padding than the rest
const SubTitle = styled.div`
  font-size: medium;
  font-weight: normal;
  color: #666;
  margin-top: 10px;  
`;

const BoxContainer = styled.div`
  display: flex;
  gap: 45px;  
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;
  width: 100%;
  box-sizing: border-box;
  margin-top: 15px;  
`;

const TopBox = styled.div`
  width: 350px;
  height: 90px;
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

const TitleContainer = styled.div`
  display: flex;
  align-items: center;  
  margin-top: 15px;  
`;

// Latest...
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
  const candidateData = [
    {candidateID:'345135', candidateName:'Gaby Salazar', courseNumber:'3452', professorName:'Dr. Smith'},
    {candidateID:'325423', candidateName:'Dylan Smith', courseNumber:'6543', professorName:'Dr. Johnson'},
    {candidateID:'456543', candidateName:'Jenny Lee', courseNumber:'6542', professorName:'Dr. Lee'},
    {candidateID:'12345', candidateName:'Michelle Thai', courseNumber:'2534', professorName:'Dr. Lee'},
  ];

  const courseData = [
    {courseNumber:'12345', courseName:'Computer Science', graders: '1', professorName:'Dr. Smith', assignedGrader:'Gaby Salazar'},
    {courseNumber:'12445', courseName:'Computer Science', graders:'2', professorName:'Dr. Johnson', assignedGrader:'Dylan Smith'},
    {courseNumber:'12445', courseName:'Computer Science', graders:'3', professorName:'Dr. Lee', assignedGrader:'Jenny Lee'},
    {courseNumber:'123415', courseName:'Computer Science', graders:'1', professorName:'Dr. Lee', assignedGrader:'Michelle Thai'},
  ];


  return (
    <Layout>
      <WelcomeTextBox>
        <WelcomeText>Welcome! </WelcomeText>
        <HiringManagerText>Hiring Manager</HiringManagerText>
      </WelcomeTextBox>
      <SubTitle>Here is the overview of the grader assignments.</SubTitle>
      <TitleContainer>
        <Title>Hello</Title>
      </TitleContainer>
      <BoxContainer>
        <TopBox>
          <BoxHeader>Total Candidate</BoxHeader>
          <BoxSubText>5000</BoxSubText>
        </TopBox>
        <TopBox>
          <BoxHeader>Total Couses</BoxHeader>
          <BoxSubText>50</BoxSubText>
        </TopBox>
      </BoxContainer>
      <TitleContainer>
        <Title>Candidate</Title>
      </TitleContainer>
      <BoxContainer>
        <CenterBox>
          <HeaderCenter>
            <HeaderText>Candidate ID</HeaderText>
            <HeaderText>Candidate Name</HeaderText>
            <HeaderText>Course Number</HeaderText>
            <HeaderText>Professor Name</HeaderText>
          </HeaderCenter>
          {candidateData.map((row, index) => (
            <Row key={index}>
              <Column>{row.candidateID || 'N/A'}</Column>
              <Column>{row.candidateName || 'N/A'}</Column>
              <Column>{row.courseNumber || 'N/A'}</Column>
              <Column>{row.professorName || 'N/A'}</Column>
            </Row>
          ))}
        </CenterBox>
      </BoxContainer>
      <TitleContainer>
        <Title>Courses</Title>
      </TitleContainer>
      <BoxContainer>
        <CenterBox>
          <HeaderCenter>
            <HeaderText>Course Number</HeaderText>
            <HeaderText>Course Name</HeaderText>
            <HeaderText>Graders</HeaderText>
            <HeaderText>Professor Name</HeaderText>
            <HeaderText>Assigned Grader Name</HeaderText>
          </HeaderCenter>
          {courseData.map((row, index) => (
            <Row key={index}>
              <Column>{row.courseNumber || 'N/A'}</Column>
              <Column>{row.courseName || 'N/A'}</Column>
              <Column>{row.graders || 'N/A'}</Column>
              <Column>{row.professorName || 'N/A'}</Column>
              <Column>{row.assignedGrader || 'N/A'}</Column>
            </Row>
          ))}
        </CenterBox>
      </BoxContainer>
    </Layout>
  );
};

export default Dashboard;