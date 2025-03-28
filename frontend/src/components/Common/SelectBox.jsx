import React, { useState, useRef } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import ArrowIcon from "../../assets/icons/icon_arrow.svg";

const SelectBox = ({
  width,
  options,
  placeholder,
  value,
  onChange,
  containerStyle,
  absoluteStyle,
}) => {
  const ref = useRef(null);

  const [isOpened, setIsOpened] = useState(false);
  const [zIndex, setZIndex] = useState(100);

  return (
    <Container style={{ width: width || "auto", ...containerStyle }} ref={ref}>
      <Value>{value === null ? placeholder : value}</Value>
      <Icon src={ArrowIcon} />
      <AbsoluteWrap
        isOpen={isOpened}
        value={value}
        optionLength={options.length}
        style={{ zIndex, ...absoluteStyle }}
      >
        <AbsoluteValueContainer>
          <Value style={{ color: value === null ? "#c7c7c7" : "#000" }}>
            {value === null ? placeholder : value}
          </Value>
          <Icon src={isOpened ? ArrowIcon : ArrowIcon} />
        </AbsoluteValueContainer>
        <OptionBox>
          {options.map((option) => (
            <OptionText
              key={option.value}
              active={value === option.value}
              onClick={() => onChange(option.value)}
            >
              {option.label}
            </OptionText>
          ))}
        </OptionBox>
      </AbsoluteWrap>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  padding: 8px;
  border-radius: 6px;
  border: solid 1px #c7c7c7;
  background-color: #fff;
  cursor: pointer;
  position: relative;
  user-select: none;
`;

const Icon = styled.img`
  width: 18px;
  height: 18px;
  margin-left: 7px;
`;

const Value = styled.span`
  font-size: 14px;
  letter-spacing: -0.84px;
  text-align: left;
  color: #000;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const AbsoluteWrap = styled.div(
  ({ isOpen, optionLength, initalMaxHeight, value }) => css`
    display: flex;
    flex-direction: column;
    position: absolute;
    top: -1px;
    left: -1px;
    width: calc(100% + 2px);
    padding: 8px;
    border-radius: 6px;
    border: solid 1px #e3e3e3;
    background-color: #fff;
    z-index: 500;
    overflow: hidden;
    transition: max-height 0.15s ease-in-out;

    ${isOpen
      ? css`
          max-height: ${42 + 28 * optionLength}px;
        `
      : css`
          max-height: ${initalMaxHeight || 37}px;
        `}

    ${value !== null &&
    css`
      border-color: #777;
    `}
  `
);

const AbsoluteValueContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;

const OptionText = styled.span`
  display: block;
  cursor: pointer;
  font-size: 14px;
  text-align: left;

  ${({ active }) =>
    active
      ? css`
          color: #258fff;
        `
      : css`
          color: #000;
        `}

  &:not(:last-child) {
    margin-bottom: 14px;
  }
`;

const OptionBox = styled.div`
  width: 100%;
  height: 200px;

  margin-top: 14px;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    width: 17px;
  }

  &::-webkit-scrollbar-thumb {
    height: 17%;
    background-color: #c7c7c7;
    border-radius: 10px;

    background-clip: padding-box;
    border: 6px solid transparent;
  }

  &::-webkit-scrollbar-track {
    background-color: rgba(0, 0, 0, 0);
    margin: 0;
  }
`;

export default SelectBox;
