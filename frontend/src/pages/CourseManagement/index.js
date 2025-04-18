import styled from "@emotion/styled";
import Layout from "../../layouts/Layout.js";
import { useState } from "react"; // search state
import CourseManagementModal from "../../components/Modals/CourseManagementModal.jsx";
import SortIcon from "../../assets/icons/icon_sort.svg";
import { ExcelExportButton } from "../../components/ExcelExportButton.jsx";

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
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  justify-content: space-between;
  gap: 10px;
`;

const HeaderText = styled.div`
  font-size: medium;
  font-weight: normal;
  jusitify-content: flex-end;
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

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
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
  const data = [
    {
      professor: "John Smith",
      name: "CS",
      number: "4348",
      section: "504",
      assigned: "Jenny Lee",
      recommended: "Mary Salazar",
      mismatch: "Not in candidate pool",
    },
    {
      professor: "John Smith",
      name: "CS",
      number: "4348",
      section: "504",
      assigned: "Beatrice Smith",
      recommended: "Mary Salazar",
      mismatch: "Not in candidate pool",
    },
    {
      professor: "Herlin Villareal",
      name: "CS",
      number: "3394",
      section: "503",
      assigned: "Gaby Alvarez",
      recommended: "Manuel Smith",
      mismatch: "Not in candidate pool",
    },
    {
      professor: "Caroline Mendez",
      name: null,
      number: "1204",
      section: "502",
      assigned: "Anthony Martinez",
      recommended: "Gustavo Jane",
      mismatch: "Not in candidate pool",
    },
    {
      professor: "Vanessa Ramirez",
      name: "CS",
      number: "1394",
      section: null,
      assigned: "Mary Jane",
      recommended: "Luis Miguel",
      mismatch: "Already assigned to another professor",
    },
  ];

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

  // DISPLAY CANDIDATES DROPWDOWM
  const [selectedRow, setSelectedRow] = useState(null);
  const handleAssignCandidate = (row) => {
    setSelectedRow(row);
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

  return (
    <Layout>
      <Title>Professor Management</Title>
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
            <FilterContainer>
              <HeaderText>Filter:</HeaderText>
              <FilterDropdown
                onChange={handleColumnChange}
                value={selectedColumn}
              >
                <option value="">Select Column</option>
                <option value="professor">Professor</option>
                <option value="name">Course Name</option>
                <option value="section">Section</option>
                <option value="assigned">Assigned Candidate</option>
                <option value="recommended">Recommended Candidate</option>
                <option value="mismatch">Reason for Mismatch</option>
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
            <ColumnTitleText onClick={() => handleSort("professor")}>
              Professor Name {getSortArrow("professor")}
            </ColumnTitleText>
            <ColumnTitleText onClick={() => handleSort("name")}>
              Course Name {getSortArrow("name")}
            </ColumnTitleText>
            <ColumnTitleText onClick={() => handleSort("number")}>
              Course Number {getSortArrow("number")}
            </ColumnTitleText>
            <ColumnTitleText onClick={() => handleSort("section")}>
              Section {getSortArrow("section")}
            </ColumnTitleText>
            <ColumnTitleText onClick={() => handleSort("assigned")}>
              Assigned Candidate {getSortArrow("assigned")}
            </ColumnTitleText>
            <ColumnTitleText onClick={() => handleSort("recommended")}>
              Recommended Candidate {getSortArrow("recommended")}
            </ColumnTitleText>
            <ColumnTitleText onClick={() => handleSort("mismatch")}>
              Reason for Mismatch {getSortArrow("mismatch")}
            </ColumnTitleText>
            <ColumnTitleText>Re-Assignment</ColumnTitleText>
          </ColumnTitle>
          {filteredData.map((row, index) => (
            <Row key={index}>
              <Column>{row.professor || "N/A"}</Column>
              <Column>{row.name || "N/A"}</Column>
              <Column>{row.number || "N/A"}</Column>
              <Column>{row.section || "N/A"}</Column>
              <Column onClick={() => handleAssignCandidate(row)}>
                {selectedRow === row ? (
                  <div
                    style={{
                      backgroundColor: "#f0f0f0",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      padding: "5px",
                      width: "150px",
                      color: "#333",
                      maxHeight: "150px",
                      overflowY: "auto",
                      pointerEvents: "none",
                      userSelect: "none",
                    }}
                  >
                    {filteredData
                      .filter(
                        (r) =>
                          r.number === row.number &&
                          r.name === row.name &&
                          r.section === row.section &&
                          r.professor === row.professor &&
                          r.graders === row.graders
                      )
                      .map((filteredRow, index, array) => (
                        <div
                          key={filteredRow.assigned}
                          style={{
                            padding: "5px 0",
                            borderBottom:
                              index === array.length - 1
                                ? "none"
                                : "1px solid #ccc", // Remove border on the last item
                          }}
                        >
                          {filteredRow.assigned || "N/A"}
                        </div>
                      ))}
                  </div>
                ) : (
                  <span>{row.assigned || "N/A"}</span>
                )}
              </Column>
              <Column>{row.recommended || "N/A"}</Column>
              <Column>{row.mismatch || "N/A"}</Column>
              <Column>
                <ReassignButton onClick={() => handleReassign(row)}>
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
          ))}
        </Box>
      </BoxContainer>
    </Layout>
  );
};

export default GraderAssignment;
