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

const HeaderContainer = styled.div`
  display: flex;
  align-items: center; 
  justify-content: space-between; 
  width: 100%; 
  padding: 10px 0; 
  margin-bottom: 10px;
`;

const HeaderText = styled.div`
  font-size: medium;
  font-weight: normal;
  color: #666;
`;

const DropDownContainer = styled.div`
  display: flex;
  gap: 10px; 
`;

const SearchBox = styled.input`
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  width: 150px; 
`;

const SortByBox = styled.select`
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  width: 150px; 
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

const GraderAssignment = () => {
  const data = [
    {id: '12345', name: 'John Smith (gxs190043)', course: 'CS4398.001', position: 'Computer Science Grader', matching: 5, status: 'Accepted', date: '2024-07-01' },
    {id: '12345', name: 'John Smith (gxs190043)', course: 'CS4398.001', position: 'Computer Science Grader', matching: 4, status: 'In Progress', date: '2024-07-01' },
    {id: '12345', name: 'John Smith (gxs190043)', course: 'CS4398.001', position: 'Computer Science Grader', matching: 6, status: 'Accepted', date: '2024-07-01' },
    {id: '12345', name: 'John Smith (gxs190043)', course: null, position: 'Computer Science Grader', matching: 3, status: 'Accepted', date: '2024-07-01' },
    {id: null, name: null, course: 'CS4398.001', position: null, matching: 4, status: 'Rejected', date: '2024-07-01' }
  ];
  const dataCount = data.length;
  return (
    <Layout>
      <Title>Grader Assignment</Title>
      <BoxContainer>
        <Box>
          <HeaderContainer>
            <HeaderText>Total: {dataCount}</HeaderText>
            <DropDownContainer>
              <HeaderText>Search:</HeaderText>
              <SearchBox type="text" placeholder="Search..." />
              <HeaderText>Sort by:</HeaderText>
              <SortByBox>
                <option value="All">All</option>
                <option value="Ascending: A-Z">Ascending: A-Z</option>
                <option value="Descending: Z-A">Descending: Z-A</option>
                <option value="Newest First">Newest First</option>
                <option value="Oldest First">Oldest First</option>
              </SortByBox>
            </DropDownContainer>
          </HeaderContainer>
          <HeaderRow>
            <HeaderRowText>ID</HeaderRowText>
            <HeaderRowText>Name (NetID)</HeaderRowText>
            <HeaderRowText>Matched Course</HeaderRowText>
            <HeaderRowText>Position Applied To</HeaderRowText>
            <HeaderRowText>Matching Summary</HeaderRowText>
            <HeaderRowText>Status</HeaderRowText>
            <HeaderRowText>Date</HeaderRowText>
          </HeaderRow>
          {data.map((row, index) => (
            <Row key={index}>
              <Column>{row.id || 'N/A'}</Column>
              <Column>{row.name || 'N/A'}</Column>
              <Column>{row.course || 'N/A'}</Column>
              <Column>{row.position || 'N/A'}</Column>
              <Column>{row.matching || 'N/A'}</Column>
              <Column>{row.status || 'N/A'}</Column>
              <Column>{row.date || 'N/A'}</Column>
            </Row>
          ))}
        </Box>
      </BoxContainer>
    </Layout>
  );
};

export default GraderAssignment;
