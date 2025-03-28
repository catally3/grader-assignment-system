import styled from "@emotion/styled";
import Layout from "../../layouts/Layout.js";
import Header from "../../layouts/Header.js";
import { useState } from "react"; // delete and search states
import FileUpload from "../../components/Common/FileUpload.jsx";

// Course Management
const Title = styled.div`
  font-size: x-large;
  font-weight: bold;
`;

// Upload Course Files
const FileTitle = styled.div`
  font-size: medium;

  font-weight: bold;
  margin-top: 20px;
  margin-bottom: 20px;
  color: rgba(36, 35, 35, 0.88);
`;

const FileContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  box-sizing: border-box;
  margin-top: 20px;
`;

const FileBox = styled.div`
  display: flex;
  width: 1140px;
  height: 150px;
  background-color: white;
  border-radius: 12px; // round corners
  border: 2px dashed #ccc; /* dashed border */
  color: #333; // text color
  padding: 14px; // internal spacing
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
  justify-content: space-between;
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
`;

const ButtonContainer = styled.button`
  display: flex;
  width: 130px;
  height: 35px;
  justify-content: center; // horizontal text
  align-items: center; // vertical text
  border-radius: 12px;
  font-size: small;
  gap: 10px;
`;

const DeleteButton = styled(ButtonContainer)`
  color: rgb(255, 255, 255);
  background-color: rgb(243, 4, 4);
  display: flex;
  box-shadow: 2px 4px 10px rgba(0, 0, 0, 0.1);
  &:hover {
    background-color: rgb(199, 19, 19);
  }
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
`;

const HeaderText = styled.div`
  font-size: medium;
  font-weight: normal;
  padding: 10px;
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
  const [data, setData] = useState([
    {
      number: null,
      name: "CS",
      graders: 1,
      section: "501",
      professor: "John Smith",
      assigned: "Mary Smith",
    },
    {
      number: "4848",
      name: "CS",
      graders: 2,
      section: "501",
      professor: "John Smith",
      assigned: "Mary Smith",
    },
    {
      number: "4848",
      name: "CS",
      graders: 6,
      section: "502",
      professor: "John Smith",
      assigned: "Mary Smith",
    },
    {
      number: "4848",
      name: null,
      graders: 2,
      section: "503",
      professor: "John Smith",
      assigned: null,
    },
    {
      number: "4848",
      name: "CS",
      graders: null,
      section: "504",
      professor: "John Smith",
      assigned: "Mary Smith",
    },
    {
      number: "4848",
      name: "CS",
      graders: 2,
      section: "501",
      professor: null,
      assigned: "Mary Smith",
    },
  ]);

  // states used for deletion of course
  const [deleteMode, setDeleteMode] = useState(false); // deleteMode: true or false
  const [selected, setSelected] = useState([]); // array of selected for deletion

  // state used for search
  const [searchTerm, setSearchTerm] = useState("");

  // toggles between normal mode and delete mode; selection is resetted after switching to normal mode
  const toggleDeleteMode = () => {
    setDeleteMode(!deleteMode);
    setSelected([]);
  };

  // create unique row identifier, consisting of number, name and section
  // when user checks/unchecks a checkbox, rowkey is either added or removed from selected
  const handleCheckboxChange = (row) => {
    const { number, name, section } = row;
    const rowKey = `${number}-${name}-${section}`;

    setSelected((prev) =>
      prev.includes(rowKey)
        ? prev.filter((item) => item !== rowKey)
        : [...prev, rowKey]
    );
  };

  // user confirmed deletion, DELETE! (if combo matches)
  const handleDelete = () => {
    setData((prevData) =>
      prevData.filter((row) => {
        const rowKey = `${row.number}-${row.name}-${row.section}`;
        return !selected.includes(rowKey);
      })
    );
    setDeleteMode(false);
    setSelected([]);
  };

  // get user input (search term) and convert it to lowercase for search
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  // search data array by seeing which entry matches the search entry
  const filteredData = data.filter(
    (row) =>
      row.number?.toLowerCase().includes(searchTerm) ||
      row.name?.toLowerCase().includes(searchTerm) ||
      row.graders?.toString().includes(searchTerm) ||
      row.section?.toLowerCase().includes(searchTerm) ||
      row.professor?.toLowerCase().includes(searchTerm) ||
      row.assigned?.toLowerCase().includes(searchTerm)
  );

  return (
    <Layout>
      <Title>Course Management</Title>
      <FileTitle>Upload Course Files</FileTitle>
      <FileContainer>
        <FileUpload />
      </FileContainer>
      <BoxContainer>
        <Box>
          <HeaderContainer>
            <ButtonContainer>
              <DeleteButton onClick={toggleDeleteMode}>
                {" "}
                {/*when button is clicked, toggle between modes*/}
                {deleteMode ? "Cancel" : "Delete Course"}{" "}
                {/*if deleteMode, then Cancel, else Delete Course*/}
              </DeleteButton>
              {/*if deleteMode, then display Confirm, and when clicked Deleted*/}
              {deleteMode && (
                <DeleteButton onClick={handleDelete}>
                  Confirm Delete
                </DeleteButton>
              )}
            </ButtonContainer>
            <SearchContainer>
              <HeaderText>Search:</HeaderText>
              <SearchBox
                type="text"
                placeholder="Search..."
                value={searchTerm} // bind input to searchTerm
                onChange={handleSearchChange} // state updated everytime user inputs
              />
            </SearchContainer>
          </HeaderContainer>
          <ColumnTitle>
            {deleteMode && <ColumnTitleText>Select</ColumnTitleText>}{" "}
            {/*if deleteMode, then display column for Select*/}
            <ColumnTitleText>Course Number</ColumnTitleText>
            <ColumnTitleText>Course Name</ColumnTitleText>
            <ColumnTitleText>Number of Graders</ColumnTitleText>
            <ColumnTitleText>Section</ColumnTitleText>
            <ColumnTitleText>Professor Name</ColumnTitleText>
            <ColumnTitleText>Assigned Candidate</ColumnTitleText>
          </ColumnTitle>
          {filteredData.map((row, index) => (
            <Row key={index}>
              {deleteMode && (
                <Column>
                  <input
                    type="checkbox"
                    checked={selected.includes(
                      `${row.number}-${row.name}-${row.section}`
                    )}
                    onChange={() => handleCheckboxChange(row)}
                  />
                </Column>
              )}
              <Column>{row.number || "N/A"}</Column>
              <Column>{row.name || "N/A"}</Column>
              <Column>{row.graders || "N/A"}</Column>
              <Column>{row.section || "N/A"}</Column>
              <Column>{row.professor || "N/A"}</Column>
              <Column>{row.assigned || "N/A"}</Column>
            </Row>
          ))}
        </Box>
      </BoxContainer>
    </Layout>
  );
};

export default GraderAssignment;
