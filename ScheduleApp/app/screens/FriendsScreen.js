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

import colors from "../config/colors";
import { useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function FriendsScreen() {
  const [user, setUser] = useState(null);  // State to hold user data

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDataJson = await AsyncStorage.getItem('userData');
        if (userDataJson !== null) {
          const userData = JSON.parse(userDataJson);
          setUser(userData);
        }
        console.log(user);
      } catch (error) {
        console.error('Failed to load user data from storage', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <SafeAreaView>
      <Text>Friends Screen</Text>
    </SafeAreaView>
  );
}
