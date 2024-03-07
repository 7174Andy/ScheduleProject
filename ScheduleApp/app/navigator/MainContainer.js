import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  Pressable,
  ScrollView,
} from "react-native";
import React from "react";
import colors from "../config/colors";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";

import ProfileScreen from "../screens/ProfileScreen";
import FriendsScreen from "../screens/FriendsScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Tab Names
const homeName = "Home";
const friendName = "Friends";
const profileName = "Profile";

const Tab = createBottomTabNavigator();

const globalScreenOptions = {
  headerStyle: { backgroundColor: "#2C6BED" },
  headerTitleStyle: { color: "#26272c" },
  headerTintColor: "#26272c",
};

// #26272c
export default function MainContainer() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOption={globalScreenOptions}>
        <Tab.Screen name="Friends" component={FriendsScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
