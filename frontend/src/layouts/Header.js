import React, { useState } from "react";
import styled from "@emotion/styled";
import Button from "../components/Common/Button";
import { useNavigate } from "react-router-dom"; // To navigate to login page

const HeaderContainer = styled.div`
  width: 100%;
  display: flex;
  padding: 22px 0px;
  justify-content: end;
  align-items: center;
`;

const Header = () => {
  const navigate = useNavigate(); // Get the navigate function

  const handleSignOut = () => {
    // Clear any authentication data (localStorage, sessionStorage, etc.)
    localStorage.removeItem("authToken"); // Example: Clear auth token
    sessionStorage.removeItem("authToken"); // Example: Clear session token

    // Optionally, clear any global state if using context or a global store

    // Redirect to the login page
    navigate("/login");
  };

  return (
    <HeaderContainer>
      <Button
        Text={"Sign out"}
        TextColor={"#ffffff"}
        TextSize={"medium"}
        onClick={handleSignOut} // Add onClick handler to button
      />
    </HeaderContainer>
  );
};

export default Header;
