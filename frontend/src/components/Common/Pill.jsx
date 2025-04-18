import React from "react";
import styled from "@emotion/styled";

import checkIcon from "../../assets/icons/icon_check.svg";

const PillContainer = styled.div`
  display: flex;
  flex: inline-block
  max-width: 120px;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  border: 1px solid var(--Secondary-Gray-2, #e0e2e7);
  background-color: #fff;
  padding: 2px 10px;
  gap: 6px;
`;

const PillIcon = styled.img`
  aspect-ratio: 1;
  object-fit: contain;
  object-position: center;
  width: 16px;
`;

const PillText = styled.span`
  font-size: small;
  line-height: 2;
`;

const Pill = ({ text, img }) => {
  return (
    <PillContainer>
      <PillIcon src={img ? img : checkIcon} />
      <PillText>{text}</PillText>
    </PillContainer>
  );
};

export default Pill;
