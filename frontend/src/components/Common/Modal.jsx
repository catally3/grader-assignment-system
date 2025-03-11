import React from "react";
import ReactDOM from "react-dom";
import styled from "@emotion/styled";

const ModalWarrper = styled.div`
  display: flex;
  position: fixed;
  flex-direction: column;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.6);
  width: 100%;
  height: 100%;
  z-index: 10000;
  top: 0;
  left: 0;
`;

const CloseContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 100;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 925px;
  max-height: 80vh;
  border-radius: 6px;
  box-sizing: border-box;
  z-index: 200;
`;

const AbsoluteContainer = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
`;

export const ModalContainer = styled.div`
  padding: 30px 40px;
  border-radius: 20px;
  background-color: #fff;
  border-radius: 20px;

  max-height: 80vh;
  overflow-y: hidden;
`;

export const ModalText = styled.span`
  display: block;
  font-weight: 600;
  white-space: pre;
`;

export const ModalButtonWrap = styled.div`
  display: flex;
  width: 100%;
`;

export const ModalTitle = styled.div`
  font-weight: 500;
  letter-spacing: -0.36px;
  text-align: center;
  color: #444;
  margin-bottom: 30px;
`;

export const ShadowButtonWrap = styled(ModalButtonWrap)`
  display: flex;
  flex-direction: row;
  height: 60px;
  align-items: center;
  border-top: 1px solid #e3e3e3;
  width: calc(100% + 40px);
  padding: 10px 20px;
  margin: 0 0 -10px -20px;
`;

export const CustomShadowButtonWrap = styled(ModalButtonWrap)`
  width: 100%;
  padding: 30px 40px;
`;

const Modal = ({
  open,
  onClose,
  children,
  modalStyle,
  containerStyle,
  wrapperStyle,
}) => {
  return open
    ? ReactDOM.createPortal(
        <ModalWarrper style={modalStyle}>
          <AbsoluteContainer style={containerStyle}>
            <CloseContainer onClick={onClose} />
            <Container style={wrapperStyle}>{children}</Container>
          </AbsoluteContainer>
        </ModalWarrper>,
        document.getElementById("root")
      )
    : null;
};

export default Modal;
