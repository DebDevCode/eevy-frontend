import React from "react";
import { LogBox } from "react-native";
LogBox.ignoreAllLogs();
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { FontAwesome5 } from "@expo/vector-icons";

import SignInScreen from "./screens/connection/SignInScreen";
import SignUpScreen from "./screens/connection/SignUpScreen";
import SignUpScreen2 from "./screens/connection/SignUpScreen2";
import ReservationScreen from "./screens/ReservationScreen";
import MaBorneScreen from "./screens/MaBorneScreen";
import MesRechargesScreen from "./screens/MesRechargesScreen";
import MapScreen from "./screens/MapScreen";

import { Provider } from "react-redux";
import user from "./reducers/user";
import reservation from "./reducers/reservation";
import constants from "./reducers/constants";
import { persistStore, persistReducer } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { combineReducers, configureStore } from "@reduxjs/toolkit";

const reducers = combineReducers({ user, reservation, constants });

const persistConfig = { key: "eevy", storage: AsyncStorage };

// const store = configureStore({
//   reducer: persistReducer(persistConfig, reducers),
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({ serializableCheck: false }),
// });

const store = configureStore({
  reducer: { user, reservation, constants },
});

// const persistor = persistStore(store);

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const TopTab = createMaterialTopTabNavigator();

import { useSafeAreaInsets } from "react-native-safe-area-context";
import ProfilScreen from "./screens/ProfilScreen";

const TopTabNavigator = () => {
  const insets = useSafeAreaInsets();
  return (
    <TopTab.Navigator
      initialRouteName="Mes Recharges"
      screenOptions={{
        // tabBarItemStyle: {
        //   width: 200,
        // },
        headerShown: false,
        tabBarActiveTintColor: "#00D369",
        tabBarStyle: {
          backgroundColor: "white",
          marginTop: insets.top,
          backgroundColor: "#121F3A",
        },
        tabBarInactiveTintColor: "#b2b2b2",
        tabBarIndicatorStyle: {
          backgroundColor: "#00D369",
          height: 3,
          borderRadius: 10,
          // width: "auto",
          // left: (Dimensions.get("window").width / 2 - w) / 2,
        },
        tabBarIndicatorContainerStyle: {
          marginHorizontal: 25,
          paddingHorizontal: 50,
        },
        tabBarLabelStyle: {
          fontSize: 20,
          fontWeight: "600",
          textTransform: "none",
        },
      }}
    >
      <TopTab.Screen name="Ma Borne" component={MaBorneScreen} />
      <TopTab.Screen name="Mes Recharges" component={MesRechargesScreen} />
    </TopTab.Navigator>
  );
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = "";

          if (route.name === "Carte") {
            iconName = "map-marker-alt";
          } else if (route.name === "Profil") {
            iconName = "user";
          } else if (route.name === "Réservation") {
            iconName = "charging-station";
          }

          return <FontAwesome5 name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#00D369",
        tabBarInactiveTintColor: "#121F3A",
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 0,
          borderRadius: 50,
          paddingTop: 15,
          height: 100,
        },

        tabBarLabelStyle: { fontSize: 14, fontWeight: "600" },
      })}
    >
      <Tab.Screen name="Réservation" component={TopTabNavigator} />
      <Tab.Screen name="Carte" component={MapScreen} />
      <Tab.Screen name="Profil" component={ProfilScreen} />
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      {/* <PersistGate persistor={persistor}> */}
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen
            name="TabNavigator"
            component={TabNavigator}
            options={{ gestureEnabled: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      {/* </PersistGate> */}
    </Provider>
  );
}
