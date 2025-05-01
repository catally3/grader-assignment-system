/** @jsxImportSource @emotion/react */
import { useNavigate } from "react-router-dom";
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
  margin-top: 20px;
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
  margin-bottom: 10px;
`;

const Input = styled.input`
  padding: 10px;
  margin-bottom: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 320px;
  min-width: 250px;
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 14px;
  margin-bottom: 10px;
`;

const LoginButton = styled(UTDButton)`
  margin-top: 10px;
  margin-bottom: 5px;
`;

export default function App() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);
  const [newPasswordError, setNewPasswordError] = useState("");

  const [adminCredentials, setAdminCredentials] = useState({
    username: "admin",
    password: "adminpassword",
  });

  const resetInputFields = () => {
    setUsername("");
    setPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleLogin = () => {
    setShowLoginForm(true);
  };

  const handleAdminLogin = () => {
    if (
      username === adminCredentials.username &&
      password === adminCredentials.password
    ) {
      setIsAdmin(true);
      setErrorMessage("");
      resetInputFields();
      navigate("/dashboard");
    } else {
      setErrorMessage("Incorrect username or password. Please try again.");
      resetInputFields();
    }
  };

  const handleChangePassword = () => {
    if (username === adminCredentials.username) {
      if (newPassword === confirmPassword) {
        setAdminCredentials((prevCredentials) => ({
          ...prevCredentials,
          password: newPassword,
        }));
        setErrorMessage("");
        setNewPasswordError("");
        setShowChangePasswordForm(false);
        setShowLoginForm(true);
        resetInputFields();
      } else {
        setNewPasswordError("Passwords do not match.");
        resetInputFields(); // Reset input fields after a failed attempt
      }
    } else {
      setNewPasswordError("Incorrect username. Please try again.");
      resetInputFields(); // Reset input fields after a failed attempt
    }
  };

  return (
    <div css={globalStyle}>
      <Layout>
        <MainContent>
          <Title>GAS</Title>
          <Subtitle>Grader Assignment System</Subtitle>
          {!showLoginForm ? (
            <UTDButton onClick={handleLogin}>Login</UTDButton>
          ) : (
            <div style={{ marginTop: 42 }}>
              {!showChangePasswordForm ? (
                <div>
                  <div>
                    <Input
                      type="text"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div>
                    <Input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
                  <LoginButton onClick={handleAdminLogin}>Login</LoginButton>
                  {errorMessage && (
                    <div>
                      <button onClick={() => setShowChangePasswordForm(true)}>
                        Change Password
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <div>
                    <Input
                      type="text"
                      placeholder="Enter Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div>
                    <Input
                      type="password"
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  <div>
                    <Input
                      type="password"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  {newPasswordError && (
                    <ErrorMessage>{newPasswordError}</ErrorMessage>
                  )}
                  <LoginButton onClick={handleChangePassword}>
                    Change Password
                  </LoginButton>
                </div>
              )}
            </div>
          )}
        </MainContent>
      </Layout>
    </div>
  );
}
