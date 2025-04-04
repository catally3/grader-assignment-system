import styled from "@emotion/styled";
import Layout from "../../layouts/Layout.js";
import { useState } from "react"; // delete and search states
import FileUpload from "../../components/Common/FileUpload.jsx";
import CourseManagementModal from "../../components/Modals/CourseManagementModal.jsx"; 

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
  justify-content: center;  // Ensures the button text is centered
  width: 100px;
  height: 35px;
  box-shadow: 2px 4px 10px rgba(0, 0, 0, 0.1);  
  &:hover {
    background-color: rgb(59, 57, 57);
  }
`;

const GraderAssignment = () => {
  const [data, setData] = useState([
    { number: null, name: "CS", graders:  "1", section: "501", professor: "Beatrice Smith", assigned: "Anthony Hernandez"},
    { number: "1200", name: "CS", graders: "2", section: "503", professor: "Herlin Villareal", assigned: "Caroline Mendez"},
    { number: "1200", name: "CS", graders: "2", section: "503", professor: "Herlin Villareal", assigned: "Mary Smith"},
    { number: "4884", name: null, graders: "1", section: "503", professor: "Gabriela Smith", assigned: null},
    { number: "4841", name: "CS", graders: null, section: "504", professor: "Jose Alvarez",assigned: "Mary Jane"},
    { number: "4848", name: "CS", graders: "2", section: "501", professor: "Beatrice Smith", assigned: "Anthony Martinez"},
    { number: "4848", name: "CS", graders: "2", section: "501", professor: "Beatrice Smith", assigned: "Jose Jose"}
  ]);

  // SEARCH FUNCTIONALITY
  // state used for search
  const [searchTerm, setSearchTerm] = useState("");
  // get user input (search term) and convert it to lowercase for search
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  /// SORTING FUNCTIONALITY
  // state used for sorting
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  // handle changes to sorting behavior when clicking column header (no sort, ascending, descending)
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key) {
      if (sortConfig.direction === "asc") {
        direction = "desc";
      } else if (sortConfig.direction === "desc") {
        direction = null; // Reset to no sorting
      }
    }
    setSortConfig({ key: direction ? key : null, direction });
  };
  // sort data based on key and direction, if no sorting, data is as
  const sortedData = sortConfig.key
    ? [...data].sort((a, b) => {
        const valA = a[sortConfig.key] || "";
        const valB = b[sortConfig.key] || "";
        return sortConfig.direction === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
      })
    : data;
  // display sort arrows
  const getSortArrow = (key) => {
    if (sortConfig.key !== key) return "";  
    return sortConfig.direction === "asc" ? "▲" : "▼";
  }; 

  // FILTER FUNCTIONALITY
  const [selectedColumn, setSelectedColumn] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const handleColumnChange = (event) => {
    setSelectedColumn(event.target.value);
  };
  const handleFilterValueChange = (event) => {
    setFilterValue(event.target.value.toLowerCase());
  };

  // OUPTPUT WITH SORT, SEARCH AND FILTERS
  const filteredData = sortedData.filter((row) =>
    Object.values(row).some((value) =>
      value && typeof value === "string" && value.toLowerCase().includes(searchTerm)
    ) &&
    (selectedColumn ? row[selectedColumn]?.toLowerCase().includes(filterValue) : true)
  );
  
  // DELETE FUNCTIONALITY
  // states used for deletion of course
  const [deleteMode, setDeleteMode] = useState(false); // deleteMode: true or false
  const [selected, setSelected] = useState([]); // array of selected for deletion
  // toggles between normal mode and delete mode; selection is resetted after switching to normal mode
  const toggleDeleteMode = () => {
    setDeleteMode(!deleteMode);
    setSelected([]);
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

  // DISPLAY CANDIDATES DROPWDOWM
  const [selectedRow, setSelectedRow] = useState(null);
  const handleAssignCandidate = (row) => {
    setSelectedRow(row);
  };

  // REASSIGN FUNCTIONALITY: call the modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourseData, setSelectedCourseData] = useState(null); 
  // open the modal when reassign is clicked
  const handleReassign = (course) => {
    setSelectedCourseData(course); 
    setIsModalOpen(true); 
  };
  // close the modal
  const handleCloseModal = () => {
    setIsModalOpen(false); 
  };
  
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
            <SearchContainer>
              <HeaderText>Search:</HeaderText>
              <SearchBox type="text" placeholder="Search..." value={searchTerm} onChange={handleSearchChange} />
            </SearchContainer>
            <ButtonContainer>
              <DeleteButton onClick={toggleDeleteMode}>
                {" "}
                {deleteMode ? "Cancel" : "Delete Course"}{" "}
              </DeleteButton>
              {deleteMode && (
                <DeleteButton onClick={handleDelete}>
                  Confirm Delete
                </DeleteButton>
              )}
            </ButtonContainer>
            <FilterContainer>
              <HeaderText>Filter:</HeaderText>
              <FilterDropdown onChange={handleColumnChange} value={selectedColumn}>
                <option value="">Select Column</option>
                <option value="number"> Course Number</option>
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
            </FilterContainer>
          </HeaderContainer>
          <ColumnTitle>
            {deleteMode && <ColumnTitleText>Select</ColumnTitleText>}{" "}
            <ColumnTitleText onClick={() => handleSort("number")}>Course Number {getSortArrow("number")}</ColumnTitleText>
            <ColumnTitleText onClick={() => handleSort("name")}>Course Name {getSortArrow("name")}</ColumnTitleText>
            <ColumnTitleText onClick={() => handleSort("graders")}>Number of Graders {getSortArrow("graders")}</ColumnTitleText>
            <ColumnTitleText onClick={() => handleSort("professor")}>Professor Name {getSortArrow("professor")}</ColumnTitleText>
            <ColumnTitleText onClick={() => handleSort("assigned")}>Assigned Candidate {getSortArrow("assigned")}</ColumnTitleText>
            <ColumnTitleText>Re-Assignment</ColumnTitleText>
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
              <Column>{row.professor || "N/A"}</Column>
              <Column onClick={() => handleAssignCandidate(row)}>
                {selectedRow === row ? (
                  <div style={{
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
                  }}>
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
                            borderBottom: index === array.length - 1 ? "none" : "1px solid #ccc" // Remove border on the last item
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
              <Column>
                <ReassignButton onClick={() => handleReassign(row)}>Reassign</ReassignButton>
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
