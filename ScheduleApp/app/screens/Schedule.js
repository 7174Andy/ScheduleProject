import React from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import colors from "../config/colors";

export default function ProfileScreen() {
  return (
    <View style={styles.background}>
      <SafeAreaView>
        <View style={styles.container}>
          <Text style={styles.title}>Time Table</Text>
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
  container: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "white",
  },
});
