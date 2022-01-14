import React from 'react';

import styled from 'styled-components';
import {TouchableOpacity, Keyboard, Dimensions} from 'react-native';
import {AsyncStorage} from 'react-native';
import {connect} from 'react-redux';
import Home from './Home';

import {showMessage, hideMessage} from 'react-native-flash-message';
import {Notify} from '../Components/LocalPushController';
import firebase from 'react-native-firebase';

var settings = require('../Components/Settings');
var happyeater = require('../Components/HappyEater');
global.CLIENT_OBJ = new happyeater.Client(
  settings.API.ROOT_URI,
  settings.API.KEY,
);
const screenWidth = Dimensions.get('window').width;
var fontSize = fontSizer(screenWidth);

function fontSizer(screenWidth) {
  if (screenWidth > 400) {
    return 18;
  } else if (screenWidth > 250) {
    return 14;
  } else {
    return 12;
  }
}

function mapStateToProps(state) {
  return {name: state.name, user: state.user, sessionID: state.sessionID};
}

function mapDispatchToProps(dispatch) {
  return {
    setUserDetails: (user) =>
      dispatch({
        type: 'UPDATE_USR_DTL',
        user,
      }),
    setSessionID: (session) =>
      dispatch({
        type: 'SESSION_ID',
        session,
      }),
  };
}

// export const LocalNotification = () => {
//   PushNotification.localNotification({
//     autoCancel: true,
//     bigText:
//       'This is local notification demo in React Native app. Only shown, when expanded.',
//     subText: 'Local Notification Demo',
//     title: 'Local Notification Title',
//     message: 'Expand me to see more',
//     vibrate: true,
//     vibration: 300,
//     playSound: true,
//     soundName: 'default',
//     actions: '["Yes", "No"]',
//   });
// };

class Login extends React.Component {
  state = {username: '', password: ''};
  async componentDidMount() {
    AsyncStorage.getItem('username').then((value) => {
      this.setState({username: value});
    });
    AsyncStorage.getItem('password').then((value) => {
      this.setState({password: value});
    });
  }

  alertMessage = async (message, type) => {
    showMessage({
      message: message,
      type: type,
    });
  };

  async componentDidUpdate() {
    // const user_detail = await AsyncStorage.getItem("user");
    // if (user_detail != "" && user_detail != null) {
    //   this.props.navigation.navigate("Home");
    // }
  }

  focusUsername = () => {
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

  handleLogin = async ({navigation}) => {
    try {
      const username = this.state.username;
      const password = this.state.password;
      await AsyncStorage.setItem('username', username);
      await AsyncStorage.setItem('password', password);
      const driverService = new happyeater.DriverService(CLIENT_OBJ);
      CLIENT_OBJ.deleteRemoteState('DriverService.SessionDriver');
      if (
        this.state.username == undefined ||
        this.state.username.trim() == ''
      ) {
        this.alertMessage('Username field is empty', 'danger');
        return;
      }
      if (
        this.state.password == undefined ||
        this.state.password.trim() == ''
      ) {
        this.alertMessage('Password field is empty', 'danger');
        return;
      }
      const user_dtl = await driverService.logIn(username, password);
      console.log(user_dtl);
      CLIENT_OBJ.setRemoteState('DriverService.SessionDriver', user_dtl);
      var userDetail = JSON.parse(JSON.stringify(user_dtl));
      await AsyncStorage.setItem('session', userDetail.Id);

      this.props.navigation.reset({
        index: 0,
        routes: [{name: 'Home'}],
      });
      this.alertMessage('LoggedIn Successfully', 'success');
      Keyboard.dismiss();

      const fcmToken = await firebase.messaging().getToken();
      const result = await driverService.RegisterAPK(fcmToken);

      if(result == "success")
      {
        this.alertMessage('APK Registered Successfully', 'success');
      }
      else{
        this.alertMessage('APK Registration Failed', 'danger');
      }

      // Notify('Logged In as', asduser_dtl.Name);
    } catch (e) {
      this.props.navigator.immediatelyResetRouteStack([{}]);
      this.props.navigation.navigate('Login');
      this.alertMessage('Error Logging In', 'danger');
      console.log('Error logging : ' + e);
      alert(e);
    }
  };

  render() {
    return (
      <Container>
        <Text>Driver LOGIN</Text>
        <TextInput
          onChangeText={(username) => this.setState({username})}
          placeholder="Username"
          keyboardType="email-address"
          onFocus={this.focusUsername}
          value={this.state.username}
        />
        <TextInput
          onChangeText={(password) => this.setState({password})}
          placeholder="Password"
          secureTextEntry={true}
          onFocus={this.focusPassword}
          value={this.state.password}
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

export default connect(mapStateToProps, mapDispatchToProps)(Login);

const Container = styled.View`
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* background: rgba(0, 0, 0, 1); */
  background: black;
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
  font-size: ${fontSize};
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
  font-size: ${fontSize};
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
  font-size: ${fontSize};
  text-transform: uppercase;
`;
