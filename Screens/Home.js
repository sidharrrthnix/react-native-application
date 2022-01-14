import React from 'react';
import {connect} from 'react-redux';
import DashboardCard from '../Components/DashboardCard';
import styled from 'styled-components';
import OrderCard from '../Components/OrderCard';
import {
  TouchableOpacity,
  Animated,
  Dimensions,
  AsyncStorage,
  StyleSheet,
} from 'react-native';
import {SafeAreaView, ScrollView} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import Menu from '../Components/Menu';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import BannerComponent from '../Components/Banner';
import {showMessage, hideMessage} from 'react-native-flash-message';
import {Notify} from '../Components/LocalPushController';
import firebase from 'react-native-firebase';

const moment = require('moment-timezone');
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
var happyeater = require('../Components/HappyEater');

var intervalTimeoutID = [];

// screenHeight 592 s7
var cardWidth = screenWidth;
if (screenWidth > 500) {
  cardWidth = 500;
}

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
  return {
    action: state.action,
    name: state.name,
    user: state.user,
    isActiveOrdersTabVisible: state.isActiveOrdersTabVisible,
    isDispatchButtonVisible: state.isDispatchButtonVisible,
    loadAvailableData: state.loadAvailableData,
    loadActiveData: state.loadActiveData,
    loadCompletedData: state.loadCompletedData,
    activeCount: state.activeCount,
    availableCount: state.availableCount,
    deliveryCount: state.deliveryCount,
    isBannerActive: state.isBannerActive,
    stateLoader: state.stateLoader,
  };
}

function getNextIndex(index) {
  var nextIndex = index + 1;
  if (nextIndex > projects.length - 1) {
    return 0;
  }
  return nextIndex;
}

function mapDispatchToProps(dispatch) {
  return {
    setRejectStatus: (status) =>
      dispatch({
        type: 'UPDATE_REJECT_STATUS',
        status,
      }),
    setActiveOrdersTabStatus: (status) =>
      dispatch({
        type: 'UPDATE_ACTIVE_ORDERS_TAB',
        status,
      }),
    setDispatchButtonStatus: (status) =>
      dispatch({
        type: 'UPDATE_DISPATCH_STATUS',
        status,
      }),
    setUserDetails: (user) =>
      dispatch({
        type: 'UPDATE_USR_DTL',
        user,
      }),
    setAvailableOrders: (available_orders) =>
      dispatch({
        type: 'UPDATE_AVAILABLE_ORDERS',
        available_orders,
      }),
    setActiveOrders: (active_orders) =>
      dispatch({
        type: 'UPDATE_ACTIVE_ORDERS',
        active_orders,
      }),
    setCompletedOrders: (completed_orders) =>
      dispatch({
        type: 'UPDATE_COMPLETED_ORDERS',
        completed_orders,
      }),

    setActiveCount: (active_count) =>
      dispatch({
        type: 'UPDATE_ACTIVE_COUNT',
        active_count,
      }),
    setAvailableCount: (available_count) =>
      dispatch({
        type: 'UPDATE_AVAILABLE_COUNT',
        available_count,
      }),
    setDeliveredCount: (delivery_count) =>
      dispatch({
        type: 'UPDATE_DELIVERY_COUNT',
        delivery_count,
      }),
    setBannerStatus: (banner_status) =>
      dispatch({
        type: 'UPDATE_BANNER_STATUS',
        banner_status,
      }),
    openMenu: () =>
      dispatch({
        type: 'OPEN_MENU',
      }),
    loadState: (state_name) =>
      dispatch({
        type: 'LOAD_STATE',
        state_name,
      }),
  };
}

// function refresh() {
//   alert("asdasd");
// }

class Home extends React.Component {
  constructor() {
    super();

    this.state = {
      lastOrderId: '',
      lastOrderName: '',
    };
  }

  componentDidUpdate() {
    // this.checkForNewOrder();
  }

