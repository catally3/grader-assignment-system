import React, { Fragment } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import GuestRoute from "./components/Guard/GuestRoute";
import Dashboard from "./pages/Dashboard";
import CandidateManagement from "./pages/CandidateManagement";
import CourseManagement from "./pages/CourseManagement";
import ProfessorManagement from "./pages/ProfessorManagement";
import Setting from "./pages/Setting";
import NotFound from "./pages/NotFound";

// Define ProtectedRoute
const ProtectedRoute = ({ children }) => {
  const isLoggedIn = true; // Check if user is logged in

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />; // Redirect to login if not logged in
  }

  return children;
};

const routesConfig = [
  {
    path: "*",
    element: NotFound,
  },
  {
    path: "/",
    element: () => <Navigate replace to="/login" />,
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
    guard: ProtectedRoute,
  },
  {
    label: "candidate-management",
    path: "/candidate-management",
    element: CandidateManagement,
    guard: ProtectedRoute,
  },
  {
    label: "course-management",
    path: "/course-management",
    element: CourseManagement,
    guard: ProtectedRoute,
  },
  {
    label: "professor-management",
    path: "/professor-management",
    element: ProfessorManagement,
    guard: ProtectedRoute,
  },
  {
    label: "setting",
    path: "/setting",
    element: Setting,
    guard: ProtectedRoute,
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
              <Element /> {}
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
