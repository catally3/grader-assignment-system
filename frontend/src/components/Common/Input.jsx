import * as React from "react";
import { useState } from "react";
import styled from "@emotion/styled";

const InputContainer = styled.div`
  width: 100%;
`;

const StyledInput = styled.input`
  border-radius: 8px;
  border: 1px solid var(--Secondary-Gray-2, #e0e2e7);
  background-color: #fff;
  width: 100%;
  padding: 12px 16px;
  font-size: 16px;
  outline: none;

  &::placeholder {
    color: #6f727a;
  }
`;

function Input({ placeholder, inputValue, onChange }) {
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
      />
    </InputContainer>
  );
}

export default Input;
