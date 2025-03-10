import styled from "@emotion/styled";
import Layout from "../../layouts/Layout.js";

// Welcome! Hiring Manager
const Title = styled.div`
  font-size: x-large;
  display: flex;
  align-items: center;
  margin-bottom: 10px;  
  font-weight: bold;
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

const Box = styled.div`
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

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;  
  padding: 10px 0;
  background-color: rgb(224, 221, 221); 
`;

const HeaderRowText = styled.div`
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

const CourseManagement = () => {
  const data = [
    {major: 'Computer Science', number: 'CS101', name: 'CSProject', professor: 'Dr. Smith', assigned: 1, assigned: 5, positions: 2, status: 'completed', action : 'edit'},
    {major: 'Computer Science', number: 'CS101', name: 'CSProject', professor: 'Dr. Johnson', assigned: 0, assigned: 4, positions: 3, status: 'completed', action : 'edit'},
    {major: 'Computer Science', number: 'HCS101', name: 'CSProject', professor: 'Dr. Lee', assigned: 2, assigned: 6, positions: 4, status: 'completed', action : 'edit'}, 
    {major: 'Computer Science', number: 'CS101', name: 'CSProject', professor: null, assigned: 1, assigned: 3, positions: 2, status: 'completed', action : 'edit'}, 
    {major: null, number: null, name: 'CSProject', professor: 'Dr. Adams', assigned: null, assigned: 1, positions: 1, status: 'completed', action : 'edit'}, 
  ];
  return (
    <Layout>
      <Title>Course Management</Title>
      <BoxContainer>
        <Box>
          <HeaderRow>
            <HeaderRowText>Major</HeaderRowText>
            <HeaderRowText>Course Number</HeaderRowText>
            <HeaderRowText>Course Name</HeaderRowText>
            <HeaderRowText>Professor Name</HeaderRowText>
            <HeaderRowText>Assigned Graders</HeaderRowText>
            <HeaderRowText>Open Postitions</HeaderRowText>
            <HeaderRowText>Status</HeaderRowText>
            <HeaderRowText>Action</HeaderRowText>
          </HeaderRow>
          {data.map((row, index) => (
            <Row key={index}>
              <Column>{row.major || 'N/A'}</Column>
              <Column>{row.number || 'N/A'}</Column>
              <Column>{row.name || 'N/A'}</Column>
              <Column>{row.professor || 'N/A'}</Column>
              <Column>{row.assigned || 'N/A'}</Column>
              <Column>{row.positions || 'N/A'}</Column>
              <Column>{row.status || 'N/A'}</Column>
              <Column>{row.action || 'N/A'}</Column>
            </Row>
          ))}
        </Box>
      </BoxContainer>
    </Layout>
  );
};

export default CourseManagement;
