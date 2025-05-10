// pages/Course Management
import styled from "@emotion/styled";
import Layout from "../../layouts/Layout.js";
import React, { useState, useEffect } from "react";
import FileUpload from "../../components/Common/FileUpload.jsx";
import ReassignmentModal from "../../components/Modals/ReassignmentModal.jsx";
import SortIcon from "../../assets/icons/icon_sort.svg";
import AssignmentDetailModal from "../../components/Modals/AssignmentDetailModal.jsx";
import { ExcelExportButton } from "../../components/ExcelExportButton.jsx";
import DropdownButton from "../../components/Common/DropdownButton.jsx";
import AddCourseModal from "../../components/Modals/AddCourseModal.jsx";
import { uploadMode } from "../../utils/type.js";
import { deleteCourse, getCourses, createCourse } from "../../api/courses.js";
import Pagination from "../../components/Common/Pagination.jsx";
import SelectBox from "../../components/Common/SelectBox.jsx";
import { uploadCandidateList, uploadCourseList } from "../../api/upload.js";
import { getApplicants } from "../../api/applicants.js";

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

const TableWrapper = styled.div`
  overflow-y: auto;
  flex: 1;
`;

const RightConatiner = styled.div`
  display: flex;
  gap: 16px;
`;

const initCourse = {
  semester: "Spring 2025",
  professor_name: "",
  professor_email: "",
  course_number: "",
  course_section: "",
  course_name: "",
  number_of_graders: "",
  keywords: [],
};

