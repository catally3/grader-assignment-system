import React from "react";
import { Navigate } from "react-router-dom";

const AuthRoute = ({ children }) => {
  if (!sessionStorage.getItem("login")) {
    return <Navigate replace to="/login" />;
  }
  return children;
};

export default AuthRoute;
