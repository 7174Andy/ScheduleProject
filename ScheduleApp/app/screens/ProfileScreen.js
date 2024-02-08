import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  Pressable,
} from "react-native";

import colors from "../config/colors";

export default function ProfileScreen() {
  return (
    <View style={styles.background}>
      <SafeAreaView>
        <View style={styles.profileContainer}>
          <Image
            style={styles.profileImage}
            source={require("../assets/user.png")}
          />
          <View style={{ alignItems: "flex-start", flexDirection: "column" }}>
            <Text style={styles.profileName}>Nathan Chang</Text>
            <Text style={styles.profileTag}>@Jiwoong</Text>
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
              <Pressable
                style={styles.myCalendarBtn}
                onPress={() => console.log("My Calendar")}
              >
                <Text
                  style={{ fontSize: 15, padding: 7, color: colors.textColor }}
                >
                  My Calendar
                </Text>
              </Pressable>
              <Pressable
                style={styles.myCalendarBtn}
                onPress={() => console.log("Vibeee")}
              >
                <Text
                  style={{ fontSize: 15, padding: 7, color: colors.textColor }}
                >
                  Vibe
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: colors.backgroundColor,
    flex: 1,
  },
  myCalendarBtn: {
    marginTop: 10,
    marginLeft: 15,
    backgroundColor: colors.tagColor,
    borderRadius: 6,
  },
  profileContainer: {
    alignItems: "center",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: colors.marginToProfile,
  },
  profileImage: {
    height: 115,
    width: 115,
    marginRight: 10,
  },
  profileName: {
    color: colors.textColor,
    fontSize: 23,
    fontWeight: "bold",
    marginLeft: colors.marginToProfile,
  },
  profileTag: {
    fontSize: 15,
    marginLeft: colors.marginToProfile,
    marginTop: 10,
    color: colors.tagColor,
  },
});
