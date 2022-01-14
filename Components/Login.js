import React from 'react';

import styled from 'styled-components';
import {
  TouchableOpacity,
  Keyboard,
  Animated,
  Dimensions,
  Alert,
} from 'react-native';
import Success from './Success';
import Loading from './Loading';
import {AsyncStorage} from 'react-native';
import {saveState} from './AsyncStorage';

class Login extends React.Component {
  state = {
    email: '',
    password: '',
  };

  componentDidUpdate() {}

  focusEmail = () => {
    this.setState({
      iconEmail: require('../assets/icon-email-animated.gif'),
      IconPassword: require('../assets/icon-password.png'),
    });
  };

  focusPassword = () => {
    this.setState({
      iconEmail: require('../assets/icon-email.png'),
      IconPassword: require('../assets/icon-password-animated.gif'),
    });
  };

  handleLogin = ({navigation}) => {
    this.setState({isLoading: true});

    const email = this.state.email;
    const password = this.state.password;

    this.setState({isLoading: false});
    this.setState({isSuccessful: true});

    Keyboard.dismiss();

    this.props.navigation.navigate('Profile');
  };

  render() {
    return (
      <Container>
        <Text>Driver LOGIN</Text>
        <TextInput
          onChangeText={(email) => this.setState({email})}
          placeholder="Username"
          keyboardType="email-address"
          onFocus={this.focusEmail}
        />
        <TextInput
          onChangeText={(password) => this.setState({password})}
          placeholder="Password"
          secureTextEntry={true}
          onFocus={this.focusPassword}
        />
        <TouchableOpacity onPress={this.handleLogin}>
          <Button>
            <ButtonText>Log In</ButtonText>
          </Button>
        </TouchableOpacity>
      </Container>
    );
  }
}

export default Login;

const Container = styled.View`
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 1);
  justify-content: center;
  align-items: center;
`;

const Logo = styled.Image`
  width: 44px;
  height: 44px;
  margin-top: 50px;
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
const TextInput = styled.TextInput`
  border: 1px solid #dbdfea;
  width: 295px;
  height: 44px;
  border-radius: 10px;
  font-size: 17px;
  color: #3c4560;
  margin-top: 20px;
  padding-left: 44px;
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
