import styled from "@emotion/styled";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import Layout from "../../layouts/Layout.js";
import { useState } from "react"; // delete, add, search states
import CourseManagementModal from "../../components/Modals/CourseManagementModal.jsx";

import FileUploadModal from "../../components/Modals/FileUploadModal.jsx";
import AssignmentDetailModal from "../../components/Modals/AssignmentDetailModal.jsx";

import DropdownButton from "../../components/Common/DropdownButton.jsx";
import SelectBox from "../../components/Common/SelectBox.jsx";

// Candidate Management
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
  justify-content: center; // horizontal text
  align-items: center; // vertical text
  border-radius: 12px;
  font-size: small;
  gap: 10px;
`;

const AddButton = styled(ButtonContainer)`
  color: #ffffff;
  background-color: rgba(248, 126, 3, 1);
  display: flex;
  padding: 10px;
  height: 35px;
  &:hover {
    background-color: rgb(255, 158, 61);
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 12px;
  width: 350px;
`;

const ModalTitle = styled.h3`
  margin-bottom: 10px;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  margin: 5px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const ModalButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
`;

const ModalButton = styled.button`
  width: 48%;
`;

const DeleteButton = styled(ButtonContainer)`
  color: rgb(255, 255, 255);
  background-color: ${(props) =>
    props.deleteMode ? "rgb(92, 92, 92)" : "rgb(17, 16, 16)"};
  display: flex;
  max-width: 100px;
  height: 35px;
  padding: 10px;
  box-shadow: 2px 4px 10px rgba(0, 0, 0, 0.1);
  &:hover {
    background-color: rgb(59, 57, 57);
  }
`;

const DeleteButtonWrap = styled.div`
  display: flex;
  gap: 10px;
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
  cursor: pointer;
`;

// hover for details
const TooltipContainer = styled.div`
  position: relative;
  display: inline-block;
  cursor: pointer;

  &:hover .tooltip {
    visibility: visible;
    opacity: 1;
  }
`;

const Tooltip = styled.div`
  visibility: hidden;
  width: 200px;
  background-color: #333;
  color: #fff;
  text-align: center;
  padding: 8px;
  border-radius: 6px;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  transition: opacity 0.3s ease-in-out;

  &::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: #333 transparent transparent transparent;
  }
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  font-size: small;
  font-weight: normal;
  border-bottom: 1px solid #ccc;

  cursor: pointer;

  :hover {
    background-color: #eeeeee;
  }

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

const RightConatiner = styled.div`
  display: flex;
  gap: 16px;
`;

const ExcelButton = styled.button`
  color: #333;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #ccc;
  padding: 6px 12px;
  border-radius: 10px;
  margin-bottom: 4px;
  background-color: #f9f9f9;

  &:hover {
    background-color: rgb(229, 229, 229);
  }
`;

const DocumentIcon = styled.img`
  aspect-ratio: 1;
  object-fit: contain;
  object-position: center;
  width: 24px;
  border-radius: 10px;
  flex-shrink: 0;
  border: 1px solid #ccc
  cursor: pointer;
`;

const ArrowIcon = styled.img`
  aspect-ratio: 1;
  object-fit: contain;
  object-position: center;
  width: 12px;
  flex-shrink: 0;
  cursor: pointer;

  margin-left: 6px;
`;

