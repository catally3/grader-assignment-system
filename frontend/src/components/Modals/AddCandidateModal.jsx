import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import Modal, { ModalContainer } from "../Common/Modal";
import ModalHeader from "../Common/ModalHeader";

import Button from "../Common/Button";
import Input from "../../components/Common/Input";
import SelectBox from "../../components/Common/SelectBox";

import ArrowIcon from "../../assets/icons/icon_arrow.svg";
import FileUpload from "../Common/FileUpload";

import { fileType, uploadMode } from "../../utils/type";
import { getCourses } from "../../api/courses";

const AddCandidateModal = ({
  open,
  onClose,
  handleSubmit,
  title,
  inputValue,
  setInputValue,
  uploadType,
}) => {
  const [addCourseMode, setAddCourseMode] = useState(false);
  const [courseOptions, setCourseOptions] = useState([]);

  // File upload
  const handleFilesChange = (tab, newFiles) => {
    setInputValue((prev) => ({
      ...prev,
      file: newFiles,
    }));
  };

  // Modal
  const onCloseAddCandidate = () => {
    onClose();
    setAddCourseMode(false);
  };

  // Load courses on open
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getCourses();
        const formatted = data.map((course) => ({
          id: course.id,
          name: `${course.course_name} (${course.course_number} - ${course.course_section})`,
          course_name: course.course_name,
          course_number: course.course_number,
          course_section: course.course_section,
          professor_name: course.professor_name,
        }));

        setCourseOptions(formatted);
      } catch (err) {
        console.error("Failed to load courses:", err);
      }
    };

    fetchCourses();
  }, []);

  return (
    <Modal open={open} onClose={onCloseAddCandidate}>
      <ModalContainer>
        <ModalContent>
          <ModalHeader
            title={title ?? "Upload files"}
            onClose={onCloseAddCandidate}
          />
          <InputWrapper>
            {uploadType === uploadMode.SINGLE && (
              <>
                <SingleTabItem>Student ID</SingleTabItem>
                <Input
                  placeholder={"Student ID (ex.0000000000)"}
                  inputValue={inputValue?.student_id}
                  maxLength={10}
                  onChange={(e) => {
                    const numeric = e.target.value.replace(/\D/g, ""); // only numeric
                    setInputValue({ ...inputValue, student_id: numeric });
                  }}
                />
                <SingleTabItem>Student Name</SingleTabItem>
                <Input
                  placeholder={"Student Name"}
                  inputValue={inputValue?.applicant_name}
                  onChange={(e) =>
                    setInputValue({
                      ...inputValue,
                      applicant_name: e.target.value,
                    })
                  }
                />
              </>
            )}
            <SingleTabItem>
              {uploadType === uploadMode.SINGLE
                ? "Resume Upload"
                : "Candidates File Upload"}
            </SingleTabItem>
            <FileUpload
              activeTab={"applicants"}
              uploadedFiles={inputValue?.document_id}
              onFilesChange={handleFilesChange}
              singleUpload={true}
              fileType={
                uploadType === uploadMode.SINGLE ? fileType.PDF : fileType.ZIP
              }
            />
            {/* Course Section Toggle */}
            {uploadType === uploadMode.SINGLE && (
              <>
                <SingleTabItem
                  style={{ marginTop: "10px" }}
                  onClick={() => setAddCourseMode(!addCourseMode)}
                >
                  Add Course & Professor <Icon src={ArrowIcon} />
                </SingleTabItem>

                {addCourseMode && (
                  <AddCourseWrap>
                    <SingleTabItem>Course Name</SingleTabItem>
                    <SelectBox
                      placeholder="Select Course"
                      width="100%"
                      value={inputValue.selectedCourse ?? null}
                      onChange={(val) =>
                        setInputValue((prev) => ({
                          ...prev,
                          selectedCourse: val,
                          course_name: val.course_name,
                          course_number: val.course_number,
                          course_section: val.course_section,
                          professor_name: val.professor_name,
                        }))
                      }
                      options={courseOptions}
                    />
                    <SingleTabItem>Professor Name</SingleTabItem>
                    <Input
                      placeholder={"Professor Name"}
                      inputValue={inputValue?.professor_name}
                      onChange={(e) =>
                        setInputValue({
                          ...inputValue,
                          professor_name: e.target.value,
                        })
                      }
                    />
                  </AddCourseWrap>
                )}
              </>
            )}
          </InputWrapper>
        </ModalContent>
        <ButtonContainer>
          <Button
            backgroundColor="white"
            TextColor="rgba(248, 126, 3, 1)"
            Text="Cancel"
            onClick={onClose}
          />
          <Button
            backgroundColor="rgba(248, 126, 3, 1)"
            TextColor="white"
            Text="Add"
            onClick={handleSubmit}
          />
        </ButtonContainer>
      </ModalContainer>
    </Modal>
  );
};

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 420px;
`;

const InputWrapper = styled.div`
  max-width: 100%;
`;

const SingleTabItem = styled.button`
  display: flex;
  width: 100%;
  color: #f87e03;
  width: 180px;
  padding-top: 16px;
  padding-bottom: 8px;
  font-size: Small;
  font-weight: 500;
  text-align: center;
`;

const ButtonContainer = styled.footer`
  display: flex;
  padding: 16px 40px;
  justify-content: flex-end;
  align-items: center;
  gap: 24px;
  background-color: rgb(249, 247, 247);
  width: calc(100% + 80px);
  margin: 20px 0 -30px -40px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
`;

const Icon = styled.img`
  width: 16px;
  height: 16px;
  margin-left: 8px;
`;

const AddCourseWrap = styled.div`
  margin-left: 14px;
`;

export default AddCandidateModal;
