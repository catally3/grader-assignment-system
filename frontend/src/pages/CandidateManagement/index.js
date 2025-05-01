import styled from "@emotion/styled";
import { useState, useEffect } from "react"; // delete, add, search states
import Layout from "../../layouts/Layout.js";
import DropdownButton from "../../components/Common/DropdownButton.jsx";
import SelectBox from "../../components/Common/SelectBox.jsx";
import SortIcon from "../../assets/icons/icon_sort.svg";
import { ExcelExportButton } from "../../components/ExcelExportButton.jsx";
import CourseManagementModal from "../../components/Modals/CourseManagementModal.jsx";
import AddCandidateModal from "../../components/Modals/AddCandidateModal.jsx";
import AssignmentDetailModal from "../../components/Modals/AssignmentDetailModal.jsx";
import { uploadMode } from "../../utils/type.js";

import {
  getApplicants,
  createApplicants,
  deleteApplicant,
} from "../../api/applicants.js";
import { deleteAssignment } from "../../api/assignments.js";
import { uploadResume, uploadResumeZip } from "../../api/upload.js";
import Pagination from "../../components/Common/Pagination.jsx";

// frontend/Applicants Management
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

const TableWrapper = styled.div`
  overflow-y: auto;
  flex: 1;
`;

const initCandidate = {
  student_id: "",
  applicant_name: "",
  course_name: "",
  course_number: "",
  course_section: "",
  professor_name: "",
  document_id: "",
};