  componentDidMount() {
    AsyncStorage.getItem('session').then((value) => {
      if (!value) {
        this.props.navigation.reset({
          index: 0,
          routes: [{name: 'Login'}],
        });
        for (id in intervalTimeoutID) {
          clearInterval(id);
        }
      }
    });
    // await localStorage.setItem("name", "jeffery");
    // alert(JSON.stringify(localStorage.getItem("name")));
    // alert(JSON.stringify(AsyncStorage.getItem("session")));
    // this.commonObj.refreshData();
    this.refresh();
    var intervalID = setInterval(() => {
      this.refresh();
    }, 10000);
    intervalTimeoutID.push(intervalID);
  }

  static navigationOptions = {
    header: null,
  };

  loadActiveOrder = (ACTIVE_ORDER_DETAILS) => {
    const active_order = JSON.parse(JSON.stringify(ACTIVE_ORDER_DETAILS));
    if (active_order.length > 0) {
      this.props.setActiveOrdersTabStatus(true);
    }
  };

  alertMessage = async (message, type) => {
    showMessage({
      message: message,
      type: type,
    });
  };

  logoutModal = async () => {
    this.RBSheet.open();
  };

  static stateHandler = async (type) => {
    if (type == 'ORDER_ASSIGNED') {
      alert(type);
      this.props.loadState(type);
    }
  };

  logout = async () => {
    try {
      const driverService = new happyeater.DriverService(CLIENT_OBJ);
      await driverService.logOut();
      await AsyncStorage.setItem('user', '');
      this.RBSheet.close();
      this.props.navigation.navigate('Login');
      // clearInterval(this.intervalID);
      for (id in intervalTimeoutID) {
        clearInterval(id);
      }
      // intervalTimeoutID.forEach(clearInterval);
      this.alertMessage('Logged out successfully', 'success');
    } catch (e) {
      this.alertMessage('Log out error', 'danger');
      console.log('Logout Error : ' + e);
    }
  };

  redirectToLogin = async () => {
    try {
      const driverService = new happyeater.DriverService(CLIENT_OBJ);
      await driverService.logOut();
      await AsyncStorage.setItem('user', '');
      this.props.navigation.navigate('Login');
      for (id in intervalTimeoutID) {
        clearInterval(id);
      }
    } catch (e) {
      console.log('Error while redirecting to login : ' + e);
    }
  };

  autoLogin = async (username, password) => {
    try {
      const driverService = new happyeater.DriverService(CLIENT_OBJ);
      const user_dtl = await driverService.logIn(username, password);
      CLIENT_OBJ.setRemoteState('DriverService.SessionDriver', user_dtl);

      var userDetail = JSON.parse(JSON.stringify(user_dtl));
      await AsyncStorage.setItem('session', userDetail.Id);

      this.props.navigation.reset({
        index: 0,
        routes: [{name: 'Home'}],
      });
    } catch (e) {}
  };

  checkForNewOrder = async () => {
    if (this.props.loadAvailableData != undefined) {
      // console.log(
      //   this.props.loadAvailableData[this.props.loadAvailableData.length - 1]
      //     .Reference,
      // );
      var length = this.props.loadAvailableData.length;
      if (
        this.state.lastOrderId !=
        this.props.loadAvailableData[length - 1].Reference
      ) {
        Notify(
          'New Order from ' +
            this.props.loadAvailableData[
              this.props.loadAvailableData.length - 1
            ].Name,
          'Order ID : ' +
            this.props.loadAvailableData[
              this.props.loadAvailableData.length - 1
            ].Reference,
        );
      }

      this.state.lastOrderId = this.props.loadAvailableData[
        this.props.loadAvailableData.length - 1
      ].Reference;

      this.state.lastOrderName = this.props.loadAvailableData[
        this.props.loadAvailableData.length - 1
      ].Name;
    }
  };

