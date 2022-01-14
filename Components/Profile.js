import React from "react";

import styled from "styled-components";
import {
  TouchableOpacity,
  Keyboard,
  Animated,
  Dimensions,
  Alert,
} from "react-native";
import Success from "./Success";
import Loading from "./Loading";
import { AsyncStorage } from "react-native";
import { saveState } from "./AsyncStorage";

class Profile extends React.Component {
  state = {
    email: "",
    password: "",
  };

  componentDidUpdate() {}

  render() {
    return (
      <Container>
        <Text>Profile</Text>
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate("Login");
          }}
        >
          <Button>
            <ButtonText>Log In</ButtonText>
          </Button>
        </TouchableOpacity>
      </Container>
    );
  }
}

export default Profile;

const Container = styled.View`
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 1);
  justify-content: center;
  align-items: center;
`;

const Text = styled.Text`
  margin-top: 20px;
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  width: 160px;
  text-align: center;
  color: #b8bece;
`;

const Button = styled.View`
  background: #5263ff;
  width: 295px;
  height: 50px;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  box-shadow: 0 10px 20px #c2cbff;
  margin-top: 20px;
`;

const ButtonText = styled.Text`
  color: white;
  font-weight: 600;
  font-size: 20px;
  text-transform: uppercase;
`;
