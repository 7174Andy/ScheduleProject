import React from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import colors from "../config/colors";
import Calendar from "../component/Calendar";

export default function ProfileScreen() {
  const events = {
    mon: [
      {
        course: "ECE 109",
        startTime: 9,
        endTime: 10,
        enrollmentStatus: "enrolled",
        professor: "Prof. Smith",
      },
      {
        course: "Math 154 Midterm",
        startTime: 18,
        endTime: 20,
        enrollmentStatus: "enrolled",
        professor: "Prof. Johnson",
      },
    ],
    tue: [],
  };

  return (
    <SafeAreaView style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Weekly Schedule</Text>
        <View style={styles.calendarContainer}>
          <Calendar weeklyEvents={events} />
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
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "white",
  },
  calendarContainer: {
    flex: 1,
    marginTop: 20,
  },
});
