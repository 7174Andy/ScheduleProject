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
import IconButton from "../components/ui/IconButton";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ref,
  get,
  orderByChild,
  startAt,
  endAt,
  query,
  update,
  transaction,
} from "firebase/database";
import db from "../config/firebaseConfig";
import { useNavigation } from "@react-navigation/native";

import FriendList from "../components/ui/FriendList";

export default function FriendsScreen() {
  const [user, setUser] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [users, setUsers] = useState([]);
  const [friends, setFriends] = useState([]); // State for friends list
  const [friendRequests, setFriendRequests] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDataJson = await AsyncStorage.getItem("userData");
        if (userDataJson !== null) {
          const userData = JSON.parse(userDataJson);
          setUser(userData);
          if (userData.friends) {
            fetchFriends(userData.friends); // Fetch friends using the list of UIDs
          } else {
            setFriends([]);
          }
          if (userData.friendRequests) {
            fetchFriendRequests(userData.friendRequests); // Fetch friend requests using the list of UIDs
          } else {
            setFriendRequests([]);
          }
        }
      } catch (error) {
        console.error("Failed to load user data from storage", error);
      }
    };

    fetchUserData();
  }, []);

  const fetchFriends = async (friendUids) => {
    const friendsData = [];
    for (const uid of friendUids) {
      const friendRef = ref(db, `db/${uid}`);
      const snapshot = await get(friendRef);
      if (snapshot.exists()) {
        friendsData.push({ uid, ...snapshot.val() });
      }
    }
    setFriends(friendsData);
  };

  const fetchFriendRequests = async (requestUids) => {
    const requestsData = [];
    for (const uid of requestUids) {
      const requestRef = ref(db, `db/${uid}`);
      const snapshot = await get(requestRef);
      if (snapshot.exists()) {
        requestsData.push({ uid, ...snapshot.val() });
      }
    }
    setFriendRequests(requestsData);
  };

  const handleSearchInputChange = async (text) => {
    const searchText = text.toLowerCase();
    const currentUserUid = await AsyncStorage.getItem("uid");
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
        const fetchedUsers = [];
        snapshot.forEach((childSnapshot) => {
          const userData = childSnapshot.val();
          if (childSnapshot.key !== currentUserUid) {
            // Check if user is not the current user
            fetchedUsers.push({
              nickname: userData.nickname,
              firstName: userData.firstName,
              lastName: userData.lastName,
              uid: childSnapshot.key, // Use userData.uid instead of childSnapshot.key
            });
          }
        });
        setUsers(fetchedUsers);

        setSearchInput("");
        // NOTE also setUsers([]); ?
        navigation.navigate("SearchResults", {
          searchText: searchText,
          results: fetchedUsers,
        });
      } catch (error) {
        console.error("Error querying nicknames:", error);
      }
    } else {
      setUsers([]); // Reset users array if search text is empty
      navigation.navigate("Friends");
    }
  };

  const renderFriend = (friend) => (
    <FriendList
      friend={friend}
      handleUnfollow={handleRemoveFriend}
      handleViewSchedule={() =>
        navigation.navigate("FriendSchedule", { friendId: friend.uid })
      }
    />
  );

  const renderFriendRequest = (request) => (
    <View key={request.uid} style={styles.userContainer}>
      <Text>
        {request.firstName} {request.lastName}
      </Text>
      <Button
        title="Accept"
        onPress={() => handleAcceptFriendRequest(request)}
      />
      <Button
        title="Decline"
        onPress={() => handleDeclineFriendRequest(request)}
      />
    </View>
  );

  const handleRemoveFriend = async (friend) => {
    try {
      const currentUserUid = await AsyncStorage.getItem("uid");
      const currentUserRef = ref(db, `db/${currentUserUid}`);
      const friendRef = ref(db, `db/${friend.uid}`);

      // Update current user's data
      await update(currentUserRef, {
        friends: friends.filter((user) => user.uid !== friend.uid),
      });

      // Update friend's data
      await update(friendRef, {
        friends: friend.friends.filter((uid) => uid !== currentUserUid),
      });

      // Update local state
      setFriends((prevFriends) =>
        prevFriends.filter((user) => user.uid !== friend.uid)
      );

      // Update AsyncStorage
      const userDataJson = await AsyncStorage.getItem("userData");
      const userData = JSON.parse(userDataJson);
      userData.friends = friends;
      AsyncStorage.setItem("userData", JSON.stringify(userData));

      console.log("Friend removed:", friend);
    } catch (error) {
      console.error("Error removing friend:", error);
    }
  };

  const handleAcceptFriendRequest = async (request) => {
    try {
      const currentUserUid = await AsyncStorage.getItem("uid");
      const currentUserRef = ref(db, `db/${currentUserUid}`);
      const requestingUserRef = ref(db, `db/${request.uid}`);

      const currentUserSnapshot = await get(currentUserRef);
      const requestingUserSnapshot = await get(requestingUserRef);

      const currentUserData = currentUserSnapshot.val();
      const requestingUserData = requestingUserSnapshot.val();

      // Remove request from current user's friendRequests
      if (currentUserData.friendRequests) {
        currentUserData.friendRequests = currentUserData.friendRequests.filter(
          (uid) => uid !== request.uid
        );
      }

      // Add to current user's friends list
      if (!currentUserData.friends) {
        currentUserData.friends = [];
      }
      currentUserData.friends.push(request.uid);

      // Add to requesting user's friends list
      if (!requestingUserData.friends) {
        requestingUserData.friends = [];
      }
      requestingUserData.friends.push(currentUserUid);

      // Update both users
      await update(currentUserRef, {
        friendRequests: currentUserData.friendRequests,
        friends: currentUserData.friends,
      });
      await update(requestingUserRef, {
        friends: requestingUserData.friends,
      });

      // Update local state
      setFriendRequests((prev) =>
        prev.filter((user) => user.uid !== request.uid)
      );
      setFriends((prev) => [...prev, { ...request }]);

      // Update AsyncStorage
      const userDataJson = await AsyncStorage.getItem("userData");
      const userData = JSON.parse(userDataJson);
      userData.friends = friends;
      userData.friendRequests = friendRequests;
      AsyncStorage.setItem("userData", JSON.stringify(userData));

      console.log("Friend request accepted.");
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  const handleDeclineFriendRequest = async (request) => {
    try {
      const currentUserUid = await AsyncStorage.getItem("uid");
      const currentUserRef = ref(db, `db/${currentUserUid}`);

      const currentUserSnapshot = await get(currentUserRef);
      const currentUserData = currentUserSnapshot.val();

      // Remove request from current user's friendRequests
      if (currentUserData.friendRequests) {
        currentUserData.friendRequests = currentUserData.friendRequests.filter(
          (uid) => uid !== request.uid
        );
      }

      // Update the user
      await update(currentUserRef, {
        friendRequests: currentUserData.friendRequests,
      });

      // Update local state
      setFriendRequests((prev) =>
        prev.filter((user) => user.uid !== request.uid)
      );

      // Update AsyncStorage
      const userDataJson = await AsyncStorage.getItem("userData");
      const userData = JSON.parse(userDataJson);
      userData.friendRequests = friendRequests;
      AsyncStorage.setItem("userData", JSON.stringify(userData));

      console.log("Friend request declined.");
    } catch (error) {
      console.error("Error declining friend request:", error);
    }
  };

  return (
    <SafeAreaView style={styles.background}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.hashtagInput}
          placeholder="#hashtag"
          value={searchInput}
          placeholderTextColor="white"
          onChangeText={handleSearchInputChange}
        />
        <Pressable style={styles.searchButton}>
          <IconButton icon="search" color="white" size={20} />
        </Pressable>
      </View>
      <View style={styles.containerContainer}>
        {/* <View style={styles.container}> */}
        <ScrollView style={styles.container}>
          <Text style={styles.containerTitle}>Friends</Text>
          <View style={styles.containerLine} />
          {friends.map(renderFriend)}
          {/* </View> */}
        </ScrollView>
        <ScrollView style={styles.container}>
          <Text style={styles.containerTitle}>Requests</Text>
          <View style={styles.containerLine} />
          {friendRequests.map(renderFriendRequest)}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: colors.backgroundColor,
    flex: 1,
  },
  title: {
    color: "white",
    fontSize: 32,
    fontWeight: "700",
    margin: 16,
    paddingBottom: 0,
  },
  inputContainer: {
    flexDirection: "row",
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
  containerContainer: {
    flexDirection: "column",
    width: "100%",
    height: "85%",
  },
  container: {
    margin: 10,
    backgroundColor: "white",
    width: "5",
    height: "40%",
    paddingTop: 10,
    paddingHorizontal: 5,
    borderRadius: 15,
    flex: 1,
  },
  containerTitle: {
    color: "black",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 2,
    marginLeft: 12,
  },
  containerLine: {
    marginHorizontal: 10,
    marginVertical: 5,
    height: 1,
    backgroundColor: "grey",
    width: "92%",
  },
  friendContainer: {
    marginHorizontal: 10,
    marginVertical: 5,
  },
  friendName: {
    color: "black",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 12,
  },
  searchButton: {
    marginBottom: 10,
    marginRight: 10,
    marginLeft: 1,
    marginTop: 25,
    padding: 0,
    flex: 1,
  },
});
