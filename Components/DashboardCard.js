import React from 'react';
import styled from 'styled-components';
import {
  TouchableOpacity,
  Dimensions,
  BackHandler,
  Animated,
  Easing,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Animatable from 'react-native-animatable';

const screenWidth = Dimensions.get('window').width;
var width = screenWidth / 2;
width = width - 25;

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

const DashboardCard = (props) => (
  <Container>
    {/* <Cover></Cover> */}

    <CardView>
      <TopView style={{alignItems: 'flex-end', padding: 15}}>
        {/* <Animatable.Text
        animation="slideInDown"
        iterationCount="infinite"
        direction="alternate"
      >
        Up and down you go
      </Animatable.Text> */}
        <Animatable.Image
          animation="zoomInUp"
          iterationCount={1}
          // direction="alternate"
          source={props.image}
          resizeMode="contain"
          style={{width: 36, height: 36}}
        />
      </TopView>

      <CountView>
        <DummyView></DummyView>
        <View>
          <Count>{props.count}</Count>
          <Text>{props.text}</Text>
        </View>
        <Icon
          name="angle-right"
          size={fontSize}
          style={{
            color: 'gray',
            opacity: 0.5,
            textAlignVertical: 'center',
          }}
        />
      </CountView>
    </CardView>
  </Container>
);

export default DashboardCard;

const CardView = styled.View``;

const CountView = styled.View`
  flex-direction: row;
  /* height: ${(width * 45) / 100}; */
  height: ${(width * 35) / 100};
`;

const DummyView = styled.View`
  width: ${(width * 3) / 100};
`;

const View = styled.View`
  width: ${(width * 77) / 100};
  margin-left: 15px;
`;

const TopView = styled.View`
  /* width: ${width}; */
  height: ${(width * 65) / 100};
`;

const Image = styled.Image`
  width: 36px;
  height: 36px;
`;

const Container = styled.View`
  flex-direction: column;
  background: white;
  height: ${width};
  width: ${width};
  border-radius: 11px;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.5);
  margin: 0 8px;
  z-index: 1;
  background: #d5dde4;
  box-shadow: 10px 5px 5px gray;
`;

const Count = styled.Text`
  font-weight: bold;
  font-size: ${fontSize};
  color: #0dbd5a;
`;

const Text = styled.Text`
  font-weight: bold;
  font-size: ${fontSize};
`;
