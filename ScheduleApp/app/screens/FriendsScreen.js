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
import { ref, get, orderByChild, startAt, endAt, query, update, transaction } from 'firebase/database';
import db from '../config/firebaseConfig';
import { useNavigation } from '@react-navigation/native';



export default function FriendsScreen() {
  const [user, setUser] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [users, setUsers] = useState([]);
  const [friends, setFriends] = useState([]); // State for friends list
  const [friendRequests, setFriendRequests] = useState([]);
  const navigation = useNavigation();


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDataJson = await AsyncStorage.getItem('userData');
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
        console.error('Failed to load user data from storage', error);
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

  const renderFriend = friend => (
    <View key={friend.uid} style={styles.userContainer}>
      <Text>{friend.firstName} {friend.lastName}</Text>
      <Button title="Remove" onPress={() => handleRemoveFriend(friend)} />
      <Button 
        title="View Schedule"
        onPress={() => navigation.navigate('FriendSchedule', { friendId: friend.uid })}
      ></Button>
    </View>
  );

  const renderFriendRequest = request => (
    <View key={request.uid} style={styles.userContainer}>
      <Text>{request.firstName} {request.lastName}</Text>
      <Button title="Accept" onPress={() => handleAcceptFriendRequest(request)} />
      <Button title="Decline" onPress={() => handleDeclineFriendRequest(request)} />
    </View>
  );

  const handleRemoveFriend = async (friend) => {
    try {
      const currentUserUid = await AsyncStorage.getItem("uid");
      const currentUserRef = ref(db, `db/${currentUserUid}`);
      const friendRef = ref(db, `db/${friend.uid}`);
  
      // Update current user's data
      await update(currentUserRef, {
        friends: friends.filter(user => user.uid !== friend.uid)
      });
  
      // Update friend's data
      await update(friendRef, {
        friends: friend.friends.filter(uid => uid !== currentUserUid)
      });
  
      // Update local state
      setFriends(prevFriends => prevFriends.filter(user => user.uid !== friend.uid));

      // Update AsyncStorage
      const userDataJson = await AsyncStorage.getItem('userData')
      const userData = JSON.parse(userDataJson);
      userData.friends = friends;
      AsyncStorage.setItem('userData', JSON.stringify(userData));
      
  
      console.log("Friend removed:", friend);
    } catch (error) {
      console.error('Error removing friend:', error);
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
        currentUserData.friendRequests = currentUserData.friendRequests.filter(uid => uid !== request.uid);
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
        friends: currentUserData.friends 
      });
      await update(requestingUserRef, { 
        friends: requestingUserData.friends 
      });

      // Update local state
      setFriendRequests(prev => prev.filter(user => user.uid !== request.uid));
      setFriends(prev => [...prev, { ...request }]);

      // Update AsyncStorage
      const userDataJson = await AsyncStorage.getItem('userData')
      const userData = JSON.parse(userDataJson);
      userData.friends = friends;
      userData.friendRequests = friendRequests;
      AsyncStorage.setItem('userData', JSON.stringify(userData));
  
      console.log("Friend request accepted.");
    } catch (error) {
      console.error('Error accepting friend request:', error);
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
        currentUserData.friendRequests = currentUserData.friendRequests.filter(uid => uid !== request.uid);
      }
  
      // Update the user
      await update(currentUserRef, { 
        friendRequests: currentUserData.friendRequests 
      });

      // Update local state
      setFriendRequests(prev => prev.filter(user => user.uid !== request.uid));

      // Update AsyncStorage
      const userDataJson = await AsyncStorage.getItem('userData')
      const userData = JSON.parse(userDataJson);
      userData.friendRequests = friendRequests;
      AsyncStorage.setItem('userData', JSON.stringify(userData));
  
      console.log("Friend request declined.");
    } catch (error) {
      console.error('Error declining friend request:', error);
    }
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
      <ScrollView style={{ flex: 1 }}>
        <Text style={styles.sectionTitle}>Friends</Text>
        {friends.map(renderFriend)}
      </ScrollView>
      <ScrollView style={{ flex: 1 }}>
        <Text style={styles.sectionTitle}>Friend Requests</Text>
        {friendRequests.map(renderFriendRequest)}
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    paddingVertical: 10,
  },
});
