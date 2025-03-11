import React, { useState } from "react";
import styled from "@emotion/styled";

import Layout from "../../layouts/Layout.js";
import Pill from "../../components/Common/Pill.jsx";
import TableHeader from "../../components/Common/TableHeader.jsx";
import TableRow from "../../components/Common/TableRow.jsx";
import AssignmentDetailModal from "../../components/AssignmentDetailModal.jsx";

import { applicationlist } from "../../utils/metadata.js";

const Title = styled.h2`
  margin-bottom: 20px;
`;

const ContentWrapper = styled.div`
  flex-shrink: 1;
  flex: 1;
  margin-top: 32px;
  background-color: #ffffff;
  box-shadow:;
  padding: 40px 30px;
  border-radius: 15px;
  box-shadow: 0 -6px 16px 0 rgba(0, 0, 0, 0.06);
`;

const Setting = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [assignmentInfo, setAssignmentInfo] = useState({});

  return (
    <Layout>
      <Title>Applicants Management</Title>
      <ContentWrapper>
        <TableHeader />
        {applicationlist.map((assignment, index) => {
          return (
            <TableRow
              key={index}
              assignment={assignment}
              setModalOpen={setModalOpen}
              setAssignmentInfo={setAssignmentInfo}
            />
          );
        })}
      </ContentWrapper>
      <AssignmentDetailModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={"Grader Assignment Detail"}
        assignmentInfo={assignmentInfo}
      />
    </Layout>
  );
};

export default Setting;
