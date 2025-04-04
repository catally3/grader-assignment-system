import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";

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
import DownIcon from "../../assets/icons/icon_download.svg";

const AssignmentDetailModal = ({ open, onClose, title, assignmentInfo }) => {
  const pdfUrl = "/resume_example.pdf";
  const wordToHighlight = "Javascript";

  useEffect(() => {
    document.body.style = `overflow: hidden`;
    return () => (document.body.style = `overflow: auto`);
  }, []);

  return (
    <Modal open={open} onClose={onClose}>
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
              value={assignmentInfo?.id}
            />
            <InfoSection.Field
              label="Application Date"
              value={assignmentInfo?.date}
            />
            <InfoSection.Field
              label="Status"
              value={assignmentInfo?.status}
              isStatus
            />
          </ApplicationInfoSection>
          <PositionDetailsSection>
            <InfoSection.Field
              label="Applied To Name"
              value={assignmentInfo?.position}
            />
            <InfoSection.Field
              label="Matched Course"
              value={`${assignmentInfo?.course} - ${assignmentInfo?.courseName}`}
              value1="CS4545.004-Machine Learning course"
            />
          </PositionDetailsSection>
          <PersonalInfoSection>
            <InfoSection.Field
              label="First Name"
              value={assignmentInfo?.firstName}
            />
            <InfoSection.Field
              label="Last Name"
              value={assignmentInfo?.lastName}
            />
          </PersonalInfoSection>
          <StudentInfoSection>
            <InfoSection.Field label="Student ID" value="jdl20011" />
            <InfoSection.Field
              label="Student Email"
              value={assignmentInfo?.email}
            />
          </StudentInfoSection>
          <SchoolInfoSection>
            <InfoSection.Field
              label="School Year"
              value={assignmentInfo?.year}
            />
            <InfoSection.Field
              label="Graduation Date"
              value={assignmentInfo?.graduationDate}
            />
          </SchoolInfoSection>
          <SchoolMajorSection>
            <InfoSection.Field label="School" value={assignmentInfo?.school} />
            <InfoSection.Field label="Major" value={assignmentInfo?.major} />
          </SchoolMajorSection>
          <MatchingResults
            matchCount={assignmentInfo?.matchCount}
            skills={assignmentInfo?.matchingKeyword}
          />
          <DocumentViewer
            documentIcon={DownIcon}
            pdfUrl={pdfUrl}
            wordToHighlight={wordToHighlight}
            matchingKeyword={assignmentInfo?.matchingKeyword}
            fileName={`resume-${assignmentInfo?.name}(${assignmentInfo?.netId})`}
          />
          <ActionButtons primaryAction={"Assign"} secondaryAction={"Delete"} />
        </ModalContent>
      </ModalContainer>
    </Modal>
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

  max-height: 70vh;

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
