import React, { useState } from "react";
import styled from "@emotion/styled";
import Button from "../components/Common/Button";

const HeaderContainer = styled.div`
  width: 100%;
  display: flex;
  padding: 22px 0px;
  justify-content: end;
  align-items: center;
  button {
  }
`;

const Header = () => {
  return (
    <HeaderContainer>
      <Button Text={"Sign out"} TextColor={"#ffffff"} TextSize={"medium"} />
    </HeaderContainer>
  );
};

export default Header;
