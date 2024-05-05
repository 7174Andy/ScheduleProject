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
import colors from "../../config/colors";

function FriendList({ friends }) {
  function onPressFunction() {
    console.log("unfollowed");
  }

  return (
    <View style={styles.friendListContainer}>
      <View style={styles.friendListInfo}>
        <View style={styles.friendsUserContainer}>
          <Image
            style={styles.userImage}
            source={require("../../assets/user.png")}
          />
          <View style={styles.userNameID}>
            <Text style={styles.userName}>First Last</Text>
            <Text style={styles.userTag}>@username</Text>
          </View>

          <Pressable style={styles.unfollowBtn} onPress={onPressFunction}>
            <Text
              style={{
                fontSize: 12,
                color: colors.textColor,
                paddingHorizontal: 5,
              }}
            >
              unfollow
            </Text>
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
    height: 60,
    justifyContent: "space-around",
    padding: 10,
    marginBottom: 5,
    borderRadius: 5,
  },
  friendListInfo: {
    color: "#000000",
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 15,
  },
  friendsUserContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    justifyContent: "auto",
  },
  userImage: {
    height: 45,
    width: 45,
    alignItems: "left",
    padding: 5,
    marginRight: 10,
  },

  userName: {
    color: "#6B6B6B",
    fontSize: 18,
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
    padding: 7,
    justifyContent: "center",
    marginLeft: "40%",
  },
});

export default FriendList;
