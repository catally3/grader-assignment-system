import styled from "@emotion/styled";
import Layout from "../../layouts/Layout.js";
import Header from "../../layouts/Header.js";
import { useState } from "react"; // search state

// Professor Management
const Title = styled.div`
  font-size: x-large;
  font-weight: bold;
`;

const BoxContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  box-sizing: border-box;
  margin-top: 20px;  
`;

const Box = styled.div`
  display: flex;
  width: 1140px;
  background-color: white;
  border-radius: 12px; // round corners
  box-shadow: 2px 4px 10px rgba(0, 0, 0, 0.1);
  color: #333; // text color
  flex-direction: column; // stacks children vertically
  padding: 14px; // internal spacing
`;

const HeaderContainer = styled.div`
  display: flex;
  align-items: center; // vertically
  width: 100%; 
  padding: 10px;
  margin-bottom: 10px;
  justify-content: flex-end;
  gap: 10px;
`;

const HeaderText = styled.div`
  font-size: medium;
  font-weight: normal;
  jusitify-content: flex-end;
`;

const SearchBox = styled.input`
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  width: 150px; 
`;

const ColumnTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;  
  padding: 10px 0;
  background-color: rgb(224, 221, 221); 
`;

const ColumnTitleText = styled.div`
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
    {professor:'John Smith', name: 'CS', number: null, section: "501", assigned: 'Mary Smith', recommended: "Maria Salazar", mismatch: "Not in candidate pool"},
    {professor:'John Smith', name: 'CS', number: "4394", section: "501", assigned: 'Mary Smith', recommended: "Juan Salazar", mismatch: "Already assigned to another professor"},
    {professor:'John Smith', name: 'CS', number: "4394", section: "501", assigned: 'Mary Smith', recommended: "Manuel Salazar", mismatch: "Not in candidate pool"},
    {professor:'John Smith', name: null, number: "4394", section: "501", assigned: 'Mary Smith', recommended: "Gustavo Salazar", mismatch: "Not in candidate pool"},
    {professor:'John Smith', name: 'CS', number: "4394", section: null, assigned: 'Mary Smith', recommended: "Luis Miguel", mismatch: "Already assigned to another professor"},
  ];

  // state used for search
  const [searchTerm, setSearchTerm] = useState(""); 

  // get user input (search term) and convert it to lowercase for search
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase()); 
  };
  
  // search data array by seeing which entry matches the search entry 
  const filteredData = data.filter((row) =>
    row.professor?.toLowerCase().includes(searchTerm) ||
    row.name?.toLowerCase().includes(searchTerm) ||
    row.number?.toLowerCase().includes(searchTerm) ||
    row.section?.toLowerCase().includes(searchTerm) ||
    row.assigned?.toLowerCase().includes(searchTerm) ||
    row.recommended?.toLowerCase().includes(searchTerm) ||
    row.mismatch?.toLowerCase().includes(searchTerm) 
  );

  return (
    <Layout>
      <Title>Professor Management</Title>
      <BoxContainer>
        <Box>
          <HeaderContainer>
            <HeaderText>Search:</HeaderText>
            <SearchBox
                type="text"
                placeholder="Search..."
                value={searchTerm} // bind input to searchTerm
                onChange={handleSearchChange} // state updated everytime user inputs
              />
          </HeaderContainer>
          <ColumnTitle>
            <ColumnTitleText>Professor Name</ColumnTitleText>
            <ColumnTitleText>Course Name</ColumnTitleText>
            <ColumnTitleText>Course Number</ColumnTitleText>
            <ColumnTitleText>Section</ColumnTitleText>
            <ColumnTitleText>Assigned Candidate</ColumnTitleText>
            <ColumnTitleText>Recommended Candidate</ColumnTitleText>
            <ColumnTitleText>Reason for Mismatch</ColumnTitleText>
          </ColumnTitle>
          {filteredData.map((row, index) => (
            <Row key={index}>
              <Column>{row.professor|| 'N/A'}</Column>
              <Column>{row.name || 'N/A'}</Column>
              <Column>{row.number || 'N/A'}</Column>
              <Column>{row.section || 'N/A'}</Column>
              <Column>{row.assigned || 'N/A'}</Column>
              <Column>{row.recommended || 'N/A'}</Column>
              <Column>{row.mismatch || 'N/A'}</Column>
            </Row>
          ))}
        </Box>
      </BoxContainer>
    </Layout>
  );
};

export default GraderAssignment;
