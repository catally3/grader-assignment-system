/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { useState } from "react";
import Dashboard from "./Dashboard";

import utdIcon from "../assets/icons/icon_utd.svg";

const globalStyle = css`
  @import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap");
`;

const MainContent = styled.main`
  padding: 20px;
  font-size: 18px;
  color: #333;
  text-align: center;
`;

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  margin: 0;
`;

const Title = styled.div`
  font-size: 70px;
  font-weight: bold;
  color: rgba(248, 120, 16, 0.9);
  font-family: "Roboto", sans-serif;
`;

const UTDButton = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(2, 2, 2, 0.78);
  padding: 12px 40px;
  border-radius: 12px;
  text-decoration: none;
  color: white;
  font-size: 14px;
  font-weight: medium;
  font-family: "Roboto", sans-serif;
  margin-top: 50px;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 320px;
  min-width: 250px;

  &:hover {
    background-color: rgba(0, 0, 0, 0.6);
  }

  img {
    width: 25px;
    height: 25px;
    margin-right: 10px;
  }
`;

const Subtitle = styled.p`
  font-family: "Roboto", sans-serif;
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-top: 0px;
`;

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <div css={globalStyle}>
      {isLoggedIn ? (
        <Dashboard />
      ) : (
        <Layout>
          <MainContent>
            <Title>GAS</Title>
            <Subtitle>Grader Assignment System</Subtitle>
            <UTDButton onClick={handleLogin}>
              <img src={utdIcon} alt="UTD Logo" />
              Sign in with UTD Account
            </UTDButton>
          </MainContent>
        </Layout>
      )}
    </div>
  );
}
