import { useContext, useEffect, useState, useCallback } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
//import AppLoading from 'expo-app-loading';
import * as SplashScreen from "expo-splash-screen";

import ProfileScreen from "./app/screens/ProfileScreen";
import Schedule from "./app/screens/Schedule";
import FriendsScreen from "./app/screens/FriendsScreen";
import FriendScheduleScreen from "./app/screens/FriendScheduleScreen";
import SearchResultsScreen from "./app/screens/SearchResultsScreen";
import LoginScreen from "./app/screens/LoginScreen";
import SignupScreen from "./app/screens/SignupScreen";
import ManageScheduleScreen from "./app/screens/ManageScheduleScreen";
import EditProfileScreen from "./app/screens/EditProfileScreen";

import { Colors } from "./app/constants/styles";
import colors from './app/config/colors';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthContextProvider, { AuthContext } from "./app/store/auth-context";
import IconButton from "./app/components/ui/IconButton";
import Button from "./app/components/ui/Button";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const FriendsStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

function ProfileStackNavigator() {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name="ProfileMain"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <ProfileStack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ title: "Edit Profile" }}
      />
    </ProfileStack.Navigator>
  );
}

function FriendsStackNavigator() {
  return (
    <FriendsStack.Navigator>
      <FriendsStack.Screen
        name="FriendsMain"
        component={FriendsScreen}
        options={{ headerShown: false }}
      />
      <FriendsStack.Screen
        name="FriendSchedule"
        component={FriendScheduleScreen}
        options={{ headerShown: false }}
      />
      <FriendsStack.Screen
        name="SearchResults"
        component={SearchResultsScreen}
        options={{ headerShown: false }}
      />
    </FriendsStack.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.headerBackgroundColor},
        headerTintColor: "black",
        contentStyle: { backgroundColor: colors.backgroundColor },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}

function ScheduleOverview() {
  const authCtx = useContext(AuthContext);

  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary500 },
        headerTintColor: "white",
        contentStyle: { backgroundColor: Colors.primary100 },
      }}
    >
      <Tab.Screen
        name="Home"
        component={Schedule}
        options={({ navigation }) => ({
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
          headerRight: ({ tintColor }) => (
            <View style={{ flexDirection: "row" }}>
              <IconButton
                icon="exit"
                color={tintColor}
                size={28}
                onPress={authCtx.logout}
              />
              <IconButton
                icon="add"
                color={tintColor}
                size={28}
                onPress={() => navigation.navigate("ManageSchedule")}
              />
            </View>
          ),
        })}
      />
      <Tab.Screen
        name="Friends"
        component={FriendsStackNavigator}
        options={{
          tabBarLabel: "Friends",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="account-multiple"
              color={color}
              size={size}
            />
          ),
          headerRight: ({ tintColor }) => (
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
        component={ProfileStackNavigator}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
          headerRight: ({ tintColor }) => (
            <IconButton
              icon="exit"
              color={tintColor}
              size={24}
              onPress={authCtx.logout}
            ></IconButton>
          ),
        }}
      />
      <Tab.Screen name="ProfileEdit" component={EditProfileScreen}/>
    </Tab.Navigator>
  );
}

function AuthenticatedStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ScheduleOverview"
        component={ScheduleOverview}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ManageSchedule"
        component={ManageScheduleScreen}
        options={{
          presentation: "modal",
        }}
      />
    </Stack.Navigator>
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
      const storedToken = await AsyncStorage.getItem("token");
      const storedUid = await AsyncStorage.getItem("uid");
      if (storedToken) {
        authCtx.authenticate(storedToken, storedUid);
      }

      setAppIsReady(true);
    };

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
      <StatusBar style="gray" />
      <AuthContextProvider>
        <Root />
      </AuthContextProvider>
    </>
  );
}

const styles = StyleSheet.create({});
