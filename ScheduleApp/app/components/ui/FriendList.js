import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import colors from "../../config/colors";
import { getUserProfilePic } from "../../util/http";
import React, { useState, useEffect } from "react";
import IconButton from "./IconButton";


function FriendList({ friend, handleUnfollow, handleViewSchedule }) {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getUserProfilePic(friend.uid);
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [friend.uid]);

  

  return (
    <View style={styles.friendListContainer}>
      <View style={styles.friendListInfo}>
        <View style={styles.friendsUserContainer}>
          <Image
            style={[styles.userImage, { borderRadius: styles.userImage.width / 2 }]}
            source={userData ? { uri: userData } : require("../../assets/user.png")}
          />
          <View style={styles.userNameID}>
            <Text style={styles.userName}>
              {friend.firstName + " " + friend.lastName}
            </Text>
            <Text style={styles.userTag}>{"@" + friend.nickname}</Text>
          </View>
        </View>
        <View style={styles.buttonsContainer}>
          <Pressable style={styles.unfollowBtn} onPress={() => handleUnfollow(friend)}>
            <IconButton icon="person-remove-outline" color="white" size={20} onPress={() => handleUnfollow(friend)}/>
          </Pressable>
          <Pressable
            style={styles.viewScheduleBtn}
            onPress={handleViewSchedule}
          >
            <IconButton icon="calendar" color="white" size={20} onPress={handleViewSchedule}/>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  friendListContainer: {
    backgroundColor: "#ffffff",
    width: "100%",
    justifyContent: "center",
    padding: 10,
    marginBottom: 5,
    borderRadius: 5,
  },
  friendListInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  friendsUserContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  userImage: {
    height: 45,
    width: 45,
    marginRight: 10,
  },
  userName: {
    color: "#6B6B6B",
    fontSize: 15,
    fontWeight: "bold",
  },
  userNameID: {
    flexDirection: "column",
  },
  userTag: {
    color: colors.greyBtn,
    fontSize: 13,
  },
  unfollowBtn: {
    borderRadius: 15,
    backgroundColor: colors.greyBtn,
    padding: 0,
    justifyContent: "center",
    marginHorizontal: 5,
  },
  viewScheduleBtn: {
    borderRadius: 15,
    backgroundColor: colors.greyBtn,
    padding: 0,
    justifyContent: "center",
    marginHorizontal: 5,
  },
  buttonsContainer: {
    flexDirection: "row",
    marginLeft: 'auto',
  },
 
});

export default FriendList;