const GraderAssignment = () => {
  const [data, setData] = useState([
    {
      candidateID: "12341",
      name: "Anthony Smith (jxs190043)",
      number: "4302",
      class: "CS",
      section: "509",
      professor: "Herlin Villareal",
    },
    {
      candidateID: null,
      name: "Gaby Doe (jxd190043)",
      number: "4301",
      class: "CS",
      section: "502",
      professor: "Vanessa Ramirez",
    },
    {
      candidateID: "12345",
      name: "May Lee (jxs190042)",
      number: "4306",
      class: "CS",
      section: "502",
      professor: null,
    },
    {
      candidateID: "12343",
      name: "John Alvarez (jxd190042)",
      number: "4303",
      class: "CS",
      section: "504",
      professor: "Caroline Mendez",
    },
    {
      candidateID: "12349",
      name: null,
      number: null,
      class: "CS",
      section: "501",
      professor: "Jane Smith",
    },
    {
      candidateID: "12345",
      name: "Beatrice Salazar (gxs190043)",
      number: null,
      class: "CS",
      section: "501",
      professor: "Mary Salazar",
    },
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
        return sortConfig.direction === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
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

  // DELETE FUNCTIONALITY
  // states used for deletion of candidate
  const [deleteMode, setDeleteMode] = useState(false); // deleteMode: true or false
  const [selected, setSelected] = useState([]); // array of candidate ID's selected for deletion

  // professor name input for fileupload modal
  const [inputValue, setInputValue] = useState({
    profname: "",
    coursename: "",
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [assignmentModalOpen, setAssignmentModalOpen] = useState(false);
  const [assignmentInfo, setAssignmentInfo] = useState({
    id: "9944825",
    firstName: "John",
    lastName: "Smith",
    name: "Jhon Smith",
    netId: "jsl20001",
    course: "CS4545.004",
    courseName: "CS project",
    position: "Computer Science Grader-Graduation",
    matchCount: 3,
    matchingKeyword: {
      skill: "python",
      major: "Computer Science",
      experience: "2 years",
    },
    status: "Assigned",
    date: "2024-11-07",
    graduationDate: "2026-05-17",
    major: "Computer Science",
    school: "The University of Texas at Dallas",
    year: "masters",
  });

  const [selectedSemester, setSelectedSemester] = useState(null);

  // toggles between normal mode and delete mode; selection is resetted after switching to normal mode
  const toggleDeleteMode = () => {
    setDeleteMode(!deleteMode);
    setSelected([]);
  };
  // when user checks/unchecks a checkbox, id is either added or removed from selected
  // note: if entries have the same candidate id's, selecting one will select the other(s)
  const handleCheckboxChange = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
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

  const handleCancelAssignment = () => {
    setData((prevData) =>
      prevData.map((item) =>
        selected.includes(item.candidateID)
          ? {
              ...item,
              number: null,
              name: null,
              section: null,
            }
          : item
      )
    );
    setDeleteMode(false);
    setSelected([]);
  };

  // ADD CANDIDATE FUNCTIONALITY
  // states used to add candidate
  const [showModal, setShowModal] = useState(false);
  const [newCandidate, setNewCandidate] = useState({
    candidateID: "",
    name: "",
    number: "",
    class: "CS",
    section: "",
    professor: "",
  });

  // update newCandidate when inputting
  const handleInputChange = (event) => {
    setNewCandidate((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
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

  // when add button is clicked,
  const handleAddCandidate = () => {
    if (!newCandidate.candidateID || !newCandidate.candidateName) {
      alert("Candidate ID and Name are required!"); // prevents adding if
      return;
    }

    if (inputValue?.profname === "John") {
      alert("Professor does not exist or already all graders are assigned"); // prevents adding if
      return;
    }

    const newCandiwithProf = {
      candidateID: "TEST",
      candidateName: inputValue?.profname ? "Assigned Data" : "NEW Candidate",
      number: inputValue?.profname ? "222" : null,
      name: "CS",
      section: "222",
      professor: inputValue?.profname ? inputValue?.profname : "",
    };

    setData((prevData) => [...prevData, newCandiwithProf]); // adds new candidates correctly to form
    setShowModal(false);
    setNewCandidate({
      candidateID: "",
      candidateName: "",
      number: "",
      name: "CS",
      section: "",
      professor: "",
    });

    setInputValue({
      profname: "",
      coursename: "",
    });
  };

  // when add button is clicked,
  // const handleAddCandidate = () => {
  //   if (!newCandidate.candidateID || !newCandidate.name) {
  //     alert("Candidate ID and Name are required!"); // prevents adding if
  //     return;
  //   }

  //   setData((prevData) => [...prevData, newCandidate]); // adds new candidates correctly to form
  //   setShowModal(false);
  //   setNewCandidate({
  //     candidateID: "",
  //     name: "",
  //     number: "",
  //     class: "CS",
  //     section: "",
  //     professor: ""
  //   });
  // };

  // export to Excel
  const exportToExcel = (exportData, filename) => {
    let dataToExport = exportData;

    if (filename === "Modified_Assignment_Data") {
      dataToExport = exportData.filter((item) => item.number === null);
    }

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(blob, `${filename}.xlsx`);
  };

  const handleExportAll = () => exportToExcel(data, "All_Assignment_Data");
  const handleExportModified = () =>
    exportToExcel(data, "Modified_Assignment_Data");
  const handleExportFiltered = () =>
    exportToExcel(filteredData, "Filtered_Data");

  return (
    <Layout>
      <Title>Candidate Management</Title>
      <BoxContainer>
        <Box>
          <HeaderContainer>
            <ButtonContainer>
              <DeleteButton deleteMode={deleteMode} onClick={toggleDeleteMode}>
                {" "}
                {/*when button is clicked, toggle between modes*/}
                {deleteMode ? "Cancel" : "Delete"}{" "}
                {/*if deleteMode, then Cancel, else Delete Candidate*/}
              </DeleteButton>
              {/*if deleteMode, then display Confirm, and when clicked Deleted*/}
              {deleteMode && (
                <DeleteButtonWrap>
                  <DeleteButton onClick={handleDelete}>
                    Delete Candidate
                  </DeleteButton>
                  <DeleteButton onClick={handleCancelAssignment}>
                    Cancel Assignment
                  </DeleteButton>
                </DeleteButtonWrap>
              )}
              <HeaderText>Select Term:</HeaderText>
              <SelectBox
                placeholder="Select Term"
                width={"180px"}
                value={selectedSemester}
                onChange={setSelectedSemester}
                options={[
                  { id: "Spring2025", name: "Spring2025" },
                  { id: "Fall2024", name: "Fall2024" },
                  { id: "Spring2024", name: "Spring2024" },
                ]}
              />
            </ButtonContainer>

            {/* SelectBox(move to previous candidates) */}
            <ButtonContainer></ButtonContainer>
            <RightConatiner>
              <FilterContainer>
                <HeaderText>Filter:</HeaderText>
                <FilterDropdown
                  onChange={handleColumnChange}
                  value={selectedColumn}
                >
                  <option value="">Select Column</option>
                  <option value="candidateID">Candidate ID</option>
                  <option value="name">Candidate Name</option>
                  <option value="number">Candidate Number</option>
                  <option value="professor">Professor Name</option>
                </FilterDropdown>
                <FilterInput
                  type="text"
                  value={filterValue}
                  onChange={handleFilterValueChange}
                  placeholder="Enter filter value"
                />
              </FilterContainer>
              <SearchContainer>
                <HeaderText>Search:</HeaderText>
                <SearchBox
                  type="text"
                  placeholder="Search..."
                  value={searchTerm} // bind input to searchTerm
                  onChange={handleSearchChange} // state updated everytime user inputs
                />
              </SearchContainer>
              {/* Excel Download Button */}
              <DropdownButton
                label="Export"
                options={[
                  {
                    label: "Export Assigments (XLSX)",
                    onClick: handleExportAll,
                  },
                  {
                    label: "Export Modified Assignment (XLSX)",
                    onClick: handleExportModified,
                  },
                  {
                    label: "Export Filtered (XLSX)",
                    onClick: handleExportFiltered,
                  },
                ]}
              />
              <AddButton onClick={() => setShowModal(true)}>
                + Add Candidate
              </AddButton>
            </RightConatiner>
          </HeaderContainer>
          <ColumnTitle>
            {deleteMode && <ColumnTitleText>Select</ColumnTitleText>}{" "}
            {/*if deleteMode, then display column for Select*/}
            <ColumnTitleText onClick={() => handleSort("candidateID")}>
              Candidate ID {getSortArrow("candidateID")}
            </ColumnTitleText>
            <ColumnTitleText onClick={() => handleSort("name")}>
              Candidate Name {getSortArrow("candidateName")}
            </ColumnTitleText>
            <ColumnTitleText onClick={() => handleSort("number")}>
              Candidate Number {getSortArrow("number")}
            </ColumnTitleText>
            <ColumnTitleText onClick={() => handleSort("professor")}>
              Professor Name {getSortArrow("professor")}
            </ColumnTitleText>
            <ColumnTitleText>Re-Assignment</ColumnTitleText>
          </ColumnTitle>
          {/*displays rows of table by iterating through data array*/}
          {filteredData.map((row, index) => (
            <Row key={index}>
              {deleteMode && (
                <Column>
                  <input
                    type="checkbox"
                    checked={selected.includes(
                      `${row.number}-${row.name}-${row.section}`
                    )}
                    onChange={() => handleCheckboxChange(row.id)}
                  />
                </Column>
              )}
              <Column>{row.candidateID || "N/A"}</Column>
              <Column onClick={() => setAssignmentModalOpen(true)}>
                {row.name || "N/A"}
              </Column>
              <Column>
                {row.number ? (
                  <TooltipContainer>
                    {row.number}
                    <Tooltip className="tooltip">
                      {row.class ?? "N/A"} {row.number}.{row.section ?? "N/A"}
                    </Tooltip>
                  </TooltipContainer>
                ) : (
                  "N/A"
                )}
              </Column>
              <Column>{row.professor || "N/A"}</Column>
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
      <FileUploadModal
        open={showModal}
        onClose={() => setShowModal(false)}
        handleSubmit={handleAddCandidate}
        singleUpload={"Resume"}
        title={"Add Candidate"}
        inputValue={inputValue}
        setInputValue={setInputValue}
      />
      <AssignmentDetailModal
        open={assignmentModalOpen}
        onClose={() => setAssignmentModalOpen(false)}
        title={"Grader Assignment Detail"}
        assignmentInfo={assignmentInfo}
      />
      {/* {showModal && (
        <ModalOverlay>
          <ModalContent>
            <ModalTitle>Add New Candidate</ModalTitle>
            <Input
              name="candidateID"
              placeholder="Candidate ID"
              value={newCandidate.candidateID}
              onChange={handleInputChange}
            />
            <Input
              name="candidateName"
              placeholder="Candidate Name"
              value={newCandidate.name}
              onChange={handleInputChange} 
            />
            <Input
              name="number"
              placeholder="Course Number"
              value={newCandidate.number}
              onChange={handleInputChange}
            />
            <Input
              name="section"
              placeholder="Section"
              value={newCandidate.section}
              onChange={handleInputChange}
            />
            <Input
              name="professor"
              placeholder="Professor Name"
              value={newCandidate.professor}
              onChange={handleInputChange}
            />
            <ModalButtonContainer>
              <ModalButton onClick={handleAddCandidate}>Add</ModalButton>
              <ModalButton onClick={() => setShowModal(false)}>
                Cancel
              </ModalButton>
            </ModalButtonContainer>
          </ModalContent>
        </ModalOverlay>
      )} */}
    </Layout>
  );
};

export default GraderAssignment;

/*
Delete Candidate Process:
  - There are 2 modes, normal mode and delete mode. You switched between by the Delete Candidate and Cancel button
    - Normal Mode: Default, you just see the list of candidates
    - Delete Mode: Checkboxes appear next to the each candidate entry 
      - Checking Box: candidate id is added to selected array
      - Unchecking Box: candidate id is removed from selected
    - Confirm Deletion: When user confirms, candidates ids in slected are removed from data array
*/
