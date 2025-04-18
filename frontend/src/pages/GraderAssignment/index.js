import styled from "@emotion/styled";
import Layout from "../../layouts/Layout.js";
import { useState, useEffect } from "react"; // delete, add, search states
import CourseManagementModal from "../../components/Modals/CourseManagementModal.jsx";
import AssignmentDetailModal from "../../components/Modals/AssignmentDetailModal.jsx";
import DropdownButton from "../../components/Common/DropdownButton.jsx";
import SelectBox from "../../components/Common/SelectBox.jsx";
import SortIcon from "../../assets/icons/icon_sort.svg";
import AddCandidateModal from "../../components/Modals/AddCandidateModal.jsx";
import { ExcelExportButton } from "../../components/ExcelExportButton.jsx";
import { getCandidates } from "../../api/candidates.js";

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
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getCandidates();
      // setCandidates(data);
      console.log(data);
    };

    fetchData();
  }, []);

  const [data, setData] = useState([
    {
      candidateID: "12341",
      name: "Anthony Smith (jxs190043)",
      number: "4302",
      class: "CS",
      section: "509",
      professor: "Herlin Villareal",
      updated: true,
    },
    {
      candidateID: null,
      name: "Gaby Doe (jxd190043)",
      number: "4301",
      class: "CS",
      section: "502",
      professor: "Vanessa Ramirez",
      updated: false,
    },
    {
      candidateID: "12345",
      name: "May Lee (jxs190042)",
      number: "4306",
      class: "CS",
      section: "502",
      professor: null,
      updated: true,
    },
    {
      candidateID: "12343",
      name: "John Alvarez (jxd190042)",
      number: "4303",
      class: "CS",
      section: "504",
      professor: "Caroline Mendez",
      updated: true,
    },
    {
      candidateID: "12349",
      name: null,
      number: null,
      class: "CS",
      section: "501",
      professor: "Jane Smith",
      updated: false,
    },
    {
      candidateID: "12345",
      name: "Beatrice Salazar (gxs190043)",
      number: null,
      class: "CS",
      section: "501",
      professor: "Mary Salazar",
      updated: false,
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

  /******** ADD CANDIDATE FUNCTIONALITY  *******/ // FFFFFFFFFFIIIIIIIIIIIXXXXXXXXXXXXXXX
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
  // ADD CANDIDATE FUNCTIONALITY
  // states used to add candidate
  const [showModal, setShowModal] = useState(false);
  const [newCandidate, setNewCandidate] = useState({
    candidateID: "",
    name: "",
    number: "",
    courseName: "",
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
  // when add button is clicked,
  const handleAddCandidate = () => {
    const newStudentExists = data.some(
      (v) => v.name === newCandidate.name && v.name.includes(newCandidate.name)
    );

    const professorExists = data.some(
      (v) => v.professor === newCandidate.professor && v.professor !== null
    );

    const courseExists = data.some(
      (v) => v.number === newCandidate.number && v.number !== null
    );

    if (!newCandidate.name) {
      alert("Name is required!");
      return;
    }

    if (newStudentExists) {
      alert("Candidate already has an assigned!");
      return;
    }

    if (professorExists) {
      alert("This professor already has an assigned grader!");
      return;
    }

    if (courseExists) {
      alert("This course already has an assigned!");
      return;
    }

    const newCandidateInfo = {
      candidateID: "TEST",
      name: newCandidate?.name,
      number: newCandidate?.professor ? "4548" : null,
      courseName: newCandidate?.professor ? "CS Project" : null,
      section: newCandidate?.professor ? "002" : null,
      professor: newCandidate?.professor ? newCandidate?.professor : null,
    };

    setData((prevData) => [...prevData, newCandidateInfo]); // adds new candidates correctly to form
    setShowModal(false);
    setNewCandidate({
      candidateID: "",
      name: "",
      courseName: "",
      number: "",
      section: "",
      professor: "",
    });
  };

  //Cancel Assignment button
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
                onChange={(val) => setSelectedSemester(val.id)}
                options={[
                  { id: 1, name: "Spring2025" },
                  { id: 2, name: "Fall2024" },
                  { id: 3, name: "Spring2024" },
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
              <ExcelExportButton data={data} filteredData={filteredData} />
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
              Candidate Name {getSortArrow("name")}
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
                    checked={selected.includes(row.candidateID)}
                    onChange={() => handleCheckboxChange(row.candidateID)}
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
      <AddCandidateModal
        open={showModal}
        onClose={() => {
          setShowModal(false);
          setNewCandidate({
            candidateID: "",
            name: "",
            courseName: "",
            number: "",
            section: "",
            professor: "",
          });
        }}
        handleSubmit={handleAddCandidate}
        title={"Add Candidate"}
        inputValue={newCandidate}
        setInputValue={setNewCandidate}
      />
      <AssignmentDetailModal
        open={assignmentModalOpen}
        onClose={() => setAssignmentModalOpen(false)}
        title={"Grader Assignment Detail"}
        assignmentInfo={assignmentInfo}
      />
    </Layout>
  );
};

export default GraderAssignment;
