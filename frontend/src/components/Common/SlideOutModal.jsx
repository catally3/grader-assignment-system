import React from "react";
import ReactDOM from "react-dom";
import styled from "@emotion/styled";
import CloseIcon from "../../assets/icons/icon_close.svg";

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 10000;
`;

const SlidePanel = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 60%;
  height: 100%;
  background-color: #fff;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.5s ease;
  transform: ${({ open }) => (open ? "translateX(0)" : "translateX(100%)")};
  z-index: 10001;
  /* padding: 30px 40px; */
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const CloseButton = styled.img`
  aspect-ratio: 1;
  object-fit: contain;
  object-position: center;
  width: 24px;
  align-self: stretch;
  margin: auto 0;
  flex-shrink: 0;
  cursor: pointer;
`;

const SlideOutModal = ({ open, onClose, children }) => {
  if (!open) return null;

  return ReactDOM.createPortal(
    <>
      <Backdrop onClick={onClose} />
      <SlidePanel open={open}>{children}</SlidePanel>
    </>,
    document.getElementById("root")
  );
};

export default SlideOutModal;