const CandidateManagement = () => {
  // data
  const [data, setData] = useState([]);
  const [newCandidate, setNewCandidate] = useState(initCandidate);
  const [selectedSemester, setSelectedSemester] = useState(null);

  // table top sorting and searching state
  const [selectedColumn, setSelectedColumn] = useState(""); // selectedColumn stores user selected column to filter
  const [filterValue, setFilterValue] = useState(""); // filterValue stores user inputed term to filter
  const [searchTerm, setSearchTerm] = useState(""); // searchTerm stores the term entered by user to search
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" }); // sortConfig stores sorting state, key (column) and direction

  // delete state
  const [deleteMode, setDeleteMode] = useState(false); // deleteMode: true or false (normalMode)
  const [selectedIds, setSelectedIds] = useState([]); // selected stores the candidateIDs chosen to be deleted

  // reassign course state
  const [selectedCourseData, setSelectedCourseData] = useState(null); // selectedCourseData stores course data for selcted candidate

  // modal state
  const [reassignModalOpen, setReassignModalOpen] = useState(false); // reassign modal
  const [applicantInfoModalOpen, setApplicantInfoModalOpen] = useState(false); // applicantInfoModal
  const [showModal, setShowModal] = useState(false);

  const [selectedApplicantInfo, setSelectedApplicantInfo] = useState({});
  const [uploadType, setUploadType] = useState("");

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

  // toggles deleteMode and clears any selected candidates between toggles
  const toggleDeleteMode = () => {
    setDeleteMode(!deleteMode);
    setSelectedIds([]);
  };

  // adds/removes candidateIDs from selected when checkboxes are toggles
  const handleCheckboxChange = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // open the reassignmnet modal for the selected course
  const handleReassign = (course) => {
    setSelectedCourseData(course);
    setReassignModalOpen(true);
  };

  // update newCandidate when inputting
  const handleInputChange = (event) => {
    setNewCandidate((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  // Handle API
  // create new candidate
  const handleAddCandidate = async () => {
    console.log(newCandidate);

    if (uploadType === uploadType.BULK) {
      try {
        const result = await uploadResumeZip(newCandidate.file?.[0]);
        console.log(result);
      } catch (error) {
        console.error("Failed to add candidate:", error);
        alert("Error adding candidate");
      }
    } else {
      try {
        const result = await uploadResume(
          newCandidate.file?.[0],
          selectedSemester
        );
        console.log(result);
      } catch (error) {
        console.error("Failed to add candidate:", error);
        alert("Error adding candidate");
      }
    }
    setData(updatedData);
    setShowModal(false);

    // try {
    //   const addedApplicants = await createApplicants(newCandidate);
    //   const updatedData = await getApplicants(); // new version
    //   setData(updatedData);
    //   setShowModal(false);
    // } catch (error) {
    //   console.error("Failed to add candidate:", error);
    //   alert("Error adding candidate");
    // }
  };

  // delete Applicant in DB
  const handleDelete = async () => {
    try {
      for (const id of selectedIds) {
        await deleteApplicant(id);
      }
      const updatedData = await getApplicants(); // recent version of course list
      setData(updatedData);
      setDeleteMode(false);
      setSelectedIds([]);
    } catch (error) {
      console.error("Error deleting courses:", error);
      alert("Failed to delete courses");
    }
  };

  //cancel Assignment
  const handleCancelAssignment = async () => {
    try {
      for (const id of selectedIds) {
        await deleteAssignment(id);
      }
      const updatedData = await getApplicants(); // recent version of course list
      setData(updatedData);
      setDeleteMode(false);
      setSelectedIds([]);
    } catch (error) {
      console.error("Error deleting courses:", error);
      alert("Failed to delete courses");
    }
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
    const fetchData = async () => {
      const data = await getApplicants();
      setData(data);
      console.log(data);
    };

    fetchData();
  }, []);

  return (
    <Layout>
      <Title>Candidate Management</Title>
      <BoxContainer>
        <Box>
          <HeaderContainer>
            <ButtonContainer>
              <DeleteButton deleteMode={deleteMode} onClick={toggleDeleteMode}>
                {deleteMode ? "Cancel" : "Delete Candidate"}
              </DeleteButton>
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
            <ButtonContainer></ButtonContainer>
            <RightConatiner>
              <FilterContainer>
                <HeaderText>Filter:</HeaderText>
                <FilterDropdown
                  onChange={handleColumnChange}
                  value={selectedColumn}
                >
                  <option value="">Select Column</option>
                  <option value="student_id">Candidate ID</option>
                  <option value="applicant_name">Candidate Name</option>
                  <option value="course_number">Candidate Number</option>
                  <option value="professor_name">Professor Name</option>
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
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </SearchContainer>
              <ExcelExportButton data={data} filteredData={filteredData} />
              <DropdownButton
                label="+ Add Candidate"
                options={[
                  {
                    label: "Add One by One",
                    onClick: () => {
                      setUploadType(uploadMode.SINGLE);
                      setShowModal(true);
                    },
                  },
                  {
                    label: "Bulk File Upload",
                    onClick: () => {
                      setUploadType(uploadMode.BULK);
                      setShowModal(true);
                    },
                  },
                ]}
                style={{
                  color: "#ffffff",
                  backgroundColor: "rgba(248, 126, 3, 1)",
                  display: "flex",
                  padding: "10px",
                  height: "35px",
                }}
              />
            </RightConatiner>
          </HeaderContainer>
          <ColumnTitle>
            {deleteMode && <ColumnTitleText>Select</ColumnTitleText>}{" "}
            <ColumnTitleText onClick={() => handleSort("student_id")}>
              Candidate ID {getSortArrow("student_id")}
            </ColumnTitleText>
            <ColumnTitleText onClick={() => handleSort("applicant_name")}>
              Candidate Name {getSortArrow("applicant_name")}
            </ColumnTitleText>
            <ColumnTitleText onClick={() => handleSort("course_number")}>
              Course Number {getSortArrow("course_number")}
            </ColumnTitleText>
            <ColumnTitleText onClick={() => handleSort("professor_name")}>
              Professor Name {getSortArrow("professor_name")}
            </ColumnTitleText>
            <ColumnTitleText>Re-Assignment</ColumnTitleText>
          </ColumnTitle>
          <TableWrapper>
            {paginatedData.map((row, index) => (
              <Row key={index}>
                {deleteMode && (
                  <Column>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(row?.student_id)}
                      onChange={() => handleCheckboxChange(row?.student_id)}
                    />
                  </Column>
                )}
                <Column>{row.student_id || "N/A"}</Column>
                <Column
                  onClick={() => {
                    setSelectedApplicantInfo(row);
                    setApplicantInfoModalOpen(true);
                  }}
                >
                  {row.applicant_name || "N/A"}
                </Column>
                <Column>
                  {row.course_number ? (
                    <TooltipContainer>
                      {row.course_number}
                      <Tooltip className="tooltip">
                        {row.course_name ?? "N/A"} {row.course_number}.
                        {row.course_section ?? "N/A"}
                      </Tooltip>
                    </TooltipContainer>
                  ) : (
                    "N/A"
                  )}
                </Column>
                <Column>{row.professor_name || "N/A"}</Column>
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
      <AddCandidateModal
        open={showModal}
        onClose={() => {
          setShowModal(false);
          setNewCandidate({
            student_id: "",
            applicant_name: "",
            course_name: "",
            course_number: "",
            course_section: "",
            professor_name: "",
            file: "",
          });
          setUploadType("");
        }}
        handleSubmit={handleAddCandidate}
        title={
          uploadType === uploadMode.SINGLE
            ? "Add Candidate"
            : "Add Candidates(Bulk File Upload)"
        }
        inputValue={newCandidate}
        setInputValue={setNewCandidate}
        uploadType={uploadType}
      />
      <AssignmentDetailModal
        open={applicantInfoModalOpen}
        onClose={() => setApplicantInfoModalOpen(false)}
        title={"Grader Assignment Detail"}
        assignmentInfo={selectedApplicantInfo}
      />
      <CourseManagementModal
        open={reassignModalOpen}
        onClose={() => setReassignModalOpen(false)}
        courseData={selectedCourseData}
        allCourses={filteredData}
      />
    </Layout>
  );
};

export default CandidateManagement;
