import { SafeAreaView, StyleSheet, Text, View, Image } from "react-native";
import React from "react";

import colors from "../config/colors";

export default function ProfileScreen() {
  return (
    <View style={styles.background}>
      <SafeAreaView>
        <View>
          <Image
            style={styles.profileImage}
            source={require("../assets/user.png")}
          />
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
  profileImage: {
    height: 100,
    width: 100,
  },
});
