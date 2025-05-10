import styled from "@emotion/styled";
import { useState, useEffect } from "react";
import Layout from "../../layouts/Layout.js";
import ReassignmentModal from "../../components/Modals/ReassignmentModal.jsx";
import SortIcon from "../../assets/icons/icon_sort.svg";
import { ExcelExportButton } from "../../components/ExcelExportButton.jsx";
import Pagination from "../../components/Common/Pagination.jsx";
import SelectBox from "../../components/Common/SelectBox.jsx";

const professorNames = [
  "Peter Shah",
  "Tina West",
  "Leo Torres",
  "Emily Chen",
  "Michael Patel",
  "Sophia Ramirez",
  "James O'Connor",
  "Aisha Nassar",
  "Daniel Kim",
  "Olivia Sanders",
  "Rajesh Mehta",
  "Grace Nakamura",
  "Benjamin Park",
  "Fatima Zahra",
  "Eric Hoffman",
  "Laura Bennett",
  "Alejandro Cruz",
  "Hannah Goldberg",
  "Yuki Tanaka",
  "John Wu",
];

const departments = ["CS"];
const mismatchOptions = [
  "Not in candidate pool",
  "Already assigned to another professor",
  "Ineligible due to GPA",
  null,
];

function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

const professorData = Array.from({ length: 20 }, (_, i) => ({
  professor: `Dr. ${professorNames[i]}`,
  name: getRandomItem(departments),
  number: `${1000 + Math.floor(Math.random() * 5000)}`, // 1000~5999
  section: `00${Math.floor(Math.random() * 10)}`, // 000~009
  assigned: Math.random() < 0.2 ? null : `Student_${i + 1}`, // 20% chance to be unassigned
  recommended: Math.random() < 0.2 ? null : `Candidate_${i + 1}`,
  mismatch: getRandomItem(mismatchOptions),
}));

// Professor Management
const ProfessorManagement = () => {
  // data
  const [data, setData] = useState(professorData);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  // table top sorting and searching state
  const [selectedColumn, setSelectedColumn] = useState(""); // selectedColumn stores user selected column to filter
  const [filterValue, setFilterValue] = useState(""); // filterValue stores user inputed term to filter
  const [searchTerm, setSearchTerm] = useState(""); // searchTerm stores the term entered by user to search
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" }); // sortConfig stores sorting state, key (column) and direction

  // modal state
  const [isModalOpen, setIsModalOpen] = useState(false); // isModalOpen: true or false
  const [selectedCourseData, setSelectedCourseData] = useState(null); // selectedCourseData stores course data for selcted candidate

  // updates searchTerm with user input, not case-sensitive
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

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
  const handleAssignCandidate = (row) => {
    setSelectedRow(row);
  };

  // open the reassignmnet modal for the selected course
  const handleReassign = (course) => {
    setSelectedCourseData(course);
    setIsModalOpen(true);
  };

  // close the reassignment model for the selected course
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // handler pagenation
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterValue, selectedColumn]);

  return (
    <Layout>
      <Title>Professor Management</Title>
      <BoxContainer>
        <Box>
          <HeaderContainer>
            <ButtonContainer>
              <HeaderText>Select Term:</HeaderText>
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
            </ButtonContainer>
            <ButtonContainer></ButtonContainer>
            <RightConatiner>
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
                <SearchContainer>
                  <HeaderText>Search:</HeaderText>
                  <SearchBox
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                </SearchContainer>
                <ExcelExportButton data={data} filteredData={filteredData} />
              </FilterContainer>
            </RightConatiner>
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
          <TableWrapper>
            {paginatedData.map((row, index) => (
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
                </Column>
              </Row>
            ))}
          </TableWrapper>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </Box>
      </BoxContainer>
      <ReassignmentModal
        open={isModalOpen}
        onClose={handleCloseModal}
        courseData={selectedCourseData}
        allCourses={filteredData}
      />
    </Layout>
  );
};

export default ProfessorManagement;

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
  width: 100%;
  background-color: white;
  border-radius: 12px; // round corners
  box-shadow: 2px 4px 10px rgba(0, 0, 0, 0.1);
  color: #333; // text color
  flex-direction: column; // stacks children vertically
  padding: 14px; // internal spacing
  flex: 1;
  max-height: 80vh;
  min-height: 600px;
`;

const HeaderContainer = styled.div`
  display: flex;
  align-items: center; // vertically
  justify-content: space-between;
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
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
  position: sticky;
  top: 0;
  z-index: 2;
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

const TableWrapper = styled.div`
  overflow-y: auto;
  flex: 1;
`;

const RightConatiner = styled.div`
  display: flex;
  gap: 16px;
`;
