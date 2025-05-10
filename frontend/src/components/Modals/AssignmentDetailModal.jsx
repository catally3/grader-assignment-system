import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { format } from "date-fns";
import Modal, {
  CustomShadowButtonWrap,
  ModalContainer,
  ModalText,
} from "../Common/Modal";
import ModalHeader from "../Common/ModalHeader";
import InfoSection from "../InfoSection";
import MatchingResults from "../MatchingResults";
import DocumentViewer from "../DocumentViewer";
import ActionButtons from "../ActionButtons";
import CloseIcon from "../../assets/icons/icon_close.svg";
import SlideOutModal from "../Common/SlideOutModal";

const AssignmentDetailModal = ({ open, onClose, title, assignmentInfo }) => {
  const resumePath = `/resumes/${assignmentInfo?.resume_path?.split("/").pop()}`;
  const pdfUrl = resumePath ? `${resumePath}` : null;

  let skillsCount = assignmentInfo?.skills?.length;

  useEffect(() => {
    document.body.style = `overflow: hidden`;
    return () => (document.body.style = `overflow: auto`);
  }, []);

  console.log("assignmentInfo", assignmentInfo);

  return (
    <SlideOutModal open={open} onClose={onClose}>
      <ModalContainer>
        <ModalHeader
          title="Grader Assignment Detail"
          closeIconSrc={CloseIcon}
          onClose={onClose}
        />
        <ModalContent>
          <ApplicationInfoSection>
            <InfoSection.Field
              label="Application ID"
              value={assignmentInfo?.student_id || "N/A"}
            />
            <InfoSection.Field
              label="Application Date"
              value={
                assignmentInfo?.createdAt
                  ? format(new Date(assignmentInfo.createdAt), "yyyy-MM-dd")
                  : "N/A"
              }
            />
            <InfoSection.Field
              label="Status"
              value={assignmentInfo?.assignment ? "Assigned" : "In progress"}
              isStatus
            />
          </ApplicationInfoSection>
          <PositionDetailsSection>
            <InfoSection.Field
              label="Matched Course"
              value={
                assignmentInfo?.course_number
                  ? `${assignmentInfo?.course_number} - ${assignmentInfo?.course_name}`
                  : "N/A"
              }
            />
            <InfoSection.Field
              label="Professor Name"
              value={assignmentInfo?.professor_name || "N/A"}
            />
          </PositionDetailsSection>
          <PersonalInfoSection>
            <InfoSection.Field
              label="Name"
              value={assignmentInfo?.applicant_name || "N/A"}
            />
            {/* <InfoSection.Field
              label="Last Name"
              value={assignmentInfo?.lastName}
            /> */}
          </PersonalInfoSection>
          <StudentInfoSection>
            <InfoSection.Field
              label="Student ID"
              value={assignmentInfo?.student_id || "N/A"}
            />
            <InfoSection.Field
              label="Student Email"
              value={assignmentInfo?.applicant_email || "N/A"}
            />
          </StudentInfoSection>
          <SchoolInfoSection>
            <InfoSection.Field
              label="School Year"
              value={assignmentInfo?.school_year || "N/A"}
            />
            <InfoSection.Field
              label="Graduation Date"
              value={assignmentInfo?.graduation_date || "N/A"}
            />
          </SchoolInfoSection>
          <SchoolMajorSection>
            <InfoSection.Field
              label="School"
              value={assignmentInfo?.school || "N/A"}
            />
            <InfoSection.Field
              label="Major"
              value={assignmentInfo?.major || "N/A"}
            />
          </SchoolMajorSection>
          <MatchingResults
            matchCount={skillsCount ? skillsCount : 0}
            skills={assignmentInfo?.skills ? assignmentInfo?.skills : []}
          />
          {pdfUrl ? (
            <DocumentViewer
              pdfUrl={pdfUrl}
              major={assignmentInfo?.major || null}
              skills={assignmentInfo?.skills || null}
              experience={assignmentInfo?.experience || null}
            />
          ) : (
            <div style={{ padding: "20px", color: "#999" }}>
              No resume available for this applicant.
            </div>
          )}
        </ModalContent>
      </ModalContainer>
    </SlideOutModal>
  );
};

const Container = styled.div`
  border-radius: 12px;
  background-color: #fff;
  max-width: 925px;
`;

const ModalContent = styled.div`
  margin-top: 16px;
  width: 100%;
  margin-top: 40px;
  font-size: small;

  /* max-height: 70vh; */

  overflow-y: hidden;
  overflow: scroll;
`;

const ApplicationInfoSection = styled.section`
  display: flex;
  width: 100%;
  align-items: flex-start;
  gap: 8px;
  justify-content: flex-start;
  flex-wrap: wrap;

  padding-bottom: 20px;
  border-bottom: 1px solid var(--Secondary-Gray-2, #e5e5e5);
`;

const PositionDetailsSection = styled.section`
  display: flex;
  margin-top: 20px;
  width: 100%;
  align-items: flex-start;
  gap: 8px;
  color: #6f727a;
  justify-content: flex-start;
  flex-wrap: wrap;

  padding-bottom: 20px;
  border-bottom: 1px solid var(--Secondary-Gray-2, #e5e5e5);
`;

const PersonalInfoSection = styled.section`
  display: flex;
  margin-top: 20px;
  width: 100%;
  align-items: flex-start;
  gap: 8px;
  color: #6f727a;
  justify-content: flex-start;
  flex-wrap: wrap;
`;

const StudentInfoSection = styled.section`
  display: flex;
  margin-top: 20px;
  width: 100%;
  align-items: flex-start;
  gap: 8px;
  color: #6f727a;
  justify-content: flex-start;
  flex-wrap: wrap;
`;

const SchoolInfoSection = styled.section`
  display: flex;
  margin-top: 20px;
  width: 100%;
  align-items: flex-start;
  gap: 8px;
  color: #6f727a;
  justify-content: flex-start;
  flex-wrap: wrap;
`;

const SchoolMajorSection = styled.section`
  display: flex;
  margin-top: 20px;
  width: 100%;
  align-items: flex-start;
  gap: 8px;
  color: #6f727a;
  justify-content: flex-start;
  flex-wrap: wrap;
`;

const BottomSection = styled.div`
  width: 100%;
  padding: 20px 40px 24px;
  box-shadow: 0 -6px 16px 0 rgba(0, 0, 0, 0.06);
  background-color: #fff;
`;

export default AssignmentDetailModal;
