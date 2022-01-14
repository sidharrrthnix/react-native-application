import * as React from "react";
import { Dimensions } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import Home from "../Screens/Home";
import Login from "../Screens/Login";
import ActiveOrders from "../Screens/ActiveOrders";
import CompletedOrders from "../Screens/CompletedOrders";
import ProjectsScreen from "../Screens/ProjectsScreen";
import { fromLeft } from "react-navigation-transitions";

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

const Stack = createStackNavigator();

const MyStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: true,
        }}
      >
        
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ title: "Home", headerShown: false }}
        />

        <Stack.Screen
          name="ActiveOrders"
          component={ActiveOrders}
          options={{
            title: "Active Orders",
            headerStyle: {
              backgroundColor: "black",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: fontSize,
            },
          }}
        />
        <Stack.Screen
          name="CompletedOrders"
          component={CompletedOrders}
          options={{
            title: "Completed Orders",
            headerStyle: {
              backgroundColor: "black",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: fontSize,
            },
          }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ title: "Login", headerShown: false }}
        />
        <Stack.Screen
          name="ProjectsScreen"
          component={ProjectsScreen}
          options={{ title: "ProjectsScreen", headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MyStack;
