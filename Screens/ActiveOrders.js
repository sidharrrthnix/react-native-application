import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import OrderCard from "../Components/OrderCard";
import {
  TouchableOpacity,
  Animated,
  Dimensions,
  StyleSheet,
} from "react-native";
import { SafeAreaView, ScrollView } from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";

import Menu from "../Components/Menu";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

var cardWidth = screenWidth;
if (screenWidth > 500) {
  cardWidth = 500;
}

function mapStateToProps(state) {
  return { loadActiveData: state.loadActiveData };
}

function mapDispatchToProps(dispatch) {
  return {};
}

class ActiveOrders extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.state = props;
  // }

  state = {
    isModalVisible: false,
    CURRENT_MODAL: "",
    CURRENT_MODAL_OBJECT: null,
  };

  componentDidUpdate() {}

  SecondClassFunction = () => {
    alert("Second Class Function Without Argument Called");
  };

  assignOrderModal = () => (
    <View>
      <TouchableOpacity
        style={{
          flex: 1,
          top: 0,
          left: "90%",
          opacity: 0.5,
          zIndex: 1,
        }}
        onPress={() => {
          this.RBSheet.close();
          this.state.CURRENT_MODAL = "";
          this.state.CURRENT_MODAL_OBJECT = null;
        }}
      ></TouchableOpacity>
      <Title>asd</Title>
    </View>
  );

  // openModal = async (TYPE, index) => {
  //   // this.refresh();
  //   // if (index) {
  //   //   var data = this.props.loadAvailableData[index];
  //   //   this.setState({ CURRENT_MODAL: TYPE });
  //   //   this.setState({ CURRENT_MODAL_OBJECT: data });
  //   //   this.RBSheet.open();
  //   // }
  // };

  render() {
    return (
      <RootView>
        <Menu />
        <AnimatedContainer>
          <SafeAreaView
            style={{
              backgroundColor: "black",
              flex: 1,
              zIndex: -1,
            }}
          >
            <CardContainer>
              <ScrollView style={{ height: "100%" }}>
                {this.props.loadActiveData.map((section, index) => (
                  <OrderCard
                    modalType={"ACTIVE_ORDER_MODAL"}
                    key={index}
                    Name={section.Name}
                    storeName={section.Store.Name}
                    storeAddress={section.Store.Address}
                    Address={section.Address}
                    details={this.props.loadActiveData[index]}
                    orderid={"#" + section.Reference}
                    total={section.Total}
                    creationtime={new Date(
                      section.CreationTime
                    ).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    payment={section.FormattedPaymentMethod + " Payment"}
                    amount={"£" + section.Payments[0].Amount}
                    icon={"check"}
                    iconColor={"#0dbd5a"}
                    cardColor={"red"}
                    orderState={section.State}
                  ></OrderCard>
                ))}
              </ScrollView>
            </CardContainer>
          </SafeAreaView>
        </AnimatedContainer>

        <RBSheet
          ref={(ref) => {
            this.RBSheet = ref;
          }}
          height={screenHeight / 3}
          closeOnSwipeDown={true}
          openDuration={250}
          customStyles={{
            container: {
              justifyContent: "center",
              alignItems: "center",
            },
          }}
        >
          {this.state.CURRENT_MODAL == "ACTIVE_ORDER_MODAL"
            ? this.assignOrderModal()
            : null}
        </RBSheet>
      </RootView>
    );
  }
}

const active = connect(mapStateToProps, mapDispatchToProps)(ActiveOrders);

export default active;

const View = styled.View``;

const CardContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  /* background: black; */
  margin-top: 5px;
`;

const Subtitle = styled.Text`
  color: rgba(255, 255, 255, 0.3);
  font-weight: bold;
  font-size: 15px;
  margin-left: 20px;
  margin-top: 0px;
  text-transform: uppercase;
`;

const RootView = styled.View`
  background: black;
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
