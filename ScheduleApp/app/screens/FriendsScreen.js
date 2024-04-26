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
import { ref, get, orderByChild, startAt, endAt, query, update } from 'firebase/database';
import db from '../config/firebaseConfig';


export default function FriendsScreen() {
  const [user, setUser] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [users, setUsers] = useState([]);

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
    const searchText = text.toLowerCase();
    const currentUserUid = await AsyncStorage.getItem("uid");
    setSearchInput(searchText);
    if (searchText.trim().length > 0) {
      console.log(currentUserUid);
      try {
        const queryRef = query(ref(db, 'db'), orderByChild('nickname'), startAt(searchText), endAt(searchText + '\uf8ff'));
        const snapshot = await get(queryRef);
        const fetchedUsers = [];
        snapshot.forEach((childSnapshot) => {
          const userData = childSnapshot.val();
          if (childSnapshot.key !== currentUserUid) { // Check if user is not the current user
            fetchedUsers.push({
              nickname: userData.nickname,
              firstName: userData.firstName,
              lastName: userData.lastName,
              uid: childSnapshot.key // Use userData.uid instead of childSnapshot.key
            });
          }
        });
        setUsers(fetchedUsers);
      } catch (error) {
        console.error('Error querying nicknames:', error);
      }
    } else {
      setUsers([]); // Reset users array if search text is empty
    }
  };

  const renderUser = (user) => {
    return (
      <View key={user.uid} style={styles.userContainer}>
        <Text>{user.nickname}</Text>
        <Text>{user.firstName} {user.lastName}</Text>
        <Button title="Click" onPress={() => handleButtonClick(user)} />
      </View>
    );
  };

  const handleButtonClick = async (clickedUser) => {
    try {
      const currentUserUid = await AsyncStorage.getItem("uid");
  
      // Construct the path to the clicked user's friendRequests list in the database
      const friendRequestsRef = ref(db, `db/${clickedUser.uid}/friendRequests`);
  
      // Check if the current user's UID already exists in the clicked user's friendRequests list
      const friendRequestsSnapshot = await get(friendRequestsRef);
      const friendRequests = friendRequestsSnapshot.val() || [];

      console.log(friendRequests);
  
      if (!friendRequests.includes(currentUserUid)) {
        // If the current user's UID is not already in the clicked user's friendRequests list,
        // add it to the list
        friendRequests.push(currentUserUid);

        console.log(friendRequests);
  
        // Update the friendRequests list in the database using the update method
        await update(ref(db, `db/${clickedUser.uid}`), { friendRequests });
  
        console.log("Friend request sent to user:", clickedUser);
      } else {
        console.log("Friend request already sent to user:", clickedUser);
      }
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };
  

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search for friends"
        value={searchInput}
        onChangeText={handleSearchInputChange}
      />
      <ScrollView>
        {users.map(renderUser)}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  userContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.light,
  },
});