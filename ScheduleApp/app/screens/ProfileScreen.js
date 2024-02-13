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
        <View style={styles.hashtagContainer}>
          <View style={styles.oneHashTag}>
            <Text style={styles.hashtagText}># Sixth College</Text>
          </View>
          <View style={styles.oneHashTag}>
            <Text style={styles.hashtagText}># Bioinformatics Major</Text>
          </View>
        </View>
        <View style={styles.hashtagContainerSecond}>
          <View style={styles.oneHashTag}>
            <Text style={styles.hashtagText}># Sophomore</Text>
          </View>
          <View style={styles.oneHashTag}>
            <Text style={styles.hashtagText}># Data Science Minor</Text>
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
  hashtagContainer: {
    flex: 0,
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
    marginLeft: 10,
  },
  hashtagContainerSecond: {
    flex: 0,
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 5,
    marginLeft: 10,
  },
  hashtagText: {
    color: colors.textColor,
  },
  myCalendarBtn: {
    marginTop: 10,
    marginLeft: 15,
    backgroundColor: colors.tagColor,
    borderRadius: 6,
  },
  oneHashTag: {
    backgroundColor: colors.hashtag,
    borderRadius: 10,
    padding: 5,
    margin: 5,
    marginRight: 10,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    justifyContent: "center",
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
