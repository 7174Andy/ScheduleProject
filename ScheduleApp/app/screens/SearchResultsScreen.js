import React, { useState, useEffect } from "react";
import { ScrollView, Pressable, SafeAreaView, View, Text, TextInput, StyleSheet, Button, Image } from "react-native";
import colors from "../config/colors";
import IconButton from "../components/ui/IconButton";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ref, get, orderByChild, startAt, endAt, query, update, transaction } from 'firebase/database';
import { app } from '../config/firebaseConfig';
import { getDatabase } from 'firebase/database';
import { getUserProfilePic } from '../util/http';

const db = getDatabase(app);

export default function SearchResultsScreen({ route }) {
  const navigation = useNavigation();
  const { searchText, results } = route.params;
  const [users, setUsers] = useState(results);
  const [searchInput, setSearchInput] = useState(searchText);

  useEffect(() => {
    // Function to fetch profile picture URLs for all users in results
    const fetchProfilePicUrls = async () => {
      const profilePicPromises = results.map(async (user) => {
        const profilePicUrl = await getUserProfilePic(user.uid);
        return { ...user, profilePicUrl };
      });
  
      // Wait for all promises to resolve
      const fetchedUsers = await Promise.all(profilePicPromises);
      setUsers(fetchedUsers);
    };
  
    // Call the function when the component mounts
    fetchProfilePicUrls();
  }, [results]);


  const handleSearchInputChange = async (text) => {
    const searchText = text;
    const currentUserUid = await AsyncStorage.getItem("uid");
    const currentUser = await AsyncStorage.getItem("userData");

    setSearchInput(searchText);
    if (searchText.trim().length > 0) {
      try {
        const queryRef = query(
          ref(db, "db"),
          orderByChild("nickname"),
          startAt(searchText),
          endAt(searchText + "\uf8ff")
        );
        const snapshot = await get(queryRef);

        const promises = [];
        snapshot.forEach((childSnapshot) => {
          const userData = childSnapshot.val();
          if (childSnapshot.key !== currentUserUid) {
            let state = "";
            // 이미 친구인 경우
            if (userData.friends && userData.friends.includes(currentUserUid)) {
              state = 'Friend';
            }
             // 이미 친구 요청한 경우
            if (userData.friendRequests && userData.friendRequests.includes(currentUserUid)) {
              state = 'Requested';
            }

            if (currentUser.friendRequests && currentUser.friendRequests.includes(childSnapshot.key)) {
              state = 'Received';
            }

            const promise = getUserProfilePic(childSnapshot.key).then((profilePicUrl) => ({
              nickname: userData.nickname,
              firstName: userData.firstName,
              lastName: userData.lastName,
              uid: childSnapshot.key,
              profilePicUrl: profilePicUrl,
              state: state,
            }));
            promises.push(promise);
          }
        });
        const fetchedUsers = await Promise.all(promises);

        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Error querying nicknames:", error);
      }
    }
    if (text.length === 0) {
      navigation.navigate("FriendsMain", { searchText: "" });
    }
  };

  const renderUser = (user) => {
    return (
        <View key={user.uid} style={styles.userCard}>
          <Image
            style={[styles.userCardImage, { borderRadius: styles.userCardImage.width / 2 }]}
            source={user.profilePicUrl ? { uri: user.profilePicUrl } : require("../assets/user.png")}
          />
          <View style={styles.userCardText}>
            <Text style={styles.userNickname}>{user.nickname}</Text>
            <Text style={styles.userFullName}>
              {user.firstName} {user.lastName}
            </Text>
          </View>
          <Pressable>
            <IconButton icon={user.state === 'Friend' ? 'people-outline' : user.state === 'Requested' ? 'push-outline' : user.state === 'Received' ? 'download-outline' : 'add-circle-outline'} 
              onPress={() => handleButtonClick(user)} color='white' size={20}/>
          </Pressable>
        </View>
    );
  };

  const handleButtonClick = async (clickedUser) => {
    try {
      if (clickedUser.state === '') {
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

          // users 리스트에서 clickedUser와 일치하는 element를 uid를 통해서 찾고, 그 유저의 state를 Requested로 변경
          const updatedUsers = users.map(user =>
            user.uid === clickedUser.uid ? { ...user, state: 'Requested' } : user
          );
          setUsers(updatedUsers);
        } else {
          console.log("Friend request already sent to user:", clickedUser);
        }
      }
    } catch (error) {
      console.error("Error sending friend request:", error);
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

      <ScrollView>{users.map(renderUser)}</ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: "80%",
  },
  background: {
    backgroundColor: "#B3C8CF",
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
    margin: 8,
    padding: 10,
    marginVertical: 5,
    borderBottomWidth: 1.5,
    borderColor: "lightgray",
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: "center",
  },

  userCardImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    marginLeft: 5,
  },

  userCardText: {
    flexDirection: "column",
    flex: 1,
  },

  userNickname: {
    fontWeight: "bold",
    fontSize: 17,
    color: "white",
  },

  userFullName: {
    color: "lightgray",
    paddingTop: 1,
  },
});