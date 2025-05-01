import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import SidebarMenuItem from "./SidebarMenuItem";
import gradIcon from "../assets/icons/icon_graduation.svg";
import homeIcon from "../assets/icons/icon_home.svg";
import listIcon from "../assets/icons/icon_list.svg";
import peopleIcon from "../assets/icons/icon_people.svg";

const SidebarContainer = styled.nav`
  max-width: 320px;
  height: 100vh;
  padding: 30px;
  background-color: ${(props) => props.theme.colors.white};

  box-shadow: 0px 0px 63.436px 0px rgba(0, 0, 0, 0.07);
`;

const Logo = styled.div`
  text-align: center;
  cursor: pointer;

  h1 {
    color: ${(props) => props.theme.colors.primary};
    font-size: 48px;
    font-weight: 700;
    padding-bottom: 4px;
  }

  text {
    font-size: 12px;
    font-weight: 500;
    color: ${(props) => props.theme.colors.darkGrayText};
  }
`;

const MenuContainer = styled.div`
  display: flex;
  margin-top: 40px;
  width: 100%;
  flex-direction: column;
  align-items: start;
  font-size: medium;
  color: #1c1d1d;
  justify-content: start;
`;

const Sidebar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const menuItems = [
    {
      icon: homeIcon,
      text: "Dashboard",
      isActive: pathname === "/dashboard" ? true : false,
      navigate: "/dashboard",
    },
    {
      icon: gradIcon,
      text: "Candidate Management",
      isActive: pathname === "/candidate-management" ? true : false,
      navigate: "/candidate-management",
    },
    {
      icon: listIcon,
      text: "Course Mangement",
      isActive: pathname === "/course-management" ? true : false,
      navigate: "/course-management",
    },
    {
      icon: peopleIcon,
      text: "Professor Management",
      isActive: pathname === "/professor-management" ? true : false,
      navigate: "/professor-management",
    },
  ];

  return (
    <SidebarContainer>
      <Logo onClick={() => navigate("/dashboard")}>
        <h1>GAS</h1>
        <text>Grader Assignment System</text>
      </Logo>
      <MenuContainer>
        {menuItems.map((item, index) => (
          <SidebarMenuItem
            key={index}
            icon={item.icon}
            text={item.text}
            isActive={item.isActive}
            onClick={() => navigate(item.navigate)}
          />
        ))}
      </MenuContainer>
    </SidebarContainer>
  );
};

export default Sidebar;
