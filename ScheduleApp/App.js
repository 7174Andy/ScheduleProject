import { useContext, useEffect, useState, useCallback } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
//import AppLoading from 'expo-app-loading';
import * as SplashScreen from 'expo-splash-screen';

import ProfileScreen from "./app/screens/ProfileScreen";
import Schedule from "./app/screens/Schedule";
import FriendsScreen from "./app/screens/FriendsScreen";
import LoginScreen from "./app/screens/LoginScreen";
import SignupScreen from "./app/screens/SignupScreen";
import WelcomeScreen from "./app/screens/WelcomeScreen";

import { Colors } from './app/constants/styles';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthContextProvider, { AuthContext } from "./app/store/auth-context";
import IconButton from "./app/components/ui/IconButton";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function  AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary500 },
        headerTintColor: 'white',
        contentStyle: { backgroundColor: Colors.primary100 },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}

function AuthenticatedStack() {
  const authCtx = useContext(AuthContext);

  return (
    <Tab.Navigator screenOptions={{
      headerStyle: { backgroundColor: Colors.primary500 },
      headerTintColor: 'white',
      contentStyle: { backgroundColor: Colors.primary100 },
    }}>
           <Tab.Screen
             name="Home"
             component={Schedule}
             options={{
               tabBarLabel: "Home",
               tabBarIcon: ({ color, size }) => (
                 <MaterialCommunityIcons name="home" color={color} size={size} />
               ),
               headerRight: ({tintColor}) => (
                <IconButton
                  icon="exit"
                  color={tintColor}
                  size={24}
                  onPress={authCtx.logout}
                ></IconButton>
              ),
             }}
           />
           <Tab.Screen
             name="Friends"
             component={FriendsScreen}
             options={{
               tabBarLabel: "Friends",
               tabBarIcon: ({ color, size }) => (
                 <MaterialCommunityIcons
                   name="account-multiple"
                   color={color}
                   size={size}
                 />
               ),
               headerRight: ({tintColor}) => (
                <IconButton
                  icon="exit"
                  color={tintColor}
                  size={24}
                  onPress={authCtx.logout}
                ></IconButton>
              ),
             }}
           />
           <Tab.Screen
             name="Profile"
             component={ProfileScreen}
             options={{
               tabBarLabel: "Profile",
               tabBarIcon: ({ color, size }) => (
                 <MaterialCommunityIcons
                   name="account"
                   color={color}
                   size={size}
                 />
               ),
               headerRight: ({tintColor}) => (
                <IconButton
                  icon="exit"
                  color={tintColor}
                  size={24}
                  onPress={authCtx.logout}
                ></IconButton>
              ),
             }}
           />
         </Tab.Navigator>
  );
}

function Navigation() {
  const authCtx = useContext(AuthContext);

  return (
    <NavigationContainer>
      {!authCtx.isAuthenticated && <AuthStack />}
      {authCtx.isAuthenticated && <AuthenticatedStack />}
    </NavigationContainer>
  );
}

function Root() {
  const [appIsReady, setAppIsReady] = useState(false);
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await AsyncStorage.getItem('token');
      const storedUid = await AsyncStorage.getItem('uid');
      if (storedToken) {
        authCtx.authenticate(storedToken, storedUid);
      }

      setAppIsReady(true);
    }

    fetchToken();
  }, []);

  // if (isTryingLogin) {
  //   return <AppLoading />;
  // }

  // return <Navigation />;
  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);
 
  if (!appIsReady) {
    return null;
  }
 
  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <Navigation />
    </View>
  );

}

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <AuthContextProvider>
        <Root />
      </AuthContextProvider>
    </>
  );
}

const styles = StyleSheet.create({});
