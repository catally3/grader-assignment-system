import React from "react";
import styled from "@emotion/styled";
import StatusBadge from "./Common/StatusBadge";

function Field({ label, value, isStatus = false }) {
  return (
    <FieldContainer>
      <FieldLabel>{label}</FieldLabel>
      {isStatus ? (
        <FieldValue>
          <StatusBadge status={value} />
        </FieldValue>
      ) : (
        <FieldValue>{value}</FieldValue>
      )}
    </FieldContainer>
  );
}

const InfoSection = {
  Field,
};

const FieldContainer = styled.div`
  min-width: 240px;
  color: #6f727a;
  flex-grow: 1;
  flex-shrink: 1;
  width: 222px;
`;

const FieldLabel = styled.label`
  color: #6f727a;
  font-weight: 600;
  line-height: 24px;
  display: block;
`;

const FieldValue = styled.p`
  font-weight: 400;
  margin-top: 8px;
  line-height: 1;
`;

export default InfoSection;
