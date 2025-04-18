import styled from "@emotion/styled";
import Layout from "../../layouts/Layout.js";
import React, { useState } from "react";
import FileUpload from "../../components/Common/FileUpload.jsx";
import CourseManagementModal from "../../components/Modals/CourseManagementModal.jsx";
import SortIcon from "../../assets/icons/icon_sort.svg";
import AssignmentDetailModal from "../../components/Modals/AssignmentDetailModal.jsx";
import { ExcelExportButton } from "../../components/ExcelExportButton.jsx";

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

const BoxContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  box-sizing: border-box;
  margin-top: 20px;
`;

const Box = styled.div`
  display: flex;
  width: 1300px;
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

const FilterContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const FilterDropdown = styled.select`
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
`;

const FilterInput = styled.input`
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  width: 150px;
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
  background-color: rgb(17, 16, 16);
  display: flex;
  width: 120px;
  height: 35px;
  box-shadow: 2px 4px 10px rgba(0, 0, 0, 0.1);
  &:hover {
    background-color: rgb(59, 57, 57);
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
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ReassignButton = styled(ButtonContainer)`
  color: rgb(255, 255, 255);
  background-color: rgb(17, 16, 16);
  display: flex;
  align-items: center;
  justify-content: center; // Ensures the button text is centered
  width: 100px;
  height: 35px;
  box-shadow: 2px 4px 10px rgba(0, 0, 0, 0.1);
  &:hover {
    background-color: rgb(59, 57, 57);
  }
