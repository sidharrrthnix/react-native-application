import React from "react";
import styled from "styled-components";
import { TouchableOpacity, Dimensions, BackHandler } from "react-native";

const screenWidth = Dimensions.get("window").width;
const width = screenWidth / 3;

const Logo = (props) => (
  <TouchableOpacity disabled={props.isVisible}>
    <Container>
      <Image source={props.image} resizeMode="contain" />
      <Text>{props.text}</Text>
    </Container>
  </TouchableOpacity>
);

export default Logo;

const Container = styled.View`
  /* flex-direction: row; */
  flex: 1;
  background: white;
  height: 80px;
  width: 120px;
  /* padding: 12px 16px 15px; */
  /* padding-left: 30px; */
  border-radius: 22px;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.5);
  align-items: center;
  justify-content: center;
  margin: 0 8px;
`;

const Image = styled.Image`
  width: 36px;
  height: 36px;
`;

const Text = styled.Text`
  font-weight: 600;
  font-size: 16px;
  margin-left: 8px;
`;
