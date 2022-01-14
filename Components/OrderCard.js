import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import {
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Linking,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

import RBSheet from "react-native-raw-bottom-sheet";
import DeliveredIcon from "../Components/Icons";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Home from "../Screens/Home";
import { showMessage, hideMessage } from "react-native-flash-message";

const moment = require("moment-timezone");

var happyeater = require("../Components/HappyEater");

const screenWidth = Dimensions.get("window").width;

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

function getCourseWidth(screenWidth) {
  var cardWidth = screenWidth - 40;
  if (screenWidth >= 768) {
    cardWidth = (screenWidth - 60) / 2;
  }
  if (screenWidth >= 1024) {
    cardWidth = (screenWidth - 80) / 3;
  }
  return cardWidth;
}

function mapStateToProps(state) {
  return {
    action: state.action,
    stateLoader: state.stateLoader,
    loadAvailableData: state.loadAvailableData,
    loadActiveData: state.loadActiveData,
    loadCompletedData: state.loadCompletedData,
    activeCount: state.activeCount,
    availableCount: state.availableCount,
    deliveryCount: state.deliveryCount,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadState: (state_name) =>
      dispatch({
        type: "LOAD_STATE",
        state_name,
      }),
    setAvailableOrders1: (available_orders) =>
      dispatch({
        type: "UPDATE_AVAILABLE_ORDERS",
        available_orders,
      }),
    setActiveOrders1: (active_orders) =>
      dispatch({
        type: "UPDATE_ACTIVE_ORDERS",
        active_orders,
      }),
    setCompletedOrders1: (completed_orders) =>
      dispatch({
        type: "UPDATE_COMPLETED_ORDERS",
        completed_orders,
      }),

    setActiveCount1: (active_count) =>
      dispatch({
        type: "UPDATE_ACTIVE_COUNT",
        active_count,
      }),
    setAvailableCount1: (available_count) =>
      dispatch({
        type: "UPDATE_AVAILABLE_COUNT",
        available_count,
      }),
    setDeliveredCount1: (delivery_count) =>
      dispatch({
        type: "UPDATE_DELIVERY_COUNT",
        delivery_count,
      }),
  };
}

const screenHeight = Dimensions.get("window").height;

class OrderCard extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    cardWidth: getCourseWidth(screenWidth),
    isModalVisible: false,
    CURRENT_MODAL: "",
    CURRENT_MODAL_OBJECT: null,
  };

  componentDidMount() {
    Dimensions.addEventListener("change", this.adaptLayout);
  }

  componentDidUpdate() {}

  adaptLayout = (dimensions) => {
    this.setState({
      cardWidth: getCourseWidth(dimensions.window.width),
    });
  };

  alertMessage = async (message, type) => {
    showMessage({
      message: message,
      type: type,
    });
  };

  assignOrder = async () => {
    try {
      const driverService = new happyeater.DriverService(CLIENT_OBJ);
      var value = await driverService.claimOrder(
        this.state.CURRENT_MODAL_OBJECT.Id
      );
      if (value.Success) {
        this.alertMessage("Order assigned successfully", "success");
        this.reloadData();
      } else {
        this.alertMessage("Error assigning order", "danger");
      }
    } catch (e) {
      console.log(e);
      this.alertMessage("Unexpected error while assigning order", "danger");
      this.reloadData();
    }

    this.RBSheet.close();
    this.state.CURRENT_MODAL = "";
    this.state.CURRENT_MODAL_OBJECT = null;
  };

  reloadData = async () => {
    try {
      const driverService = new happyeater.DriverService(CLIENT_OBJ);
      const dataService = new happyeater.DataService(CLIENT_OBJ);
      const availableOrders = await driverService.getAvailableOrders();
      const activeOrders = await driverService.getActiveOrders();
      const completedOrders = await driverService.getCompletedOrders();

      const fixUp = async (o) => {
        o.Store = await dataService.getStoreById(o.StoreId);
        o.FormattedPaymentMethod = o.Payments.some((p) => p.Source == 1)
          ? "Cash Payment"
          : "Card Payment";

        o.FormattedPaymentColor =
          o.FormattedPaymentMethod == "Cash Payment" ? "red" : "green";

        const zone = "Europe/London"; // Zone should really come the geographical location of the store we're testing
        if (o.TargetTime && o.TargetTime != "0001-01-01T00:00:00")
          o.TargetTime = moment.tz(o.TargetTime, zone).toDate();
        o.CreationTime = moment.tz(o.CreationTime, zone).toDate();
      };

      for (let o of availableOrders) await fixUp(o);
      for (let o of activeOrders) await fixUp(o);
      for (let o of completedOrders) await fixUp(o);

      global.AVAILABLE_ORDER_DETAILS = JSON.parse(
        JSON.stringify(availableOrders)
      );
      global.COMPLETED_ORDER_DETAILS = JSON.parse(
        JSON.stringify(completedOrders)
      );
      global.ACTIVE_ORDER_DETAILS = JSON.parse(JSON.stringify(activeOrders));

      const data = {
        availableOrders: AVAILABLE_ORDER_DETAILS,
        activeOrders: ACTIVE_ORDER_DETAILS,
        completedOrders: COMPLETED_ORDER_DETAILS,
      };

      if (ACTIVE_ORDER_DETAILS == "") {
        ACTIVE_ORDER_DETAILS = [];
      }
      if (AVAILABLE_ORDER_DETAILS == "") {
        AVAILABLE_ORDER_DETAILS = [];
      }
      if (COMPLETED_ORDER_DETAILS == "") {
        COMPLETED_ORDER_DETAILS = [];
      }

      await this.props.setActiveCount1(ACTIVE_ORDER_DETAILS.length);
      await this.props.setAvailableCount1(AVAILABLE_ORDER_DETAILS.length);
      await this.props.setDeliveredCount1(COMPLETED_ORDER_DETAILS.length);
      await this.props.setAvailableOrders1(AVAILABLE_ORDER_DETAILS);
      await this.props.setActiveOrders1(ACTIVE_ORDER_DETAILS);
    } catch (e) {
      console.log("reloadData Error : " + e);
    }
  };

  rejectOrder = async () => {
    try {
      const driverService = new happyeater.DriverService(CLIENT_OBJ);
      var value = await driverService.unclaimOrder(
        this.state.CURRENT_MODAL_OBJECT.Id
      );
      this.alertMessage("Order rejected successfully", "info");
      this.reloadData();
    } catch (e) {
      this.alertMessage("Unexpected error while rejecting the order", "danger");
      this.reloadData();
      console.log(e);
    }

    this.RBSheet.close();
    this.state.CURRENT_MODAL = "";
    this.state.CURRENT_MODAL_OBJECT = null;
  };

  dispatchOrder = async () => {
    try {
      const driverService = new happyeater.DriverService(CLIENT_OBJ);
      var value = await driverService.dispatchOrder(
        this.state.CURRENT_MODAL_OBJECT.Id
      );
      this.alertMessage("Order dispatched successfully", "success");
      this.reloadData();
    } catch (e) {
      console.log(e);
      this.alertMessage(
        "Unexpected error while dispatching the order",
        "danger"
      );
      this.reloadData();
    }

    this.RBSheet.close();
    this.state.CURRENT_MODAL = "";
    this.state.CURRENT_MODAL_OBJECT = null;
  };

  completeOrder = async () => {
    try {
      const driverService = new happyeater.DriverService(CLIENT_OBJ);
      var value = await driverService.completeOrder(
        this.state.CURRENT_MODAL_OBJECT.Id
      );
      this.alertMessage("Order Completed successfully", "success");
      this.reloadData();
    } catch (e) {
      console.log(e);
      this.alertMessage(
        "Unexpected error while completing the order",
        "danger"
      );
      this.reloadData();
    }

    this.RBSheet.close();
    this.state.CURRENT_MODAL = "";
    this.state.CURRENT_MODAL_OBJECT = null;
  };

  assignOrderModal = () => (
    <View>
      <ModalAddressView></ModalAddressView>
      <ModalOrderDetails>
        <ModalAddressview1>
          <ModalTitle>{this.state.CURRENT_MODAL_OBJECT.Store.Name}</ModalTitle>
          <ModalAddress1>
            {this.state.CURRENT_MODAL_OBJECT.Store.Address}
          </ModalAddress1>
        </ModalAddressview1>
        <View
          style={{
            borderBottomColor: "#d7dadd",
            borderBottomWidth: 2,
            marginLeft: 30,
            marginRight: 40,
            marginTop: 10,
          }}
        />
        <ModalAddressview2>
          <ModalTitle>{this.state.CURRENT_MODAL_OBJECT.Name}</ModalTitle>
          <ModalAddress1>
            {this.state.CURRENT_MODAL_OBJECT.Address}{" "}
          </ModalAddress1>
          <ModalPhoneNumberView>
            <MaterialIcons
              name="call"
              size={25}
              style={{
                color: "#0f4c75",
                fontWeight: "bold",
              }}
              onPress={() => {
                Linking.openURL("tel:" + this.state.CURRENT_MODAL_OBJECT.Phone);
              }}
            />
            <ModalAddress1
              style={{ color: "#0f4c75" }}
              onPress={() => {
                Linking.openURL("tel:" + this.state.CURRENT_MODAL_OBJECT.Phone);
              }}
            >
              {this.state.CURRENT_MODAL_OBJECT.Phone}
            </ModalAddress1>
          </ModalPhoneNumberView>
        </ModalAddressview2>
        <View
          style={{
            borderBottomColor: "#d7dadd",
            borderBottomWidth: 2,
            marginLeft: 30,
            marginRight: 40,
            marginTop: 10,
          }}
        />
        <ModalTimeView
          style={{
            width: this.state.cardWidth,
          }}
        >
          <ModalTimeText
            style={{
              width: (this.state.cardWidth * 50) / 100,
              textAlign: "left",
              opacity: 0.7,
            }}
          >
            Time{" "}
          </ModalTimeText>
          <ModalTime
            style={{
              width: (this.state.cardWidth * 50) / 100,
              textAlign: "right",
              opacity: 0.7,
            }}
          >
            {new Date(
              this.state.CURRENT_MODAL_OBJECT.CreationTime
            ).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </ModalTime>
        </ModalTimeView>

        <ModalOrderID>
          #{this.state.CURRENT_MODAL_OBJECT.Reference}
        </ModalOrderID>

        <ModalPrice>
          £{this.state.CURRENT_MODAL_OBJECT.Payments[0].Amount}
        </ModalPrice>
        <ModalPaymentType
          style={{
            color: this.state.CURRENT_MODAL_OBJECT.FormattedPaymentColor,
          }}
        >
          {this.state.CURRENT_MODAL_OBJECT.FormattedPaymentMethod}
        </ModalPaymentType>
        <TouchableOpacity
          style={{
            top: 30,
            alignItems: "center",
            zIndex: 1,
            textAlignVertical: "center",
          }}
          onPress={() => {
            this.assignOrder();
          }}
        >
          <Button>
            <ButtonText style={{ textAlignVertical: "center" }}>
              {" "}
              Assign to Me
            </ButtonText>
          </Button>
        </TouchableOpacity>
      </ModalOrderDetails>
      <ModalCover></ModalCover>
    </View>
  );

  activeOrderModal = () => (
    <View>
      <ModalAddressView></ModalAddressView>
      <ModalOrderDetails>
        <ModalAddressview1>
          <ModalTitle>{this.state.CURRENT_MODAL_OBJECT.Store.Name}</ModalTitle>
          <ModalAddress1>
            {this.state.CURRENT_MODAL_OBJECT.Store.Address}
          </ModalAddress1>
        </ModalAddressview1>
        <View
          style={{
            borderBottomColor: "#d7dadd",
            borderBottomWidth: 2,
            marginLeft: 30,
            marginRight: 40,
            marginTop: 10,
          }}
        />
        <ModalAddressview2>
          <ModalTitle>{this.state.CURRENT_MODAL_OBJECT.Name}</ModalTitle>
          <ModalAddress1>
            {this.state.CURRENT_MODAL_OBJECT.Address}{" "}
          </ModalAddress1>
          <ModalPhoneNumberView>
            <MaterialIcons
              name="call"
              size={25}
              style={{
                color: "#0f4c75",
                fontWeight: "bold",
              }}
              onPress={() => {
                Linking.openURL("tel:" + this.state.CURRENT_MODAL_OBJECT.Phone);
              }}
            />
            <ModalAddress1
              style={{ color: "#0f4c75" }}
              onPress={() => {
                Linking.openURL("tel:" + this.state.CURRENT_MODAL_OBJECT.Phone);
              }}
            >
              {this.state.CURRENT_MODAL_OBJECT.Phone}
            </ModalAddress1>
          </ModalPhoneNumberView>
        </ModalAddressview2>
        <View
          style={{
            borderBottomColor: "#d7dadd",
            borderBottomWidth: 2,
            marginLeft: 30,
            marginRight: 40,
            marginTop: 10,
          }}
        />
        <ModalTimeView
          style={{
            width: this.state.cardWidth,
          }}
        >
          <ModalTimeText
            style={{
              width: (this.state.cardWidth * 75) / 100,
              textAlign: "left",
              opacity: 0.7,
            }}
          >
            Time{" "}
          </ModalTimeText>
          <ModalTime
            style={{
              width: (this.state.cardWidth * 25) / 100,
              textAlign: "right",
              opacity: 0.7,
            }}
          >
            {new Date(
              this.state.CURRENT_MODAL_OBJECT.CreationTime
            ).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </ModalTime>
        </ModalTimeView>

        <ModalOrderID>
          #{this.state.CURRENT_MODAL_OBJECT.Reference}
        </ModalOrderID>

        <ModalPrice>
          £{this.state.CURRENT_MODAL_OBJECT.Payments[0].Amount}
        </ModalPrice>
        <ModalPaymentType
          style={{
            color: this.state.CURRENT_MODAL_OBJECT.FormattedPaymentColor,
          }}
        >
          {this.state.CURRENT_MODAL_OBJECT.FormattedPaymentMethod}
        </ModalPaymentType>
        <ModalRowView style={{ alignItems: "center", marginLeft: 10 }}>
          {this.state.CURRENT_MODAL_OBJECT.State == 0 ||
          this.state.CURRENT_MODAL_OBJECT.State == 10 ? (
            <TouchableOpacity
              style={{
                top: 30,
                alignItems: "center",
                zIndex: 1,
                padding: 10,
                // backgroundColor: "black",
              }}
              onPress={() => {
                this.rejectOrder();
              }}
            >
              <ActiveOrderButton style={{ backgroundColor: "#dc3545" }}>
                <ActiveOrderButtonText> Reject</ActiveOrderButtonText>
              </ActiveOrderButton>
            </TouchableOpacity>
          ) : null}

          {this.state.CURRENT_MODAL_OBJECT.State != 10 ? (
            <TouchableOpacity
              style={{
                top: 30,
                alignItems: "center",
                zIndex: 1,
                padding: 10,
              }}
              onPress={() => {
                this.dispatchOrder();
              }}
            >
              <ActiveOrderButton style={{ backgroundColor: "#007bff" }}>
                <ActiveOrderButtonText>Dispatch</ActiveOrderButtonText>
              </ActiveOrderButton>
            </TouchableOpacity>
          ) : null}

          {this.state.CURRENT_MODAL_OBJECT.State == 0 ||
          this.state.CURRENT_MODAL_OBJECT.State == 10 ? (
            <TouchableOpacity
              style={{
                top: 30,
                alignItems: "center",
                zIndex: 1,
                padding: 10,
              }}
              onPress={() => {
                this.completeOrder();
              }}
            >
              <ActiveOrderButton style={{ backgroundColor: "#28a745" }}>
                <ActiveOrderButtonText>Complete</ActiveOrderButtonText>
              </ActiveOrderButton>
            </TouchableOpacity>
          ) : null}
        </ModalRowView>
      </ModalOrderDetails>
      <ModalCover></ModalCover>

      {/* <ModalCover></ModalCover> */}
    </View>
  );

  openModal = async (TYPE, DATA) => {
    if (TYPE == "ACTIVE_ORDER_MODAL" || TYPE == "ASSIGN_ORDER_MODAL") {
      this.setState({ CURRENT_MODAL: TYPE });
      this.setState({ CURRENT_MODAL_OBJECT: DATA });
      this.RBSheet.open();
    }
  };

  render() {
    return (
      <TouchableOpacity
        style={{ paddingRight: 5 }}
        onPress={() => this.openModal(this.props.modalType, this.props.details)}
        key={this.props.index}
      >
        <Container
          style={{
            width: this.state.cardWidth,
            backgroundColor:
              this.props.orderState == 10 ? "#d29d63" : "#d5dde4",
          }}
        >
          <Content
            style={{
              width: this.state.cardWidth,
            }}
          >
            <Icon
              name={this.props.icon ? this.props.icon : "tag"}
              size={25}
              style={{
                color: this.props.iconColor ? this.props.iconColor : "#0f4c75",
                padding: 10,
                width: (this.state.cardWidth * 20) / 100,
              }}
            />
            <OrderID
              style={{
                width: (this.state.cardWidth * 40) / 100,
              }}
            >
              {this.props.orderid}
            </OrderID>
            <Price
              style={{
                width: (this.state.cardWidth * 40) / 100,
                paddingLeft: 5,
              }}
            >
              {this.props.amount}
            </Price>
          </Content>
          <Content
            style={{
              width: this.state.cardWidth,
            }}
          >
            <EmptyView
              style={{
                width: (this.state.cardWidth * 20) / 100,
              }}
            ></EmptyView>
            <Time
              style={{
                width: (this.state.cardWidth * 40) / 100,
              }}
            >
              {this.props.creationtime}
            </Time>
            <PaymentType
              style={{
                color: this.props.details.FormattedPaymentColor,
                width: (this.state.cardWidth * 40) / 100,
                paddingLeft: 5,
              }}
            >
              {this.props.details.FormattedPaymentMethod}
            </PaymentType>
          </Content>

          <AddressView
            style={{
              width: this.state.cardWidth,
            }}
          >
            <Addressview1
              style={{
                width: (this.state.cardWidth * 35) / 100,
              }}
            >
              <Title>
                {this.props.storeName.length > 20
                  ? this.props.storeName.substring(0, 20) + "..."
                  : this.props.storeName}
              </Title>
              <Address1>{this.props.storeAddress}</Address1>
            </Addressview1>
            <Addressview2
              style={{
                width: (this.state.cardWidth * 45) / 100,
              }}
            >
              <Title>{this.props.Name}</Title>
              <Address1>{this.props.Address} </Address1>
            </Addressview2>

            <Icon
              name="angle-right"
              size={25}
              style={{
                color: "#0f4c75",
                fontWeight: "bold",
                width: (this.state.cardWidth * 20) / 100,
                textAlignVertical: "top",
              }}
            />
          </AddressView>
          <Cover style={{}}></Cover>
        </Container>

        <RBSheet
          ref={(ref) => {
            this.RBSheet = ref;
          }}
          height={(screenHeight * 90) / 100}
          closeOnSwipeDown={true}
          openDuration={250}
          customStyles={{
            container: {
              // justifyContent: "center",
              // alignItems: "center",
              borderTopLeftRadius: 22,
              borderTopRightRadius: 22,
              background: "#0f4c75",
            },
          }}
        >
          {this.state.CURRENT_MODAL == "ASSIGN_ORDER_MODAL"
            ? this.assignOrderModal()
            : null}
          {this.state.CURRENT_MODAL == "ACTIVE_ORDER_MODAL"
            ? this.activeOrderModal()
            : null}
        </RBSheet>
      </TouchableOpacity>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderCard);

const ModalPhoneNumberView = styled.View`
  flex-direction: row;
`;

const ModalRowView = styled.View`
  flex-direction: row;
  justify-content: center;
`;

const ModalTimeView = styled.View`
  flex-direction: row;
  margin-top: 10;
  font-size: ${fontSize};
`;

const ModalTimeText = styled.Text`
  /* font-size: 16px; */
  font-size: ${fontSize};
  font-weight: bold;
  padding-left: 30px;
  /* margin-top: -5px; */
  color: black;
`;

const View = styled.View`
  display: flex;
  flex-direction: column;
  border-radius: 20px;
`;

const AddressView = styled.View`
  flex-direction: row;
  padding: 20px;
  font-size: 14px;
`;

const ModalAddressView = styled.View`
  flex-direction: row;
  /* margin: 10px; */
  padding-top: 10px;
  font-size: 40px;
`;

const ModalOrderDetails = styled.View`
  flex-direction: column;
`;

const Addressview1 = styled.View`
  /* width: 100px; */
  margin-left: 10px;
  /* width: 40%; */
  flex-direction: column;
  font-size: ${fontSize};
`;

const Title = styled.Text`
  color: black;
  font-weight: bold;
  font-size: ${fontSize - 3};
  /* flex: 0.5; */
  /* text-overflow: ellipsis; */
`;

const Address1 = styled.Text`
  color: black;
  font-size: ${fontSize - 3};
`;

const Addressview2 = styled.View`
  margin-left: 20px;
  font-size: ${fontSize};
`;

const ModalAddressview2 = styled.View`
  margin-left: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
  text-align: right;
`;

const ModalAddressview1 = styled.View`
  margin-left: 10px;
  font-size: ${fontSize};
  width: 50%;
`;

const ModalTitle = styled.Text`
  color: black;
  font-weight: bold;
  font-size: ${fontSize};
`;

const ModalAddress1 = styled.Text`
  color: black;
  font-size: ${fontSize};
`;

const Container = styled.View`
  height: 180px;
  margin: 10px 10px;
  border-radius: 14px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
`;

const Content = styled.View`
  flex-direction: row;
`;

const Time = styled.Text`
  font-size: ${fontSize};
  font-weight: bold;
  color: black;
  opacity: 0.5;
`;

const ModalTime = styled.Text`
  font-size: ${fontSize};
  font-weight: bold;
  color: black;
  justify-content: flex-end;
`;

const PaymentType = styled.Text`
  font-size: ${fontSize};
  font-weight: bold;
`;

const ModalPaymentType = styled.Text`
  font-size: ${fontSize};
  font-weight: bold;
  text-align: center;
`;

const Price = styled.Text`
  font-size: ${fontSize};
  color: green;
  font-weight: bold;
  margin-top: 10px;
`;

const ModalPrice = styled.Text`
  font-size: ${fontSize + 10};
  color: green;
  font-weight: bold;
  text-align: center;
`;

const OrderID = styled.Text`
  font-size: ${fontSize};
  color: #0f4c75;
  font-weight: bold;
  margin-top: 10px;
`;

const EmptyView = styled.View``;

const ModalOrderID = styled.Text`
  font-size: ${fontSize};
  color: #0f4c75;
  font-weight: bold;
  margin-top: 10px;
  text-align: center;
`;

const ModalTitleText = styled.Text`
  font-size: 20px;
  color: #0f4c75;
  font-weight: bold;
  text-align: center;
`;

const Cover = styled.View`
  position: absolute;
  width: 0;
  height: 0;
  top: 0;
  left: 0px;
  border-top-left-radius: 14px;
  border-bottom-right-radius: 120px;
  border-bottom-left-radius: 14px;
  background-color: #f5f8ff;
  border-style: solid;
  border-right-width: 60;
  border-top-width: 60;
  border-right-color: #f5f8ff;
  border-top-color: #f5f8ff;
  z-index: -1;
`;

const ModalCover = styled.View`
  position: absolute;
  width: 0;
  height: 0;
  top: 0;
  left: 0px;
  border-top-left-radius: 14px;
  border-bottom-right-radius: 120px;
  border-bottom-left-radius: 14px;
  background-color: #f5f8ff;
  border-style: solid;
  border-right-width: 150;
  border-top-width: 150;
  border-right-color: #f5f8ff;
  border-top-color: #f5f8ff;
  z-index: -1;
`;

const Button = styled.View`
  background: #5263ff;
  width: ${screenWidth / 2};
  height: 30px;
  border-radius: 20px;
  box-shadow: 0 10px 20px #c2cbff;
  text-align: center;
  margin: 0;
`;
const ButtonText = styled.Text`
  color: white;
  font-size: ${fontSize};
  text-align: center;
  padding: 2px;
`;

const ActiveOrderButton = styled.View`
  /* background: #5263ff; */
  width: ${screenWidth / 4};
  height: 30px;
  border-radius: 11px;
  box-shadow: 0 10px 20px #c2cbff;
  text-align: center;
  margin: 0;
`;
const ActiveOrderButtonText = styled.Text`
  color: white;
  font-size: ${fontSize};
  text-align: center;
  padding-top: 2px;
`;
