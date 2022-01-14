import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  AsyncStorage,
  StatusBar,
  Text,
  Button,
} from 'react-native';
import 'react-native-gesture-handler';
import Stack from './navigator/Stack';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import FlashMessage from 'react-native-flash-message';
import firebase from 'react-native-firebase';
import {LocalNotification} from './Components/LocalPushController';
import PushNotification from 'react-native-push-notification';
import {Notify, createChannel} from './Components/LocalPushController';

const initialState = {
  user: null,
  sessionID: null,
  isActiveOrdersTabVisible: true,
  isRejectButtonVisible: true,
  isDispatchButtonVisible: true,
  isCompleteButtonVisible: true,
  loadAvailableData: [],
  loadActiveData: [],
  loadCompletedData: [],
  activeCount: 0,
  availableCount: 0,
  deliveryCount: 0,
  isBannerActive: false,
  stateLoader: 'EMPTY',
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_USR_DTL':
      return {...state, user: action.user};
    case 'UPDATE_DISPATCH_STATUS':
      return {...state, isDispatchButtonVisible: action.status};
    case 'HIDE_ACTIVE_ORDERS':
      return {...state, isActiveOrdersTabVisible: false};
    case 'UPDATE_ACTIVE_ORDERS_TAB':
      return {
        ...state,
        isActiveOrdersTabVisible: action.status,
      };
    case 'UPDATE_AVAILABLE_ORDERS':
      return {
        ...state,
        loadAvailableData: action.available_orders,
      };
    case 'UPDATE_ACTIVE_ORDERS':
      return {
        ...state,
        loadActiveData: action.active_orders,
      };
    case 'UPDATE_COMPLETED_ORDERS':
      return {
        ...state,
        loadCompletedData: action.completed_orders,
      };
    case 'UPDATE_ACTIVE_COUNT':
      return {
        ...state,
        activeCount: action.active_count,
      };
    case 'UPDATE_AVAILABLE_COUNT':
      return {
        ...state,
        availableCount: action.available_count,
      };
    case 'UPDATE_DELIVERY_COUNT':
      return {
        ...state,
        deliveryCount: action.delivery_count,
      };
    case 'OPEN_MENU':
      return {...state, action: 'openMenu'};
    case 'CLOSE_MENU':
      return {...state, action: 'closeMenu'};
    case 'UPDATE_BANNER_STATUS':
      return {
        ...state,
        isBannerActive: action.banner_status,
      };
    case 'LOAD_STATE':
      return {
        ...state,
        stateLoader: action.state_name,
      };
    case 'SESSION_ID':
      return {
        ...state,
        sessionID: action.session,
      };
    default:
      return state;
  }
};

const store = createStore(reducer);

class App extends React.Component {
  componentDidMount() {
    // createChannel();
    PushNotification.configure({
      onRegister: function (token) {
        console.log(' JEFFERY_PUSH_NOTIFY NOTIFICATION_ID', token)
      },

      onNotification: function (notification) {
        console.log('JEFFERY_PUSH_NOTIFY NOTIFICATION:', notification);
      },
      onAction: function (notification) {
        console.log('JEFFERY_PUSH_NOTIFY ON NOTIFICATION ACTION:', notification.action);
      },
      onRegistrationError: function (err) {
        console.error(err.message, err);
      },

      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      popInitialNotification: true,
      requestPermissions: true,
    });
  }

  showAlert(title, body) {
    Alert.alert(
      title,
      body,
      [{text: 'OK', onPress: () => console.log('OK Pressed')}],
      {cancelable: false},
    );
  }

  render() {
    return (
      <Provider store={store} style={{flex: 1}}>
        <StatusBar
          barStyle="dark-content"
          hidden={false}
          backgroundColor="#d5dde4"
          translucent={true}
        />

        <Stack></Stack>
        <FlashMessage position="top" />
      </Provider>

      // <View style={styles.container}>
      //   <Text>Press a button to trigger the notification</Text>
      //   <View style={{marginTop: 20}}>
      //     <Button
      //       title={'Local Push Notification'}
      //       onPress={this.handleButtonPress}
      //     />
      //   </View>
      // </View>
    );
  }
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // backgroundColor: "white",
    alignItems: 'center',
    justifyContent: 'center',
  },
});
