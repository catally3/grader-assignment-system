import styled from "@emotion/styled";
import React from "react";

const Container = styled.button`
  padding: 16px 18px;
  width: ${(props) => props.width || ""};
  background-color: ${(props) =>
    props.backgroundColor || props.theme.colors.black};
  border: 1px solid ${(props) => props.borderColor || "transparent"};
  border-radius: 15px;
  cursor: pointer;
`;

const TextContainer = styled.div`
  font-size: ${(props) => props.size || "medium"}px;
  color: ${(props) => props.color || props.theme.colors.white};
`;

const Button = ({
  backgroundColor,
  borderColor,
  Text,
  TextColor,
  TextSize,
  style,
  onClick,
  width,
}) => {
  return (
    <Container
      onClick={onClick}
      backgroundColor={backgroundColor}
      borderColor={borderColor}
      width={width}
    >
      <TextContainer
        size={TextSize ? TextSize : "medium"}
        color={TextColor ? TextColor : "#ffffff"}
      >
        {Text}
      </TextContainer>
    </Container>
  );
};

export default Button;
