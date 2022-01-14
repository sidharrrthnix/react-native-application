import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { AsyncStorage } from "react-native";

class Avatar extends React.Component {
  componentDidMount() {
    this.loadState();
  }

  loadState = () => {
    AsyncStorage.getItem("state").then((serializedState) => {
      const state = JSON.parse(serializedState);
      console.log(state);

      if (state) {
        this.props.updateName(state.name);
        this.props.updateAvatar(state.avatar);
      }
    });
  };

  render() {
    return <Image />;
  }
}

export default Avatar;

const Image = styled.Image`
  width: 44px;
  height: 44px;
  border-radius: 22px;
  border: 1px solid black;
`;