  refresh = async () => {
    try {
      const driverService = new happyeater.DriverService(CLIENT_OBJ);
      const dataService = new happyeater.DataService(CLIENT_OBJ);
      const availableOrders = await driverService.getAvailableOrders();
      const activeOrders = await driverService.getActiveOrders();
      const completedOrders = await driverService.getCompletedOrders();

      const fixUp = async (o) => {
        try {
          o.Store = await dataService.getStoreById(o.StoreId);
          o.FormattedPaymentMethod = o.Payments.some((p) => p.Source == 1)
            ? 'Cash Payment'
            : 'Card Payment';

          o.FormattedPaymentColor =
            o.FormattedPaymentMethod == 'Cash Payment' ? 'red' : 'green';

          const zone = 'Europe/London'; // Zone should really come the geographical location of the store we're testing
          if (o.TargetTime && o.TargetTime != '0001-01-01T00:00:00')
            o.TargetTime = moment.tz(o.TargetTime, zone).toDate();
          o.CreationTime = moment.tz(o.CreationTime, zone).toDate();
        } catch (e) {
          console.log(e);
        }
      };

      for (let o of availableOrders) await fixUp(o);
      for (let o of activeOrders) await fixUp(o);
      for (let o of completedOrders) await fixUp(o);

      global.AVAILABLE_ORDER_DETAILS = JSON.parse(
        JSON.stringify(availableOrders),
      );
      global.COMPLETED_ORDER_DETAILS = JSON.parse(
        JSON.stringify(completedOrders),
      );
      global.ACTIVE_ORDER_DETAILS = JSON.parse(JSON.stringify(activeOrders));

      const data = {
        availableOrders: AVAILABLE_ORDER_DETAILS,
        activeOrders: ACTIVE_ORDER_DETAILS,
        completedOrders: COMPLETED_ORDER_DETAILS,
      };

      if (ACTIVE_ORDER_DETAILS == '') {
        ACTIVE_ORDER_DETAILS = [];
      }
      if (AVAILABLE_ORDER_DETAILS == '') {
        AVAILABLE_ORDER_DETAILS = [];
      }
      if (COMPLETED_ORDER_DETAILS == '') {
        COMPLETED_ORDER_DETAILS = [];
      }

      await this.props.setActiveCount(ACTIVE_ORDER_DETAILS.length);
      await this.props.setAvailableCount(AVAILABLE_ORDER_DETAILS.length);
      await this.props.setDeliveredCount(COMPLETED_ORDER_DETAILS.length);
      await this.props.setAvailableOrders(AVAILABLE_ORDER_DETAILS);
      await this.props.setActiveOrders(ACTIVE_ORDER_DETAILS);
      await this.props.setCompletedOrders(COMPLETED_ORDER_DETAILS);

      await this.checkForNewOrder();
    } catch (e) {
      console.log('Refresh Error : ' + e);
      if (e.message == 'Request failed with status code 400') {
        var username = '';
        var password = '';

        AsyncStorage.getItem('username').then((value) => {
          username = value;
        });
        AsyncStorage.getItem('password').then((value) => {
          password = value;
        });

        if (username != '' && password != '') {
          this.autoLogin(username, password);
        } else {
          this.redirectToLogin();
        }
      }
    }
  };

  redirectActiveOrders = async () => {
    const dataService = new happyeater.DataService(CLIENT_OBJ);

    const fixUp = async (o) => {
      o.Store = await dataService.getStoreById(o.StoreId);
      o.FormattedPaymentMethod = o.Payments.some((p) => p.Source == 1)
        ? 'Cash Payment'
        : 'Card Payment';
      o.FormattedPaymentColor =
        o.FormattedPaymentMethod == 'Cash Payment' ? 'red' : 'green';

      const zone = 'Europe/London'; // Zone should really come the geographical location of the store we're testing
      if (o.TargetTime && o.TargetTime != '0001-01-01T00:00:00')
        o.TargetTime = moment.tz(o.TargetTime, zone).toDate();
      o.CreationTime = moment.tz(o.CreationTime, zone).toDate();
    };

    try {
      this.props.navigation.navigate('ActiveOrders');
      const driverService = new happyeater.DriverService(CLIENT_OBJ);
      const active_Orders = await driverService.getActiveOrders();
      for (let o of active_Orders) await fixUp(o);

      global.ACTIVE_ORDER_DETAILS = JSON.parse(JSON.stringify(active_Orders));

      await this.props.setActiveOrders(ACTIVE_ORDER_DETAILS);
    } catch (e) {
      console.log(e);
    }
  };

