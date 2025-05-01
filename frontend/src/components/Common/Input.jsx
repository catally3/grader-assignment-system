import * as React from "react";
import { useState } from "react";
import styled from "@emotion/styled";

const InputContainer = styled.div`
  width: 100%;
`;

const StyledInput = styled.input`
  border-radius: 10px;
  border: 1px solid #e0e2e7;
  background-color: #fff;
  width: 100%;
  padding: 10px 12px;
  font-size: medium;
  outline: none;

  &::placeholder {
    color: #999;
  }
`;

function Input({ placeholder, inputValue, onChange, maxLength }) {
  const onChangeValue = (e) => {
    onChange && onChange(e.target.value);
  };

  return (
    <InputContainer>
      <StyledInput
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={onChange}
        maxLength={maxLength}
      />
    </InputContainer>
  );
}

export default Input;
