import React from "react";
import styled from "@emotion/styled";
import Input from "../../components/Common/Input";
import Button from "../../components/Common/Button";
import Modal, { ModalContainer } from "../../components/Common/Modal";

function InputModal({
  open,
  onClose,
  title,
  onClick,
  inputValue,
  setInputValue,
}) {
  return (
    <Modal open={open} onClose={onClose}>
      <ModalContainer>
        <ContentSection>
          <ModalHeader>{title}</ModalHeader>
          <Description>Create a new semester for grader assignment</Description>
          <InputWrapper>
            <Input
              placeholder={"Spring 25"}
              inputValue={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </InputWrapper>
          <Button
            backgroundColor={"rgba(248, 126, 3, 1)"}
            TextColor={"white"}
            Text={"Create"}
            onClick={onClose}
            width={"100%"}
          />
        </ContentSection>
      </ModalContainer>
    </Modal>
  );
}

const ModalHeader = styled.h3`
  width: 100%;
  text-align: center;
`;

const ContentSection = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  flex-direction: column;
`;

const Description = styled.p`
  align-self: stretch;
  text-align: center;
  margin-top: 16px;
  margin-bottom: 0;
  color: #6f727a;
`;

const InputWrapper = styled.div`
  margin-top: 16px;
  margin-bottom: 40px;
  width: 346px;
  max-width: 100%;
`;

export default InputModal;
