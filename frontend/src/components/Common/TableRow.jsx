import React from "react";
import styled from "@emotion/styled";

import StatusBadge from "./StatusBadge";
import Pill from "./Pill";

const Row = styled.div`
  width: 100%;

  display: grid;
  grid-template-columns: 1fr 1.3fr 1fr 1.5fr 1fr 1fr 1fr;

  align-items: center;
  justify-content: start;
  flex-wrap: wrap;
  font-size: small;
  padding: 20px 0px;
  border-bottom: 1px solid var(--Secondary-Gray-2, #e5e5e5);
  cursor: pointer;

  :hover {
    background-color: ${(props) => props.theme.colors.background};
  }
`;

const Cell = styled.div`
  text-align: center;
  align-self: stretch;
  margin-top: auto;
  margin-bottom: auto;
  flex-grow: 1;
  flex-shrink: 1;
  border-bottom: 1;
`;

const MatchCell = styled(Cell)`
  flex: 1;
  display: flex;
  justify-content: center;
`;

const StatusCell = styled(Cell)`
  flex: 1;
  display: flex;
  justify-content: center;
`;

const TableRow = ({ assignment, setModalOpen, setAssignmentInfo }) => {
  const { id, name, netId, course, position, matchCount, status, date } =
    assignment;

  const handleOnClickRow = () => {
    setAssignmentInfo(assignment);
    setModalOpen(true);
  };

  return (
    <Row onClick={() => handleOnClickRow()}>
      <Cell>{id}</Cell>
      <Cell>{`${name} (${netId})`}</Cell>
      <Cell>{course}</Cell>
      <Cell>{position}</Cell>
      <MatchCell>
        <Pill text={`${matchCount} matches`} />
      </MatchCell>
      <StatusCell>
        <StatusBadge status={status} />
      </StatusCell>
      <Cell>{date}</Cell>
    </Row>
  );
};

export default TableRow;