  redirectDeliveredOrders = async () => {
    const dataService = new happyeater.DataService(CLIENT_OBJ);

    const fixUp = async (o) => {
      o.Store = await dataService.getStoreById(o.StoreId);
      o.FormattedPaymentMethod = o.Payments.some((p) => p.Source == 1)
        ? 'Cash Payment'
        : 'Card Payment';
      o.FormattedPaymentColor =
        o.FormattedPaymentMethod == 'Cash Payment' ? 'red' : 'green';

      const zone = 'Europe/London'; // Zone should really come the geographical location of the store we're testing
      if (o.TargetTime && o.TargetTime != '0001-01-01T00:00:00')
        o.TargetTime = moment.tz(o.TargetTime, zone).toDate();
      o.CreationTime = moment.tz(o.CreationTime, zone).toDate();
    };

    try {
      this.props.navigation.navigate('CompletedOrders');
      const driverService = new happyeater.DriverService(CLIENT_OBJ);
      const completed_Orders = await driverService.getCompletedOrders();
      for (let o of completed_Orders) await fixUp(o);

      global.COMPLETED_ORDER_DETAILS = JSON.parse(
        JSON.stringify(completed_Orders),
      );
      await this.props.setCompletedOrders(COMPLETED_ORDER_DETAILS);
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    return (
      <RootView>
        <Menu />
        <AnimatedContainer>
          <Cover>
            <Image source={require('../assets/food_delivery.jpg')} />
            <Title></Title>
          </Cover>
          <TouchableOpacity
            style={{
              position: 'absolute',
              top: 75,
              left: '50%',
              marginLeft: -22,
              zIndex: 1,
            }}
            onPress={() => this.logoutModal()}>
            <CloseView>
              <Image source={require('../assets/happyeater.png')} />
            </CloseView>
          </TouchableOpacity>

          <SafeAreaView
            style={{
              backgroundColor: 'black',
              flex: 1,
              zIndex: -1,
            }}>
            <BannerComponent
              isActive={this.props.isBannerActive}></BannerComponent>
            <ActiveOrderContainer>
              <TouchableOpacity
                style={{paddingRight: 5}}
                onPress={() => this.redirectActiveOrders()}>
                <DashboardCard
                  key="ACTIVE_ORDERS"
                  image={require('../assets/delivered.png')}
                  text="Active"
                  count={this.props.activeCount}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{paddingRight: 5}}
                onPress={() => this.redirectDeliveredOrders()}>
                <DashboardCard
                  key="DELIVERED_ORDER"
                  image={require('../assets/logo-swift.png')}
                  text="Delivered"
                  count={this.props.deliveryCount}
                />
              </TouchableOpacity>
            </ActiveOrderContainer>

            {this.props.availableCount == 0 ? (
              <Subtitle>{this.props.availableCount} AVAILABLE ORDERS</Subtitle>
            ) : (
              <View>
                <Subtitle>
                  {this.props.availableCount} AVAILABLE ORDERS
                </Subtitle>
                <AvailableOrderView>
                  <CardContainer>
                    <ScrollView style={{height: '100%'}}>
                      {this.props.loadAvailableData.map((section, index) => (
                        <OrderCard
                          modalType={'ASSIGN_ORDER_MODAL'}
                          key={index}
                          Name={section.Name}
                          storeName={section.Store.Name}
                          storeAddress={section.Store.Address}
                          Address={section.Address}
                          phoneNumber={section.Phone}
                          details={this.props.loadAvailableData[index]}
                          orderid={'#' + section.Reference}
                          total={section.Total}
                          creationtime={new Date(
                            section.CreationTime,
                          ).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                          payment={section.FormattedPaymentMethod + ' Payment'}
                          // paymentColor={
                          //   section.FormattedPaymentMethod == "Cash"
                          //     ? "red"
                          //     : "green"
                          // }
                          amount={'£' + section.Payments[0].Amount}></OrderCard>
                      ))}
                    </ScrollView>
                  </CardContainer>
                </AvailableOrderView>
              </View>
            )}
          </SafeAreaView>
        </AnimatedContainer>
        <RBSheet
          ref={(ref) => {
            this.RBSheet = ref;
          }}
          height={(screenHeight * 20) / 100}
          closeOnSwipeDown={true}
          openDuration={250}
          customStyles={{
            container: {
              borderTopLeftRadius: 22,
              borderTopRightRadius: 22,
              background: '#0f4c75',
              // background: "red",
            },
          }}>
          <ScrollView style={{height: '100%'}}>
            <ModalSubtitle
              style={{
                opacity: 0.7,
              }}>
              ACCOUNT SETTINGS
            </ModalSubtitle>
            <TouchableOpacity
              onPress={() => this.logout()}
              style={{
                // flex: 1,
                height: '50%',
              }}>
              <ModalView
                style={{paddingLeft: 20, paddingTop: 20}}
                onPress={() => this.logout()}>
                <AntDesignIcon
                  name="poweroff"
                  size={25}
                  style={{
                    color: '#0f4c75',

                    fontWeight: 'bold',
                  }}
                />
                <ModalText style={{paddingLeft: 10}}> Logout</ModalText>
              </ModalView>
            </TouchableOpacity>
          </ScrollView>
        </RBSheet>
      </RootView>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);

const AvailableOrderView = styled.View`
  flex: 1;
`;

const ModalView = styled.View`
  flex: 1;
  flex-direction: row;
  text-align: right;
  /* justify-content: flex-end; */
`;

const View = styled.View`
  flex: 1;
`;

const Content = styled.View`
  height: ${screenHeight};
  background: #f0f3f5;
  padding: 50px;
`;

const Cover = styled.View`
  height: 100px;
  background: black;
  justify-content: center;
  align-items: center;
  /* opacity: 0.8; */
`;

const projects = [
  {
    title: 'Cash £34.20',
    image: require('../assets/background7.jpg'),
    author: '40 Western Road, Brrighton BN31JD',
    text: '13 Gilette Road, Bournemouth Poole, BH125BF',
  },
  {
    title: 'Cash £54.20',
    image: require('../assets/background8.jpg'),
    author: '40 Western Road, Brrighton BN31JD',
    text: '13 Gilette Road, Bournemouth Poole, BH125BF',
  },
  {
    title: 'Cash £74.20',
    image: require('../assets/background15.jpg'),
    author: '40 Western Road, Brrighton BN31JD',
    text: '13 Gilette Road, Bournemouth Poole, BH125BF',
  },
];

const CardContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  /* background: black; */
  margin-top: 5px;
`;

const Image = styled.Image`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 22px;
`;

const ActiveOrderContainer = styled.View`
  flex-direction: row;
  padding: 20px;
  padding-left: 5px;
  padding-top: 30px;
`;

const Title = styled.Text`
  color: black;
  font-size: 14px;
  /* font-weight: bold; */
`;

const Subtitle = styled.Text`
  color: rgba(255, 255, 255, 0.3);
  font-weight: bold;
  font-size: ${fontSize};
  margin-left: 20px;
  padding-top: 20px;
  text-transform: uppercase;
`;

const ModalSubtitle = styled.Text`
  color: black;
  font-weight: bold;
  font-size: ${fontSize};
  /* margin-left: 20px;
  padding-top: 20px; */
  padding: 15px;
  text-transform: uppercase;
`;

const ModalText = styled.Text`
  color: black;
  font-weight: bold;
  font-size: ${fontSize};
`;

const CloseView = styled.View`
  width: 44px;
  height: 44px;
  border-radius: 22px;
  background: white;
  justify-content: center;
  align-items: center;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(0, 0, 0, 0.1);
`;

const RootView = styled.View`
  background: #121212;
  flex: 1;
`;

const Container = styled.View`
  flex: 1;
  background-color: #f0f3f5;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;

  position: absolute;
  background: white;
  width: ${cardWidth};
  align-self: center;
  height: 100%;
  z-index: 100;
  border-radius: 10px;
  overflow: hidden;
`;

const AnimatedContainer = Animated.createAnimatedComponent(Container);

const items = [
  {
    icon: 'ios-settings',
    title: 'Account',
    text: 'settings',
  },
  {
    icon: 'ios-card',
    title: 'Billing',
    text: 'payments',
  },
  {
    icon: 'ios-compass',
    title: 'Learn React',
    text: 'start course',
  },
  {
    icon: 'ios-exit',
    title: 'Log out',
    text: 'see you soon!',
  },
];

const styles = StyleSheet.create({
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
});
