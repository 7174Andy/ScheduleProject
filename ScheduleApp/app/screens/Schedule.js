import React from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import colors from "../config/colors";
import Calendar from "../component/Calendar";

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Time Table</Text>
        <View style={styles.calendarContainer}>
          <Calendar />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: colors.backgroundColor,
    flex: 1,
  },
  container: {
    flex: 1,
    paddingVertical: 40,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "white",
  },
  calendarContainer: {
    flex: 1,
    marginTop: 20,
  },
});
