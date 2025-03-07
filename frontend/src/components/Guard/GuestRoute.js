import React from "react";
import { Navigate } from "react-router-dom";

function GuestRoute({ children }) {
  if (sessionStorage.getItem("login")) {
    return <Navigate replace to="/" />;
  }
  return children;
}

export default GuestRoute;
