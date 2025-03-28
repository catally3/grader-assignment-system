import React from "react";
import styled from "@emotion/styled";
import CloseIcon from "../../assets/icons/icon_close.svg";

const HeaderContainer = styled.div`
  display: flex;
  width: 100%;
  background-color: white;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const Heading = styled.h3`
  align-self: stretch;
  margin: auto 0;
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

function ModalHeader({ title, closeIconSrc, onClose }) {
  return (
    <HeaderContainer>
      <Heading>{title}</Heading>
      <CloseButton
        src={closeIconSrc ? closeIconSrc : CloseIcon}
        alt="Close"
        onClick={onClose}
      />
    </HeaderContainer>
  );
}

export default ModalHeader;
