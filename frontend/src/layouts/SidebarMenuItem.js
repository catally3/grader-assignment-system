import * as React from "react";
import styled from "@emotion/styled";

const MenuItem = styled.button`
  display: flex;
  padding: 8px 10px;
  align-items: center;
  gap: 16px;
  white-space: nowrap;
  justify-content: start;
  cursor: pointer;
  text-align: left;
  margin-top: ${(props) => (props.isFirst ? "0" : "28px")};

  &:first-child {
    margin-top: 0;
  }
`;

const ActiveMenuItem = styled(MenuItem)`
  width: 100%;
  padding: 8px 10px;
  border-radius: 7px;
  background-color: #e8e8e8;
`;

const MenuIcon = styled.img`
  aspect-ratio: 1;
  object-fit: contain;
  object-position: center;
  width: 26px;
  flex-shrink: 0;
`;

const MenuText = styled.span`
  margin-top: auto;
  margin-bottom: auto;
  flex-grow: 1;
  flex-shrink: 1;
`;

function SidebarMenuItem({ icon, text, isActive, onClick }) {
  if (isActive) {
    return (
      <ActiveMenuItem>
        <MenuIcon src={icon} alt="navigation" />
        <MenuText>{text}</MenuText>
      </ActiveMenuItem>
    );
  }

  return (
    <MenuItem onClick={onClick}>
      <MenuIcon src={icon} alt="" />
      <MenuText>{text}</MenuText>
    </MenuItem>
  );
}

export default SidebarMenuItem;
