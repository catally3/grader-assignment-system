import React from "react";
import styled from "@emotion/styled";

const HeaderRow = styled.header`
  background-color: ${(props) => props.theme.colors.secondary};
  display: grid;
  grid-template-columns: 1fr 1.3fr 1fr 1.5fr 1fr 1fr 1fr;
  min-height: 40px;
  width: 100%;
  align-items: center;

  font-size: small;
  font-weight: 500;
  text-align: center;
`;

const Column = styled.div``;

const TableHeader = () => {
  return (
    <HeaderRow>
      <Column>Application ID</Column>
      <Column>Name (NetId)</Column>
      <Column>Matched Course</Column>
      <Column>Position applied to</Column>
      <Column>Matching Summary</Column>
      <Column>Status</Column>
      <Column>Date</Column>
    </HeaderRow>
  );
};

export default TableHeader;
