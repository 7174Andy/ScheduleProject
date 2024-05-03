import React, { useState, useEffect } from 'react';
import { ScrollView, Pressable, SafeAreaView, View, Text, TextInput, StyleSheet, Button } from 'react-native';
import colors from "../config/colors";
import IconButton from "../components/ui/IconButton";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ref, get, orderByChild, startAt, endAt, query, update, transaction } from 'firebase/database';
import db from '../config/firebaseConfig';


export default function SearchResultsScreen({ route }) {
  const navigation = useNavigation();
  const { searchText, results } = route.params;
  const [users, setUsers] = useState(results);
  const [searchInput, setSearchInput] = useState(searchText);

  const handleSearchInputChange = async (text) => {
    const searchText = text.toLowerCase();
    const currentUserUid = await AsyncStorage.getItem("uid");
    setSearchInput(searchText);
    if (searchText.trim().length > 0) {
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
    }
    if (text.length === 0) {
      navigation.navigate('FriendsMain', { searchText: '' });
    }
  };

  const renderUser = (user) => {
    return (
      <View key={user.uid} style={styles.userCard}>
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
  
      if (!friendRequests.includes(currentUserUid)) {
        // If the current user's UID is not already in the clicked user's friendRequests list,
        // add it to the list
        friendRequests.push(currentUserUid);
  
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
    <SafeAreaView style={styles.background}>
        <View style={styles.inputContainer}>
            <TextInput
            style={styles.hashtagInput}
            placeholder="#hashtag"
            placeholderTextColor="white"
            value={searchInput}
            onChangeText={handleSearchInputChange}
            autoFocus={true}
            />
            <Pressable style={styles.searchButton}>
                <IconButton icon="search" color="white" size={20} />
            </Pressable>
        </View>
        <ScrollView>
         {users.map(renderUser)}
       </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: '80%',
  },
  background: {
    backgroundColor: colors.backgroundColor,
    flex: 1,
  },
  hashtagInput: {
    marginLeft: 10,
    marginBottom: 10,
    marginTop: 25,
    padding: 8,
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 25,
    color: "white",
    flex: 7,
  },
  inputContainer: {
    flexDirection: "row",
  },
  searchButton: {
    marginBottom: 10,
    marginRight: 10,
    marginLeft: 1,
    marginTop: 25,
    padding: 0,
    flex: 1,
  },
  userCard: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: 'center',
  },
});
