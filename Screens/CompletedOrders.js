import React from 'react';
import {connect} from 'react-redux';
import styled from 'styled-components';
import OrderCard from '../Components/OrderCard';
import {TouchableOpacity, Animated, Dimensions, StyleSheet} from 'react-native';
import {SafeAreaView, ScrollView} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import Charts from '../Components/Charts';

import Menu from '../Components/Menu';
import {
  VictoryBar,
  VictoryChart,
  VictoryTheme,
  VictoryLabel,
  VictoryAxis,
} from 'victory-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

var cardWidth = screenWidth;
if (screenWidth > 500) {
  cardWidth = 500;
}

function mapStateToProps(state) {
  return {loadCompletedData: state.loadCompletedData};
}

function mapDispatchToProps(dispatch) {
  return {};
}

const data = [
  {quarter: 'Sun', earnings: 7},
  {quarter: 'Mon', earnings: 4},
  {quarter: 'Tue', earnings: 7},
  {quarter: 'Wed', earnings: 12},
  {quarter: 'Thu', earnings: 8},
  {quarter: 'Fri', earnings: 6},
  {quarter: 'Sat', earnings: 4},
];

class CompletedOrders extends React.Component {
  state = {
    isModalVisible: false,
    CURRENT_MODAL: '',
    CURRENT_MODAL_OBJECT: null,
  };

  componentDidUpdate() {}

  assignOrderModal = () => (
    <View>
      <TouchableOpacity
        style={{
          flex: 1,
          top: 0,
          left: '90%',
          opacity: 0.5,
          zIndex: 1,
        }}
        onPress={() => {
          this.RBSheet.close();
          this.state.CURRENT_MODAL = '';
          this.state.CURRENT_MODAL_OBJECT = null;
        }}></TouchableOpacity>
      <Title></Title>
    </View>
  );

  handlePress(evt, props) {
    console.log('Welcome');
  }

  render() {
    return (
      <RootView>
        <AnimatedContainer>
          <SafeAreaView
            style={{
              backgroundColor: 'black',
              flex: 1,
              zIndex: -1,
            }}>
            {/* <Charts></Charts> */}
            <CardContainer>
              <ScrollView style={{height: '100%'}}>
                {this.props.loadCompletedData.map((section, index) => (
                  <OrderCard
                    modalType={'COMPLETED_ORDER_MODAL'}
                    key={index}
                    Name={section.Name}
                    storeName={section.Store.Name}
                    storeAddress={section.Store.Address}
                    Address={section.Address}
                    details={this.props.loadCompletedData[index]}
                    orderid={'#' + section.Reference}
                    total={section.Total}
                    creationtime={new Date(
                      section.CreationTime,
                    ).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                    payment={section.FormattedPaymentMethod + ' Payment'}
                    amount={'£' + section.Payments[0].Amount}
                    icon={'heart'}
                    iconColor={'#ff684f'}></OrderCard>
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
              justifyContent: 'center',
              alignItems: 'center',
            },
          }}>
          {this.state.CURRENT_MODAL == 'COMPLETED_ORDER_MODAL'
            ? this.assignOrderModal()
            : null}
        </RBSheet>
      </RootView>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CompletedOrders);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const View = styled.View`
  flex: 1;
`;

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
