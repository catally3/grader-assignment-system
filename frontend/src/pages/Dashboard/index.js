import styled from "@emotion/styled";
import Layout from "../../layouts/Layout.js";

// Welcome! Hiring Manager
const Title = styled.div`
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
  margin-top: 25px;  
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

const SubtitleContainer = styled.div`
  display: flex;
  align-items: center;  
  margin-top: 15px;  
`;

// Latest...
const Subtitles = styled.div`
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
  margin-bottom: 20px;  
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

const BottomBox = styled.div`
  width: 350px;
  height: 160px;
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 12px;
  font-weight: bold;
  border-radius: 12px;
  box-shadow: 2px 4px 10px rgba(0, 0, 0, 0.1);
  font-size: 16px;
  color: #333;
`;

const Dashboard = () => {
  // Define your rows with possible missing columns
  const data = [
    { name: 'Computer Science Grader', course: 'CS101', professor: 'Dr. Smith', applicants: 10, assigned: 5, positions: 2 },
    { name: 'Computer Science Grader', course: 'CS101', professor: 'Dr. Johnson', applicants: 8, assigned: 4, positions: 3 },
    { name: 'Computer Science Grader', course: 'HCS101', professor: 'Dr. Lee', applicants: 12, assigned: 6, positions: 4 },
    // Missing a column in this row
    { name: 'Computer Science Grader', course: 'CS101', professor: null, applicants: 5, assigned: 3, positions: 2 },
    // Missing a couple of columns
    { name: null, course: null, professor: 'Dr. Adams', applicants: null, assigned: 4, positions: 1 }
  ];

  return (
    <Layout>
      <Title>
        <WelcomeText>Welcome! </WelcomeText>
        <HiringManagerText>Hiring Manager</HiringManagerText>
      </Title>
      <SubTitle>Here is the overview of the grader assignments.</SubTitle>
      <BoxContainer>
        <TopBox>
          <BoxHeader>Total Assigned</BoxHeader>
          <BoxSubText>5000</BoxSubText>
        </TopBox>
        <TopBox>
          <BoxHeader>Total In Progress</BoxHeader>
          <BoxSubText>50</BoxSubText>
        </TopBox>
        <TopBox>
          <BoxHeader>Total Cancelled</BoxHeader>
          <BoxSubText>50</BoxSubText>
        </TopBox>
      </BoxContainer>
      <SubtitleContainer>
        <Subtitles>Latest Courses Overview</Subtitles>
        <Button>+ Add Course</Button>
      </SubtitleContainer>
      <BoxContainer>
        <CenterBox>
          <HeaderCenter>
            <HeaderText>Applied To Name</HeaderText>
            <HeaderText>Course Number</HeaderText>
            <HeaderText>Professor Name</HeaderText>
            <HeaderText>Applicants</HeaderText>
            <HeaderText>Assigned Graders</HeaderText>
            <HeaderText>Open Positions</HeaderText>
          </HeaderCenter>
          {data.map((row, index) => (
            <Row key={index}>
              <Column>{row.name || 'N/A'}</Column>
              <Column>{row.course || 'N/A'}</Column>
              <Column>{row.professor || 'N/A'}</Column>
              <Column>{row.applicants || 'N/A'}</Column>
              <Column>{row.assigned || 'N/A'}</Column>
              <Column>{row.positions || 'N/A'}</Column>
            </Row>
          ))}
        </CenterBox>
      </BoxContainer>
      <SubtitleContainer>
        <Subtitles>Latest Grader Assignments</Subtitles>
      </SubtitleContainer>
      <BoxContainer>
        <BottomBox></BottomBox>
        <BottomBox></BottomBox>
        <BottomBox></BottomBox>
      </BoxContainer>
    </Layout>
  );
};

export default Dashboard;