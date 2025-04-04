import React, { useState, useRef, useEffect } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import ArrowIcon from "../../assets/icons/icon_arrow.svg";

const SelectBox = ({
  width = "auto",
  options = [],
  placeholder = "Select",
  value,
  onChange,
  containerStyle = {},
  absoluteStyle = {},
}) => {
  const ref = useRef(null);
  const [isOpened, setIsOpened] = useState(false);

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setIsOpened(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (id, e) => {
    e.stopPropagation(); // prevent bubbling
    onChange(id);
    setIsOpened(false);
  };

  return (
    <Container
      style={{ width, ...containerStyle }}
      ref={ref}
      onClick={() => setIsOpened((prev) => !prev)}
    >
      <Value isPlaceholder={value === null}>
        {value === null ? placeholder : value}
      </Value>
      <Icon src={ArrowIcon} isOpened={isOpened} />
      {isOpened && (
        <Dropdown style={{ ...absoluteStyle }}>
          {options.map((option) => (
            <Option
              key={option.id}
              active={value === option.id}
              onClick={(e) => handleSelect(option.id, e)}
            >
              {option.name}
            </Option>
          ))}
        </Dropdown>
      )}
    </Container>
  );
};

const Container = styled.div`
  color: #333;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #ccc;
  padding: 8px 12px;
  border-radius: 10px;
  margin-bottom: 4px;
  cursor: pointer;
  position: relative;
  user-select: none;
`;

const Icon = styled.img`
  width: 16px;
  height: 16px;
  transition: transform 0.2s ease-in-out;
  ${({ isOpened }) =>
    isOpened &&
    css`
      /* transform: rotate(180deg);
      transition: transform 0.2s ease; */
    `}
`;

const Value = styled.span`
  font-size: 14px;
  color: ${({ isPlaceholder }) => (isPlaceholder ? "#c7c7c7" : "#000")};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  width: 100%;
  padding: 8px;
  border: 1px solid #e3e3e3;
  border-radius: 6px;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  z-index: 1000;
  max-height: 250px;
  overflow-y: auto;
`;

const Option = styled.div`
  padding: 8px 12px;
  font-size: 14px;
  cursor: pointer;
  color: ${({ active }) => (active ? "rgba(248, 126, 3, 1)" : "#000")};

  &:hover {
    background-color: #f4f4f4;
  }

  &:not(:last-child) {
    margin-bottom: 4px;
  }
`;

export default SelectBox;
