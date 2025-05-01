import React from "react";
import styled from "@emotion/styled";
import Input from "../../components/Common/Input";
import Button from "../../components/Common/Button";
import Modal, { ModalContainer } from "../../components/Common/Modal";
import ModalHeader from "../Common/ModalHeader";

function InputModal({
  open,
  onClose,
  title,
  inputValue,
  setInputValue,
  handleCreateSemester,
  carryOver,
  setCarryOver,
}) {
  return (
    <Modal open={open} onClose={onClose}>
      <ModalContainer>
        <ModalHeader title={""} onClose={onClose} />
        <ContentSection>
          <ModalTitleText>{title}</ModalTitleText>
          <Description>Create a new semester for grader assignment</Description>
          <InputWrapper>
            <Input
              placeholder={"Spring 25"}
              inputValue={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </InputWrapper>

          <CheckboxWrapper>
            <label>
              <input
                type="checkbox"
                checked={carryOver}
                onChange={() => setCarryOver(!carryOver)}
              />
              &nbsp;Carry over data from previous semester
            </label>
          </CheckboxWrapper>

          <Button
            backgroundColor={"rgba(248, 126, 3, 1)"}
            TextColor={"white"}
            Text={"Create"}
            onClick={handleCreateSemester}
            width={"100%"}
          />
        </ContentSection>
      </ModalContainer>
    </Modal>
  );
}

const ModalTitleText = styled.h3`
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
  font-size: small;
  align-self: stretch;
  text-align: center;
  margin-top: 16px;
  margin-bottom: 0;
  color: #6f727a;
`;

const InputWrapper = styled.div`
  margin-top: 16px;
  margin-bottom: 16px;
  width: 346px;
  max-width: 100%;
`;

const CheckboxWrapper = styled.div`
  margin-bottom: 24px;
  font-size: 14px;
  color: #444;
`;

export default InputModal;
