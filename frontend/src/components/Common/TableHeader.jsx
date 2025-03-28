import React from "react";
import styled from "@emotion/styled";

const HeaderRow = styled.header`
  background-color: ${(props) => props.theme.colors.secondary};
  display: grid;
  grid-template-columns: 1fr 2fr 1fr 1fr 1fr;
  min-height: 40px;
  width: 100%;
  align-items: center;

  font-size: small;
  font-weight: 500;
  text-align: center;
`;

const Column = styled.div``;

const TableHeader = ({ columns }) => {
  return (
    <HeaderRow>
      {columns.map((column) => {
        return <Column key={column}>{column}</Column>;
      })}
    </HeaderRow>
  );
};

export default TableHeader;
