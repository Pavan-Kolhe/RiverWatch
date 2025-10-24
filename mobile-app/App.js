import "react-native-gesture-handler"; // ADD THIS LINE AT TOP
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Provider as PaperProvider } from "react-native-paper";
import HomeScreen from "./src/screens/HomeScreen";
import CameraScreen from "./src/screens/CameraScreen";
import ReadingEntryScreen from "./src/screens/ReadingEntryScreen";
import SuccessScreen from "./src/screens/SuccessScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: { backgroundColor: "#2563eb" },
            headerTintColor: "#fff",
            headerTitleStyle: { fontWeight: "bold" },
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: "RiverWatch" }}
          />
          <Stack.Screen
            name="Camera"
            component={CameraScreen}
            options={{ title: "Capture Gauge Photo" }}
          />
          <Stack.Screen
            name="ReadingEntry"
            component={ReadingEntryScreen}
            options={{ title: "Enter Reading" }}
          />
          <Stack.Screen
            name="Success"
            component={SuccessScreen}
            options={{ title: "Success", headerLeft: null }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
