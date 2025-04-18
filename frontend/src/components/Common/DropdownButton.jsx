import React, { useState, useRef, useEffect } from "react";
import styled from "@emotion/styled";

import arrowIcon from "../../assets/icons/icon_arrow.svg";
import downicon from "../../assets/icons/icon_download.svg";

const DropdownButton = ({ label, options = [] }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  const handleClickOutside = (e) => {
    if (ref.current && !ref.current.contains(e.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <DropdownWrapper ref={ref}>
      <ExcelButton onClick={() => setOpen((prev) => !prev)}>
        <DocumentIcon src={downicon} alt="icon" />
        {label}
        {arrowIcon && <ArrowIcon src={arrowIcon} alt="arrow" />}
      </ExcelButton>
      {open && (
        <DropdownMenu>
          {options.map((opt, idx) => (
            <DropdownItem
              key={idx}
              onClick={() => {
                opt.onClick();
                setOpen(false);
              }}
            >
              {opt.label}
            </DropdownItem>
          ))}
        </DropdownMenu>
      )}
    </DropdownWrapper>
  );
};

export default DropdownButton;

// Styled components
const DropdownWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const ExcelButton = styled.button`
  color: #333;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #ccc;
  padding: 6px 12px;
  border-radius: 10px;
  margin-bottom: 4px;
  background-color: #f9f9f9;

  &:hover {
    background-color: rgb(229, 229, 229);
  }
`;

const DocumentIcon = styled.img`
  width: 22px;
  height: 22px;
`;

const ArrowIcon = styled.img`
  width: 10px;
  height: 10px;
  margin-left: 4px;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 110%;
  left: 0;
  background: white;
  border: 1px solid #ddd;
  width: 200px;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 10;
`;

const DropdownItem = styled.div`
  padding: 10px 12px;
  font-size: 14px;
  cursor: pointer;
  &:hover {
    background-color: #f7f7f7;
  }
`;
