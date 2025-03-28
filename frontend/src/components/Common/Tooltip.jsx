import React, { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";

export default ({ id, children, containerStyle = {}, wrapperStyle = {} }) => {
  const settingsWindowRef = useRef(null);

  return (
    <Container style={containerStyle} ref={settingsWindowRef}>
      {children}
    </Container>
  );
};

const Container = styled.div`
  position: absolute;
`;
