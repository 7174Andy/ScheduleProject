import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  Pressable,
  ScrollView,
  TextInput,
} from "react-native";

import colors from "../config/colors";
import { useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ref, get, orderByChild, startAt, endAt, query } from 'firebase/database';
import db from '../config/firebaseConfig';


export default function FriendsScreen() {
  const [user, setUser] = useState(null);
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDataJson = await AsyncStorage.getItem('userData');
        if (userDataJson !== null) {
          const userData = JSON.parse(userDataJson);
          setUser(userData);
        }
      } catch (error) {
        console.error('Failed to load user data from storage', error);
      }
    };

    fetchUserData();
  }, []);

  const handleSearchInputChange = async (text) => {
    setSearchInput(text);
    if (text.trim().length > 0) {
      try {
        const queryRef = query(ref(db, 'db'), orderByChild('nickname'), startAt(text));
        const snapshot = await get(queryRef);
        const users = [];
        snapshot.forEach((childSnapshot) => {
          const userData = childSnapshot.val();
          users.push({
            nickname: userData.nickname,
            firstName: userData.firstName,
            lastName: userData.lastName
          });
        });
        console.log(users);
      } catch (error) {
        console.error('Error querying nicknames:', error);
      }
    }
  };

  return (
    <SafeAreaView>
      <TextInput
        style={styles.input}
        placeholder="Search for friends"
        value={searchInput}
        onChangeText={handleSearchInputChange}
      />
      <Text>Friends Screen</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
});