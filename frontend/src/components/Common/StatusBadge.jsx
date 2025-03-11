import React from "react";
import styled from "@emotion/styled";

const Badge = styled.div`
  display: inline-block;
  border-radius: 10px;
  padding: 4px 10px;
  font-size: small;
  text-align: center;
  background-color: ${(props) =>
    props.status === "Assigned" ? "#def7ec" : "#e1effe"};
  color: ${(props) => (props.status === "Assigned" ? "#03543f" : "#1e429f")};
`;

const StatusBadge = ({ status }) => {
  return <Badge status={status}>{status}</Badge>;
};

export default StatusBadge;
