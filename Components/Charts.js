import React from "react";
import styled from "styled-components";
import { StyleSheet } from "react-native";
import { VictoryBar, VictoryChart, VictoryTheme } from "victory-native";

const data = [
  { quarter: "Sun", earnings: 7 },
  { quarter: "Mon", earnings: 4 },
  { quarter: "Tue", earnings: 7 },
  { quarter: "Wed", earnings: 12 },
  { quarter: "Thu", earnings: 8 },
  { quarter: "Fri", earnings: 6 },
  { quarter: "Sat", earnings: 4 },
];

class Charts extends React.Component {
  componentDidMount() {}

  render() {
    return (
      <View style={styles.container}>
        <VictoryChart
          width={400}
          theme={VictoryTheme.grayscale}
          domainPadding={{ x: 40 }}
          alignment="start"
          barRatio={0.8}
          style={{
            marginLeft: 120,
            axis: { stroke: "transparent" },
            ticks: { stroke: "transparent" },
            tickLabels: { fill: "transparent" },
          }}
        >
          <VictoryBar
            data={data}
            cornerRadius={5}
            x="quarter"
            y="earnings"
            animate={{
              duration: 100,
              onLoad: { duration: 500 },
            }}
            style={{
              data: {
                fill: "#ff684f",
                padding: 8,
                strokeWidth: 0,
              },
            }}
          />
        </VictoryChart>
      </View>
    );
  }
}

export default Charts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

const View = styled.View`
  flex: 1;
  /* padding-top: 50px; */
`;
