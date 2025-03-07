import React, { Fragment } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import GuestRoute from "./components/Guard/GuestRoute";
import Dashboard from "./pages/Dashboard";
import GraderAssignment from "./pages/GraderAssignment";
import ApplicantsManagement from "./pages/ApplicantsManagement";
import CourseManagement from "./pages/CourseManagement";
import Setting from "./pages/Setting";

const routesConfig = [
  {
    path: "/",
    element: () => <Navigate replace to="/dashboard" />,
  },
  {
    label: "login",
    path: "/login",
    element: Login,
    guard: GuestRoute,
  },
  {
    label: "dashboard",
    path: "/dashboard",
    element: Dashboard,
    guard: GuestRoute,
  },
  {
    label: "grader-assignment",
    path: "/grader-assignment",
    element: GraderAssignment,
    guard: GuestRoute,
  },
  {
    label: "applicant-management",
    path: "/applicant-management",
    element: ApplicantsManagement,
    guard: GuestRoute,
  },
  {
    label: "course-management",
    path: "/course-management",
    element: CourseManagement,
    guard: GuestRoute,
  },
  {
    label: "setting",
    path: "/setting",
    element: Setting,
    guard: GuestRoute,
  },
];

const renderRoutes = (routes) => (
  <Routes>
    {routes.map((route, i) => {
      const Guard = route.guard || Fragment;
      const Element = route.element;

      return (
        <Route
          key={i}
          path={route.path}
          element={
            <Guard>
              <Element />
            </Guard>
          }
        />
      );
    })}
  </Routes>
);

const RoutesHandler = () => {
  return renderRoutes(routesConfig);
};

export default RoutesHandler;
