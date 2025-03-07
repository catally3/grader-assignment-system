import React from "react";
import styled from "@emotion/styled";

import Header from "./Header";
import Sidebar from "./Sidebar";

const Container = styled.div`
  width: 100%;
  height: 100%;
  min-height: 100vh;
  display: flex;
`;

const ContentWrap = styled.div`
  width: 100%;
  height: 100vh;
  padding: 0 66px 100px 66px;
  background-color: ${(props) => props.theme.colors.background};
`;

const Layout = ({ children }) => {
  return (
    <Container>
      <Sidebar />
      <ContentWrap>
        <Header />
        {children}
      </ContentWrap>
    </Container>
  );
};

export default Layout;
