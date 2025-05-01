// src/pages/NotFound.jsx
import React from "react";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <Container>
      <BigText>404</BigText>
      <Message>Page Not Found</Message>
      <HomeLink to="/dashboard">Go to Home</HomeLink>
    </Container>
  );
};

export default NotFound;

const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const BigText = styled.h1`
  font-size: 6rem;
  color: #f87e03;
  margin-bottom: 20px;
`;

const Message = styled.p`
  font-size: 1.5rem;
  margin-bottom: 20px;
`;

const HomeLink = styled(Link)`
  font-size: 1rem;
  padding: 10px 20px;
  border-radius: 8px;
  background-color: #f87e03;
  color: white;
  text-decoration: none;

  &:hover {
    background-color: #d76f00;
  }
`;