`;

const GraderAssignment = () => {
  const [data, setData] = useState([
    {
      number: null,
      name: "CS",
      graders: "1",
      section: "501",
      professor: "Beatrice Smith",
      assigned: "Anthony Hernandez",
    },
    {
      number: "1200",
      name: "CS",
      graders: "2",
      section: "503",
      professor: "Herlin Villareal",
      assigned: "Caroline Mendez",
    },
    {
      number: "1200",
      name: "CS",
      graders: "2",
      section: "503",
      professor: "Herlin Villareal",
      assigned: "Mary Smith",
    },
    {
      number: "4884",
      name: null,
      graders: "1",
      section: "503",
      professor: "Gabriela Smith",
      assigned: null,
    },
    {
      number: "4841",
      name: "CS",
      graders: null,
      section: "504",
      professor: "Jose Alvarez",
      assigned: "Mary Jane",
    },
    {
      number: "4848",
      name: "CS",
      graders: "2",
      section: "501",
      professor: "Beatrice Smith",
      assigned: "Anthony Martinez",
    },
    {
      number: "4848",
      name: "CS",
      graders: "2",
      section: "501",
      professor: "Beatrice Smith",
      assigned: "Jose Jose",
    },
  ]);

  /******* SEARCH FUNCTIONALITY  *******/
  const [searchTerm, setSearchTerm] = useState(""); // searchTerm stores the term entered by user to search
  // updates searchTerm with user input, not case-sensitive
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  /******* SORTING FUNCTIONALITY  *******/
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" }); // sortConfig stores sorting state, key (column) and direction
  // toggles direction of sorting behavior when column is clicked
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key) {
      if (sortConfig.direction === "asc") {
        direction = "desc";
      } else if (sortConfig.direction === "desc") {
        direction = null;
      }
    }
    setSortConfig({ key: direction ? key : null, direction });
  };
  // return the current sort arrow based on current sorting direction, and display default
  const getSortArrow = (key) => {
    if (sortConfig.key !== key) {
      return (
        <img
          src={SortIcon}
          alt="sort logo"
          style={{
            width: "16px",
            height: "16px",
            marginLeft: "8px",
            verticalAlign: "baseline",
          }}
        />
      );
    }
    return sortConfig.direction === "asc" ? "▲" : "▼";
  };
  // sort data based on the key and direction
  const sortedData = sortConfig.key
    ? [...data].sort((a, b) => {
        const valA = a[sortConfig.key] || "";
        const valB = b[sortConfig.key] || "";
        return sortConfig.direction === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      })
    : data;

  /******* FILTER FUNCTIONALITY  *******/
  const [selectedColumn, setSelectedColumn] = useState(""); // selectedColumn stores user selected column to filter
  const [filterValue, setFilterValue] = useState(""); // filterValue stores user inputed term to filter
  // update selectedColumn when user selects a column
  const handleColumnChange = (event) => {
    setSelectedColumn(event.target.value);
  };
  // update filterValue based on user input
  const handleFilterValueChange = (event) => {
    setFilterValue(event.target.value.toLowerCase());
  };
  // output based on SORTING and FILTER functionality
  const filteredData = sortedData.filter(
    (row) =>
      Object.values(row).some(
        (value) =>
          value &&
          typeof value === "string" &&
          value.toLowerCase().includes(searchTerm)
      ) &&
      (selectedColumn
        ? row[selectedColumn]?.toLowerCase().includes(filterValue)
        : true)
  );

  /******* DELETION  FUNCTIONALITY  *******/ // FFFFFFFFFFIIIIIIIIIIIXXXXXXXXXXXXXXX
  const [deleteMode, setDeleteMode] = useState(false); // deleteMode: true or false (normalMode)
  const [selected, setSelected] = useState([]); // selected stores the candidateIDs chosen to be deleted
  // toggles deleteMode and clears any selected candidates between toggles
  const toggleDeleteMode = () => {
    setDeleteMode(!deleteMode);
    setSelected([]);
  };
  // adds/removes candidateIDs from selected when checkboxes are toggles
  const handleCheckboxChange = (candidateID) => {
    setSelected((prev) =>
      prev.includes(candidateID)
        ? prev.filter((item) => item !== candidateID)
        : [...prev, candidateID]
    );
  };
  // user confirmed deletion, DELETE!
  const handleDelete = () => {
    setData((prevData) =>
      prevData.filter((row) => !selected.includes(row.candidateID))
    );
    setDeleteMode(false);
    setSelected([]);
  };

  /******** REASSIGN FUNCTIONALITY  *******/ // FFFFFFFFFFIIIIIIIIIIIXXXXXXXXXXXXXXX
  const [isModalOpen, setIsModalOpen] = useState(false); // isModalOpen: true or false
  const [selectedCourseData, setSelectedCourseData] = useState(null); // selectedCourseData stores course data for selcted candidate
  // open the reassignmnet modal for the selected course
  const handleReassign = (course) => {
    setSelectedCourseData(course);
    setIsModalOpen(true);
  };
  // close the reassignment model for the selected course
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // DISPLAY CANDIDATES DROPWDOWM
  const [selectedRow, setSelectedRow] = useState(null);
  const groupedData = filteredData.reduce((acc, row) => {
    const courseKey = `${row.number}-${row.section}-${row.professor}`;
    if (!acc[courseKey]) {
      acc[courseKey] = [];
    }
    acc[courseKey].push(row);
    return acc;
  }, {});

  const renderGroupedRow = (group, key) => (
    <Row key={key}>
      {deleteMode && (
        <Column>
          <input
            type="checkbox"
            checked={selected.includes(key)}
            onChange={() => handleCheckboxChange(group[0])}
          />
        </Column>
      )}
      <Column>{group[0].number || "N/A"}</Column>
      <Column>{group[0].name || "N/A"}</Column>
      <Column>{group[0].graders || "N/A"}</Column>
      <Column>{group[0].professor || "N/A"}</Column>
      <Column>
        {/* Removed the onClick handler */}
        <span>{group.map((row) => row.assigned || "N/A").join(", ")}</span>
      </Column>
      <Column>
        <ReassignButton onClick={() => handleReassign(group)}>
          Reassign
        </ReassignButton>
        <CourseManagementModal
          open={isModalOpen}
          onClose={handleCloseModal}
          courseData={selectedCourseData}
          allCourses={filteredData}
        />
      </Column>
    </Row>
  );

  return (
    <Layout>
      <Title>Course Management</Title>
      <FileTitle>Upload Course Files</FileTitle>
      <FileContainer>
        <FileUpload singleUpload={true} />
      </FileContainer>
      <BoxContainer>
        <Box>
          <HeaderContainer>
            <SearchContainer>
              <HeaderText>Search:</HeaderText>
              <SearchBox
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </SearchContainer>
            <ButtonContainer>
              <DeleteButton onClick={toggleDeleteMode}>
                {deleteMode ? "Cancel" : "Delete Course"}
              </DeleteButton>
              {deleteMode && (
                <DeleteButton onClick={handleDelete}>
                  Confirm Delete
                </DeleteButton>
              )}
            </ButtonContainer>
            <FilterContainer>
              <HeaderText>Filter:</HeaderText>
              <FilterDropdown
                onChange={handleColumnChange}
                value={selectedColumn}
              >
                <option value="">Select Column</option>
                <option value="number">Course Number</option>
                <option value="name">Course Name</option>
                <option value="graders">Number of Graders</option>
                <option value="professor">Professor Name</option>
                <option value="assigned">Assigned Candidate</option>
              </FilterDropdown>
              <FilterInput
                type="text"
                value={filterValue}
                onChange={handleFilterValueChange}
                placeholder="Enter filter value"
              />
              <ExcelExportButton data={data} filteredData={filteredData} />
            </FilterContainer>
          </HeaderContainer>
          <ColumnTitle>
            {deleteMode && <ColumnTitleText>Select</ColumnTitleText>}
            <ColumnTitleText onClick={() => handleSort("number")}>
              Course Number {getSortArrow("number")}
            </ColumnTitleText>
            <ColumnTitleText onClick={() => handleSort("name")}>
              Course Name {getSortArrow("name")}
            </ColumnTitleText>
            <ColumnTitleText onClick={() => handleSort("graders")}>
              Number of Graders {getSortArrow("graders")}
            </ColumnTitleText>
            <ColumnTitleText onClick={() => handleSort("professor")}>
              Professor Name {getSortArrow("professor")}
            </ColumnTitleText>
            <ColumnTitleText onClick={() => handleSort("assigned")}>
              Assigned Candidate {getSortArrow("assigned")}
            </ColumnTitleText>
            <ColumnTitleText>Re-Assignment</ColumnTitleText>
          </ColumnTitle>

          {/* Render grouped data */}
          {Object.entries(groupedData).map(([key, group]) =>
            renderGroupedRow(group, key)
          )}
        </Box>
      </BoxContainer>
    </Layout>
  );
};
export default GraderAssignment;
