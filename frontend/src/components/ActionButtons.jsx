import React from "react";
import styled from "@emotion/styled";

function ActionButtons({ primaryAction, secondaryAction }) {
  return (
    <Container>
      <SecondaryButtonWrapper>
        <SecondaryButton>{secondaryAction}</SecondaryButton>
      </SecondaryButtonWrapper>
      <PrimaryButtonWrapper>
        <PrimaryButton>{primaryAction}</PrimaryButton>
      </PrimaryButtonWrapper>
    </Container>
  );
}

const Container = styled.footer`
  justify-content: center;
  align-items: center;
  display: flex;
  margin-top: 16px;
  width: 100%;
  padding: 16px 40px;
  gap: 24px;
  font-weight: 500;
`;

const SecondaryButtonWrapper = styled.div`
  align-self: stretch;
  display: flex;
  margin: auto 0;
  align-items: center;
  justify-content: flex-start;
`;

const SecondaryButton = styled.button`
  align-self: stretch;
  border: none;
  border-radius: 15px;
  background-color: rgba(232, 232, 232, 1);
  margin: auto 0;
  padding: 16px 18px;
  font-weight: 500;
  cursor: pointer;
`;

const PrimaryButtonWrapper = styled.div`
  align-self: stretch;
  display: flex;
  margin: auto 0;
  min-height: 52px;
  align-items: center;
  gap: 40px 71px;
  color: #fff;
  justify-content: flex-start;
`;

const PrimaryButton = styled.button`
  align-self: stretch;
  border: none;
  border-radius: 15px;
  background-color: rgba(248, 126, 3, 1);
  margin: auto 0;
  padding: 16px 18px;
  font-weight: 500;
  color: #fff;
  cursor: pointer;
`;

export default ActionButtons;