const CourseManagement = () => {
  // data
  const [data, setData] = useState([]);
  const [newCourse, setNewCourse] = useState(initCourse);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [allCandidates, setAllCandidats] = useState([]);

  // table top sorting and searching state
  const [selectedColumn, setSelectedColumn] = useState(""); // selectedColumn stores user selected column to filter
  const [filterValue, setFilterValue] = useState(""); // filterValue stores user inputed term to filter
  const [searchTerm, setSearchTerm] = useState(""); // searchTerm stores the term entered by user to search
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" }); // sortConfig stores sorting state, key (column) and direction

  // delete state
  const [deleteMode, setDeleteMode] = useState(false); // deleteMode: true or false (normalMode)
  const [selectedIds, setSelectedIds] = useState([]); // selected stores the Id chosen to be deleted

  // reassign
  const [selectedCourseData, setSelectedCourseData] = useState(null); // selectedCourseData stores course data for selcted candidate

  // modal state
  const [isModalOpen, setIsModalOpen] = useState(false); // isModalOpen: true or false
  const [selectedRow, setSelectedRow] = useState(null); // DISPLAY CANDIDATES DROPWDOWM
  const [showModal, setShowModal] = useState(false);
  const [uploadType, setUploadType] = useState("");

  // pagination
  const [currentPage, setCurrentPage] = useState(1);

  // get courses data and load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCourses();
        setData(data);
        console.log(data);
      } catch (error) {
        console.error("Failed to load courses:", error);
        setData([]);
      }
    };

    fetchData();
  }, []);

  // get candidate list data and load
  useEffect(() => {
    const fetchCandidateData = async () => {
      try {
        const data = await getApplicants();
        setAllCandidats(data);
      } catch (error) {
        console.error("Failed to load courses:", error);
        setAllCandidats([]);
      }
    };

    fetchCandidateData();
  }, []);

  // File upload
  const handleFilesChange = (tab, newFiles) => {
    setUploadedFiles((prev) => ({
      ...prev,
      [tab]: newFiles,
    }));
    alert("course is added");
  };

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
  // adds/removes Id from selected when checkboxes are toggles
  const handleCheckboxChange = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleDelete = async () => {
    try {
      for (const id of selectedIds) {
        await deleteCourse(id);
      }
      const updatedData = await getCourses(); // recent version of course list
      setData(updatedData);
      setDeleteMode(false);
      setSelectedIds([]);
    } catch (error) {
      console.error("Error deleting courses:", error);
      alert("Failed to delete courses");
    }
  };

  // open the reassignmnet modal for the selected course
  const handleReassign = (course) => {
    setSelectedCourseData(course);
    setIsModalOpen(true);
  };
  // close the reassignment model for the selected course
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCourseData(null);
  };

  // handler add new course
  const handleAddCourse = async () => {
    // single add course with input field
    if (uploadType === uploadMode.SINGLE) {
      const newCourseExists = data.some(
        (v) =>
          v.course_number === newCourse.course_number &&
          v.course_number.includes(newCourse.course_number)
      );

      const professorExists = data.some(
        (v) =>
          v.professor_name === newCourse.professor_name &&
          v.professor_name !== null
      );

      const courseExists = data.some(
        (v) =>
          v.course_number === newCourse.course_number &&
          v.course_number !== null
      );

      if (!newCourse.course_name) {
        alert("Name is required!");
        return;
      }

      if (newCourseExists) {
        alert("Course already has an assigned!");
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

      try {
        const addedCourse = await createCourse(newCourse);
        const updatedData = await getCourses(); // new version
        setData(updatedData);
        setShowModal(false);
        setNewCourse(initCourse);
      } catch (error) {
        console.error("Failed to add course:", error);
        alert("Error adding course");
      }
      return;
    } else {
      // bulk upload with excel file
      if (newCourse?.file?.[0]) {
        try {
          const result = await uploadCourseList(newCourse?.file?.[0]);
          const updatedData = await getCourses(); // new version
          setData(updatedData);
          setShowModal(false);
          setNewCourse(initCourse);
        } catch (error) {
          console.error("Failed to add courses:", error);
          alert("Error adding courses");
        }
      }
    }
  };

  // pagination
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // handler pagenation
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // if searing update to pagenumber 1
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterValue, selectedColumn]);

  return (
    <Layout>
      <Title>Course Management</Title>
      <BoxContainer>
        <Box>
          <HeaderContainer>
            <ButtonContainer>
              <DeleteButton onClick={toggleDeleteMode}>
                {deleteMode ? "Cancel" : "Delete Course"}
              </DeleteButton>
              {deleteMode && (
                <DeleteButton onClick={handleDelete}>
                  Confirm Delete
                </DeleteButton>
              )}
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
                  <option value="course_number">Course Number</option>
                  <option value="course_name">Course Name</option>
                  <option value="number_of_graders">Number of Graders</option>
                  <option value="professor_name">Professor Name</option>
                  <option value="assigned">Assigned Candidate</option>
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
                <DropdownButton
                  label="+ Add Course"
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
              </FilterContainer>
            </RightConatiner>
          </HeaderContainer>
          <ColumnTitle>
            {deleteMode && <ColumnTitleText>Select</ColumnTitleText>}
            <ColumnTitleText onClick={() => handleSort("course_number")}>
              Course Number {getSortArrow("course_number")}
            </ColumnTitleText>
            <ColumnTitleText onClick={() => handleSort("course_name")}>
              Course Name {getSortArrow("course_name")}
            </ColumnTitleText>
            <ColumnTitleText onClick={() => handleSort("number_of_graders")}>
              Number of Graders {getSortArrow("number_of_graders")}
            </ColumnTitleText>
            <ColumnTitleText onClick={() => handleSort("professor_name")}>
              Professor Name {getSortArrow("professor_name")}
            </ColumnTitleText>
            <ColumnTitleText onClick={() => handleSort("assigned")}>
              Assigned Candidate {getSortArrow("assigned")}
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
                      checked={selectedIds?.includes(row.id)}
                      onChange={() => handleCheckboxChange(row.id)}
                    />
                  </Column>
                )}
                <Column>
                  {row?.course_number
                    ? `${row?.course_number} - ${row?.course_section}`
                    : "N/A"}
                </Column>
                <Column>{row?.course_name || "N/A"}</Column>
                <Column>{row?.number_of_graders || "N/A"}</Column>
                <Column>{row?.professor_name || "N/A"}</Column>
                <Column>
                  {/* To be updated */}
                  <span></span>
                </Column>
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
            onPageChange={(page) => {
              console.log("page change:", page);
              setCurrentPage(page);
            }}
          />
        </Box>
      </BoxContainer>
      <AddCourseModal
        open={showModal}
        onClose={() => {
          setShowModal(false);
          setNewCourse({
            semester: "Spring 2025",
            professor_name: "",
            professor_email: "",
            course_number: "",
            course_section: "",
            course_name: "",
            number_of_graders: "",
            keywords: [],
            file: "",
          });
          setUploadType("");
        }}
        handleSubmit={handleAddCourse}
        title={
          uploadType === uploadMode.SINGLE
            ? "Add Course"
            : "Add Courses (Bulk File Upload)"
        }
        inputValue={newCourse}
        setInputValue={setNewCourse}
        uploadType={uploadType}
      />
      <ReassignmentModal
        open={isModalOpen}
        onClose={handleCloseModal}
        selectedCourseData={selectedCourseData}
        allCandidates={allCandidates}
      />
    </Layout>
  );
};
export default CourseManagement;
